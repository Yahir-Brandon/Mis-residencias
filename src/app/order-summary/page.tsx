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
      const canvas = await html2canvas(summaryRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
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
    total,
    deliveryDates,
  } = orderData;

  const deliveryStart = deliveryDates.from ? format(new Date(deliveryDates.from), "PPP", { locale: es }) : 'N/A';
  const deliveryEnd = deliveryDates.to ? format(new Date(deliveryDates.to), "PPP", { locale: es }) : 'N/A';


  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
        <Card className="max-w-2xl mx-auto shadow-lg">
            <div ref={summaryRef} className="p-6">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline text-center">¡Pedido en Proceso!</CardTitle>
                    <CardDescription className="text-center">
                        Gracias por tu pedido. A continuación, te mostramos un resumen.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg border-b pb-2">Resumen del Pedido</h3>
                        <p><strong>Obra:</strong> {projectName}</p>
                        <p><strong>Solicitante:</strong> {requesterName}</p>
                        <p><strong>Teléfono:</strong> {phone}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg border-b pb-2">Dirección de Entrega</h3>
                        <p>{street} {number}</p>
                        <p>{municipality}, {state}, C.P. {postalCode}</p>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg border-b pb-2">Detalles del Pedido</h3>
                        <p><strong>Material:</strong> <span className="capitalize">{material}</span></p>
                        <p><strong>Cantidad:</strong> {quantity} {unit}(s)</p>
                        <p className="font-bold text-xl"><strong>Total:</strong> ${total.toFixed(2)} MXN</p>
                    </div>
                     <div className="space-y-2">
                        <h3 className="font-semibold text-lg border-b pb-2">Cronograma de Entrega</h3>
                        <p><strong>Periodo de entrega:</strong> {deliveryStart} - {deliveryEnd}</p>
                    </div>
                </CardContent>
            </div>
            <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
                <Button onClick={generatePdf} disabled={isGeneratingPdf}>
                    {isGeneratingPdf ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generando PDF...
                        </>
                    ) : (
                        <>
                            <FileDown className="mr-2 h-4 w-4" />
                            Descargar Resumen (PDF)
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
        <Suspense fallback={<div>Cargando...</div>}>
            <OrderSummaryContent />
        </Suspense>
    )
}

    