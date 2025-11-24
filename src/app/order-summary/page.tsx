'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader2, FileDown, Home } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(data));
        setOrderData(parsedData);
      } catch (error) {
        console.error("Failed to parse order data", error);
        router.push('/new-order');
      }
    } else {
       router.push('/new-order');
    }
  }, [searchParams, router]);

  const generatePdf = async () => {
    if (!summaryRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const canvas = await html2canvas(summaryRef.current, { 
        scale: 2,
        backgroundColor: null, // Use a transparent background
      });
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions to match canvas aspect ratio
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`pedido-${orderData.projectName || 'resumen'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!orderData) {
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
    material,
    quantity,
    unit,
    deliveryDates,
    total,
  } = orderData;
  
  const deliveryStart = new Date(deliveryDates.from);
  const deliveryEnd = new Date(deliveryDates.to);

  // Find the price for the material to calculate subtotal
  const materialsList = [
    { name: "cemento", price: 250, unit: "bulto" },
    { name: "mortero", price: 220, unit: "bulto" },
    { name: "cal", price: 80, unit: "bulto" },
    { name: "alambre", price: 15, unit: "kg" },
  ];
  const materialInfo = materialsList.find(m => m.name === material);
  const unitPrice = materialInfo?.price || 0;
  const subtotal = quantity * unitPrice;


  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
              <CardTitle className="text-3xl font-bold font-headline text-center">¡Pedido en Proceso!</CardTitle>
              <CardDescription className="text-center">
                  Gracias por tu compra. Revisa el resumen y descarga tu ticket.
              </CardDescription>
          </CardHeader>

          {/* PDF Content Start */}
          <div ref={summaryRef} className="p-8 bg-white text-black">
              <div className="flex justify-center items-center mb-4">
                  <Logo />
              </div>
              <Separator className="my-4 bg-gray-300" />
              
              <div className="text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <h3 className="font-bold uppercase">Solicitante:</h3>
                          <p>{requesterName}</p>
                      </div>
                      <div>
                          <h3 className="font-bold uppercase">Obra:</h3>
                          <p>{projectName}</p>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-bold uppercase">Dirección de Entrega:</h3>
                      <p>{street} {number}, {municipality}, {state}, C.P. {postalCode}</p>
                  </div>
                  <div>
                      <h3 className="font-bold uppercase">Teléfono:</h3>
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
                  <TableRow>
                    <TableCell className="capitalize">{material}</TableCell>
                    <TableCell className="text-center">{quantity} {unit}(s)</TableCell>
                    <TableCell className="text-right">${unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${subtotal.toFixed(2)}</TableCell>
                  </TableRow>
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
                      className="p-0"
                      classNames={{
                        head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                        cell: "h-8 w-8 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        day_today: "bg-primary/90 text-primary-foreground rounded-md",
                        day_range_start: "day-range-start !bg-red-500 !text-white",
                        day_range_end: "day-range-end !bg-green-500 !text-white",
                        day_range_middle: "aria-selected:bg-primary/20 aria-selected:text-primary-foreground"
                      }}
                      disabled
                   />
              </div>
          </div>
          {/* PDF Content End */}

          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6 bg-slate-50 rounded-b-lg">
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
