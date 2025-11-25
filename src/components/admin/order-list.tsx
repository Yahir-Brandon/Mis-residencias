'use client';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, doc, updateDoc, deleteDoc, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Loader2, AlertTriangle, ShoppingCart, MoreHorizontal, CheckCircle, Truck, Package, XCircle, Trash2, Eye, FileDown, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import { DeliveryMap } from '../maps/delivery-map';

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

type OrderStatus = 'Pendiente' | 'En proceso' | 'Enviado' | 'Entregado' | 'Cancelado';

const priorityStyles: {[key: string]: string} = {
    'Urgente': 'bg-red-500 hover:bg-red-500/80',
    'Pronto': 'bg-yellow-500 hover:bg-yellow-500/80',
    'Normal': 'bg-blue-500 hover:bg-blue-500/80',
}

const statusStyles: {[key in OrderStatus]: string} = {
    'Pendiente': 'border-gray-500/50 text-gray-500',
    'En proceso': 'border-blue-500/50 text-blue-500',
    'Enviado': 'border-purple-500/50 text-purple-500',
    'Entregado': 'border-green-500/50 text-green-500',
    'Cancelado': 'border-red-500/50 text-red-500 line-through',
}


export default function OrderList() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";


  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      setError(null);
      if (!firestore) {
        setIsLoading(false);
        return;
      }
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const allOrders: any[] = [];
        
        for (const userDoc of usersSnapshot.docs) {
          const ordersCollectionRef = collection(firestore, 'users', userDoc.id, 'orders');
          const ordersSnapshot = await getDocs(ordersCollectionRef);
          ordersSnapshot.forEach(orderDoc => {
            allOrders.push({ id: orderDoc.id, ...orderDoc.data() });
          });
        }
        
        allOrders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
        setOrders(allOrders);

      } catch (e: any) {
        console.error("Error fetching all orders:", e);
        setError(e);
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: '/users/{userId}/orders',
            operation: 'list',
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllOrders();
  }, [firestore]);


  const handleStatusChange = async (order: any, newStatus: OrderStatus) => {
    const orderDocRef = doc(firestore, 'users', order.userId, 'orders', order.id);
    try {
        await updateDoc(orderDocRef, { status: newStatus })
        .catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: orderDocRef.path,
                operation: 'update',
                requestResourceData: { status: newStatus }
            }));
            throw error;
        });

        // Create notification
        const notificationRef = collection(firestore, 'users', order.userId, 'notifications');
        const notificationMessage = `El estado de tu pedido para la obra "${order.projectName}" ha cambiado a: ${newStatus}.`;
        
        await addDoc(notificationRef, {
          userId: order.userId,
          orderId: order.id,
          message: notificationMessage,
          read: false,
          createdAt: serverTimestamp(),
        }).catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: notificationRef.path,
                operation: 'create',
                requestResourceData: { message: notificationMessage }
            }));
            // We don't re-throw here, as the status update was successful.
            console.error("Failed to create notification:", error);
        });

        setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? {...o, status: newStatus} : o));

        toast({
            title: "Estado del Pedido Actualizado",
            description: `El pedido ahora está "${newStatus}".`,
        });
    } catch (e) {
        console.error("Error al actualizar estado: ", e);
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo actualizar el estado del pedido.",
        });
    }
  }

  const handleDeleteOrder = async (userId: string, orderId: string) => {
    setIsDeleting(true);
    const orderDocRef = doc(firestore, 'users', userId, 'orders', orderId);
    try {
        await deleteDoc(orderDocRef)
        .catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: orderDocRef.path,
                operation: 'delete',
            }));
            throw error;
        });
        
        setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));

        toast({
            title: "Pedido Eliminado",
            description: "El pedido ha sido borrado permanentemente.",
        });
    } catch(e) {
        console.error("Error al eliminar pedido:", e);
        toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo eliminar el pedido.",
        });
    } finally {
      setIsDeleting(false);
    }
  }

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
  };

  const generatePdf = async () => {
    if (!selectedOrder) return;
    setIsGeneratingPdf(true);

    try {
        const doc = new jsPDF();
        const deliveryStart = new Date(selectedOrder.deliveryDates.from.seconds * 1000);
        const deliveryEnd = new Date(selectedOrder.deliveryDates.to.seconds * 1000);
        let finalTableY = 0;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Tlapaleria los Pinos', 105, 20, { align: 'center' });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const details = [
            { title: 'Solicitante:', content: selectedOrder.requesterName },
            { title: 'Obra:', content: selectedOrder.projectName },
            { title: 'Dirección:', content: `${selectedOrder.street} ${selectedOrder.number}, ${selectedOrder.colony}, ${selectedOrder.municipality}, ${selectedOrder.state}, C.P. ${selectedOrder.postalCode}` },
            { title: 'Teléfono:', content: selectedOrder.phone },
        ];

        doc.autoTable({
            startY: 30,
            body: details,
            theme: 'plain',
            styles: { cellPadding: { top: 1, right: 2, bottom: 1, left: 0 }, fontSize: 10 },
            columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 }, 1: { cellWidth: 'auto' } },
        });
        
        let lastY = (doc as any).lastAutoTable.finalY || 60;
        
        if (selectedOrder.location) {
            const { lat, lng } = selectedOrder.location;
            const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&maptype=roadmap&markers=color:red%7C${lat},${lng}&style=feature:all|element:labels|visibility:off&style=feature:road|element:geometry|color:0x999999&style=feature:road.local|element:labels.text.fill|color:0x333333&style=feature:water|element:geometry|color:0xa2daf2&key=${mapsApiKey}`;
            
            try {
                const response = await fetch(mapUrl);
                const imageBlob = await response.blob();
                const reader = new FileReader();
                reader.readAsDataURL(imageBlob);
                await new Promise<void>(resolve => {
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        doc.setFontSize(12);
                        doc.setFont('helvetica', 'bold');
                        doc.text('Ubicación de Entrega', 14, lastY + 10);
                        doc.addImage(base64data as string, 'PNG', 14, lastY + 15, 180, 70);
                        lastY += 85;
                        resolve();
                    };
                });
            } catch (mapError) {
                console.error("Error fetching static map for PDF:", mapError);
            }
        }
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Detalles del Pedido', 14, lastY + 10);

        const tableColumn = ["Descripción", "Cantidad", "P. Unitario", "Importe"];
        const tableRows = selectedOrder.materials.map((material: any) => {
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
                finalTableY = data.cursor?.y ?? 0;
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Página ${data.pageNumber} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }
        });
        
        finalTableY = (doc as any).lastAutoTable.finalY;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Total del Pedido:', 140, finalTableY + 10, { align: 'right' });
        doc.text(`$${selectedOrder.total.toFixed(2)} MXN`, 200, finalTableY + 10, { align: 'right' });

        doc.save(`pedido-${selectedOrder.projectName.replace(/\s/g, '_') || 'resumen'}.pdf`);

    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className="h-5 w-5" />
          <span>Pedidos de Clientes</span>
        </CardTitle>
        <CardDescription>Lista de todos los pedidos realizados en la plataforma.</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Obra</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    </TableCell>
                </TableRow>
                )}
                {error && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-destructive">
                    <div className="flex items-center justify-center gap-2">
                        <AlertTriangle className="h-5 w-5"/>
                        <span>Error al cargar pedidos: Permisos insuficientes.</span>
                    </div>
                    </TableCell>
                </TableRow>
                )}
                {!isLoading && !error && orders?.map((order) => {
                  const isFinalState = order.status === 'Entregado' || order.status === 'Cancelado';
                  return (
                    <TableRow key={order.id}>
                        <TableCell>
                        {order.createdAt ? format(order.createdAt.toDate(), 'dd/MM/yyyy', { locale: es }) : 'N/A'}
                        </TableCell>
                        <TableCell>{order.requesterName}</TableCell>
                        <TableCell>{order.projectName}</TableCell>
                        <TableCell>${order.total.toFixed(2)}</TableCell>
                        <TableCell>
                            <Badge className={priorityStyles[order.priority] || 'bg-gray-400'}>
                                {order.priority}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className={statusStyles[order.status as OrderStatus] || ''}>
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                <DialogTrigger asChild>
                                <DropdownMenuItem onSelect={() => handleViewDetails(order)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver Detalles del Pedido
                                </DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(order, 'En proceso')} 
                                  disabled={isFinalState || order.status === 'En proceso' || order.status === 'Enviado'}
                                >
                                    <Package className="mr-2 h-4 w-4" />
                                    Marcar como "En proceso"
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(order, 'Enviado')}
                                  disabled={isFinalState || order.status === 'Enviado'}
                                >
                                    <Truck className="mr-2 h-4 w-4" />
                                    Marcar como "Enviado"
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleStatusChange(order, 'Entregado')}
                                  disabled={isFinalState}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Marcar como "Entregado"
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-amber-600 focus:text-amber-700 focus:bg-amber-50" 
                                  onClick={() => handleStatusChange(order, 'Cancelado')}
                                  disabled={isFinalState}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar Pedido
                                </DropdownMenuItem>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Borrar Pedido
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Esto eliminará permanentemente el pedido de la base de datos.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteOrder(order.userId, order.id)} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Sí, borrar pedido'}
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>

                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                  );
                })}
                {!isLoading && !error && orders?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No se encontraron pedidos.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>

            <DialogContent className="max-w-3xl">
                {selectedOrder && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Resumen del Pedido: {selectedOrder.projectName}</DialogTitle>
                            <DialogDescription>
                                Realizado por {selectedOrder.requesterName} el {format(selectedOrder.createdAt.toDate(), 'dd/MM/yyyy', { locale: es })}.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            <div className="text-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-bold uppercase text-muted-foreground">Solicitante:</h3>
                                        <p>{selectedOrder.requesterName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold uppercase text-muted-foreground">Obra:</h3>
                                        <p>{selectedOrder.projectName}</p>
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="font-bold uppercase text-muted-foreground">Teléfono:</h3>
                                    <p>{selectedOrder.phone}</p>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold uppercase text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4"/>Ubicación de Entrega:</h3>
                                    <p>{selectedOrder.street} {selectedOrder.number}, {selectedOrder.colony}, {selectedOrder.municipality}, {selectedOrder.state}, C.P. {selectedOrder.postalCode}</p>
                                    <div className="h-[250px] w-full rounded-lg overflow-hidden border">
                                        <DeliveryMap apiKey={mapsApiKey} address="" initialCoordinates={selectedOrder.location} />
                                    </div>
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
                                {selectedOrder.materials.map((material: any, index: number) => {
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
                                    <TableCell className="text-right font-bold text-lg">${selectedOrder.total.toFixed(2)} MXN</TableCell>
                                </TableRow>
                                </TableFooter>
                            </Table>
                            
                            <Separator className="my-4 bg-gray-300" />
                            
                            <div className="flex flex-col items-center">
                                <h3 className="font-bold uppercase mb-2">Periodo de Entrega Programado</h3>
                                <p>
                                    Del {format(selectedOrder.deliveryDates.from.toDate(), 'PPP', { locale: es })} al {format(selectedOrder.deliveryDates.to.toDate(), 'PPP', { locale: es })}
                                </p>
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button onClick={generatePdf} disabled={isGeneratingPdf}>
                                {isGeneratingPdf ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Descargar PDF
                                    </>
                                )}
                            </Button>
                            <DialogClose asChild>
                                <Button variant="outline">Cerrar</Button>
                            </DialogClose>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
