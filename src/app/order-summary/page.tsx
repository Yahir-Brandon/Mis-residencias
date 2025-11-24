'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { format, getMonth, getYear, getDaysInMonth, startOfMonth, getDay, getDate, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, FileDown, Home } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


// Aumenta jsPDF con el método autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const materialsList = [
  { name: "cemento", price: 250, unit: "bulto" },
  { name: "mortero", price: 220, unit: "bulto" },
  { name: "cal", price: 80, unit: "bulto" },
  { name: "alambre", price: 15, unit: "kg" },
];


function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const firestore = useFirestore();

  const orderId = searchParams.get('id');

  const orderDocRef = useMemoFirebase(() => {
    return orderId ? doc(firestore, 'orders', orderId) : null;
  }, [firestore, orderId]);
  
  const { data: orderData, isLoading: isOrderLoading, error } = useDoc(orderDocRef);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOrderLoading && !orderData && orderId) {
        router.push('/new-order');
    }
  }, [orderData, isOrderLoading, orderId, router, error]);

  const generatePdf = async () => {
    if (!orderData) return;
    setIsGeneratingPdf(true);

    try {
      const doc = new jsPDF();
      const deliveryStart = new Date(orderData.deliveryDates.from.seconds * 1000);
      const deliveryEnd = new Date(orderData.deliveryDates.to.seconds * 1000);

      // Encabezado
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Tlapaleria los Pinos', 105, 20, { align: 'center' });

      // Información del Pedido
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const details = [
        { title: 'Solicitante:', content: orderData.requesterName },
        { title: 'Obra:', content: orderData.projectName },
        { title: 'Dirección:', content: `${orderData.street} ${orderData.number}, ${orderData.municipality}, ${orderData.state}, C.P. ${orderData.postalCode}` },
        { title: 'Teléfono:', content: orderData.phone },
      ];

      doc.autoTable({
        startY: 30,
        body: details,
        theme: 'plain',
        styles: {
          cellPadding: { top: 1, right: 2, bottom: 1, left: 0 },
          fontSize: 10,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 'auto' },
        },
      });
      
      const lastY = (doc as any).lastAutoTable.finalY || 60;
      
      // Tabla de Materiales
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detalles del Pedido', 14, lastY + 10);

      const tableColumn = ["Descripción", "Cantidad", "P. Unitario", "Importe"];
      const tableRows = orderData.materials.map((material: any) => {
        const materialInfo = materialsList.find(m => m.name === material.name);
        const unitPrice = materialInfo?.price || 0;
        const subtotal = material.quantity * unitPrice;
        return [
            material.name,
            `${material.quantity} ${materialInfo?.unit}(s)`,
            `$${unitPrice.toFixed(2)}`,
            `$${subtotal.toFixed(2)}`
        ];
      });

      doc.autoTable({
        startY: lastY + 15,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 10 },
        didDrawPage: (data) => {
          // Pie de página
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(`Página ${data.pageNumber} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
        }
      });
      
      let finalTableY = (doc as any).lastAutoTable.finalY;

      // Total
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Total del Pedido:', 140, finalTableY + 10, { align: 'right' });
      doc.text(`$${orderData.total.toFixed(2)} MXN`, 200, finalTableY + 10, { align: 'right' });

      // Calendario
      doc.setFontSize(12);
      doc.text('Periodo de Entrega Programado', 14, finalTableY + 25);
      
      const drawMonth = (date: Date, xOffset: number, yOffset: number) => {
        const month = getMonth(date);
        const year = getYear(date);
        const firstDayOfMonth = startOfMonth(date);
        const startDayOfWeek = (getDay(firstDayOfMonth) + 6) % 7;
        const daysInMonth = getDaysInMonth(date);
        const monthName = format(date, 'MMMM yyyy', { locale: es });
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(monthName.charAt(0).toUpperCase() + monthName.slice(1), xOffset + (3.5 * 7), yOffset, { align: 'center' });

        const cellWidth = 7;
        const cellHeight = 7;
        const startX = xOffset;
        const calendarY = yOffset + 5;
        const dayHeaders = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

        doc.setFontSize(8);
        dayHeaders.forEach((header, index) => {
            doc.text(header, startX + index * cellWidth + cellWidth / 2, calendarY, { align: 'center' });
        });

        let currentDay = 1;
        doc.setFont('helvetica', 'normal');
        doc.setLineWidth(0.2);

        for (let week = 0; week < 6; week++) {
            for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
                if ((week === 0 && dayOfWeek < startDayOfWeek) || currentDay > daysInMonth) {
                    continue;
                }
                const x = startX + dayOfWeek * cellWidth;
                const y = calendarY + (week + 1) * cellHeight;

                const currentDate = new Date(year, month, currentDay);
                const isStartDate = getDate(currentDate) === getDate(deliveryStart) && getMonth(currentDate) === getMonth(deliveryStart) && getYear(currentDate) === getYear(deliveryStart);
                const isEndDate = getDate(currentDate) === getDate(deliveryEnd) && getMonth(currentDate) === getMonth(deliveryEnd) && getYear(currentDate) === getYear(deliveryEnd);
                const isInRange = currentDate > deliveryStart && currentDate < deliveryEnd;
                
                const originalTextColor = doc.getTextColor();
                
                if (isStartDate) {
                    doc.setFillColor(220, 53, 69); // Rojo
                    doc.setTextColor(255, 255, 255);
                    doc.rect(x, y - cellHeight / 1.5, cellWidth, cellHeight, 'F');
                } else if (isEndDate) {
                    doc.setFillColor(25, 135, 84); // Verde
                    doc.setTextColor(255, 255, 255);
                    doc.rect(x, y - cellHeight / 1.5, cellWidth, cellHeight, 'F');
                } else if (isInRange) {
                    doc.setFillColor(233, 236, 239); // Gris claro
                    doc.rect(x, y - cellHeight / 1.5, cellWidth, cellHeight, 'F');
                }
                
                doc.text(String(currentDay), x + cellWidth / 2, y, { align: 'center' });
                doc.setTextColor(originalTextColor);

                currentDay++;
            }
            if (currentDay > daysInMonth) break;
        }
      };

      const startMonth = getMonth(deliveryStart);
      const endMonth = getMonth(deliveryEnd);
      
      let calendarYPos = finalTableY + 35;
      
      drawMonth(deliveryStart, 14, calendarYPos);

      if(startMonth !== endMonth) {
        drawMonth(deliveryEnd, 80, calendarYPos);
      }

      // Leyenda
      const legendY = calendarYPos + 6 * 7 + 10;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      // Fecha de Inicio
      doc.setFillColor(220, 53, 69); // Rojo
      doc.rect(14, legendY - 2, 3, 3, 'F');
      doc.text('Inicio de entrega', 20, legendY);

      // Fecha de Fin
      doc.setFillColor(25, 135, 84); // Verde
      doc.rect(50, legendY - 2, 3, 3, 'F');
      doc.text('Fin de entrega', 56, legendY);

      doc.save(`pedido-${orderData.projectName.replace(/\s/g, '_') || 'resumen'}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isOrderLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!orderData) {
    // This can happen briefly before the redirect.
    return (
       <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }


  const {
    requesterName,
    projectName,
    phone,
    street,
    number,
    postalCode,
    state,
    municipality,
    materials,
    deliveryDates,
    total,
  } = orderData;
  
  const deliveryStart = new Date(deliveryDates.from.seconds * 1000);
  const deliveryEnd = new Date(deliveryDates.to.seconds * 1000);

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline text-center">¡Pedido en Proceso!</CardTitle>
              <CardDescription className="text-center">
                  Gracias por tu compra. Revisa el resumen y descarga tu ticket.
              </CardDescription>
          </CardHeader>

          {/* Este contenido es solo para mostrar, el PDF se genera programáticamente */}
          <div ref={summaryRef} className="p-6 sm:p-8 bg-white text-black rounded-lg">
              <div className="flex justify-center items-center mb-4">
                  <Logo />
              </div>
              <Separator className="my-4 bg-gray-300" />
              
              <div className="text-sm space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <h3 className="font-bold uppercase text-muted-foreground">Solicitante:</h3>
                          <p>{requesterName}</p>
                      </div>
                      <div>
                          <h3 className="font-bold uppercase text-muted-foreground">Obra:</h3>
                          <p>{projectName}</p>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-bold uppercase text-muted-foreground">Dirección de Entrega:</h3>
                      <p>{street} {number}, {municipality}, {state}, C.P. {postalCode}</p>
                  </div>
                  <div>
                      <h3 className="font-bold uppercase text-muted-foreground">Teléfono:</h3>
                      <p>{phone}</p>
                  </div>
              </div>

              <Separator className="my-4 bg-gray-300" />
              
              <h3 className="font-bold uppercase text-center mb-2">Detalles del Pedido</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">P. Unitario</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material: any, index: number) => {
                    const materialInfo = materialsList.find(m => m.name === material.name);
                    const unitPrice = materialInfo?.price || 0;
                    const subtotal = material.quantity * unitPrice;
                    return (
                      <TableRow key={index}>
                        <TableCell className="capitalize">{material.name}</TableCell>
                        <TableCell className="text-center">{material.quantity} {materialInfo?.unit}(s)</TableCell>
                        <TableCell className="text-right">${unitPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold text-lg">Total del Pedido:</TableCell>
                    <TableCell className="text-right font-bold text-lg">${total.toFixed(2)} MXN</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
              
              <Separator className="my-4 bg-gray-300" />
              
              <div className="flex flex-col items-center">
                  <h3 className="font-bold uppercase mb-2">Periodo de Entrega Programado</h3>
                   <Calendar
                      mode="range"
                      selected={{ from: deliveryStart, to: deliveryEnd }}
                      defaultMonth={deliveryStart}
                      locale={es}
                      numberOfMonths={2}
                      className="p-0"
                      classNames={{
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                        cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                        day_selected: "bg-primary/20 text-primary-foreground",
                        day_today: "bg-primary/90 text-primary-foreground rounded-md",
                        day_range_start: "day-range-start !bg-red-500 !text-white rounded-md",
                        day_range_end: "day-range-end !bg-green-500 !text-white rounded-md",
                        day_range_middle: "aria-selected:bg-primary/20 aria-selected:text-primary-foreground"
                      }}
                      disabled
                   />
              </div>
          </div>

          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6 bg-slate-50 rounded-b-lg border-t">
              <Button onClick={generatePdf} disabled={isGeneratingPdf}>
                  {isGeneratingPdf ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generando PDF...
                      </>
                  ) : (
                      <>
                          <FileDown className="mr-2 h-4 w-4" />
                          Descargar Ticket (PDF)
                      </>
                  )}
              </Button>
               <Button variant="outline" onClick={() => router.push('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Inicio
              </Button>
          </CardFooter>
      </Card>
    </div>
  );
}

export default function OrderSummaryPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <OrderSummaryContent />
        </Suspense>
    )
}

    