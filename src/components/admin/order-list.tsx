'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertTriangle, ShoppingCart, MoreHorizontal, CheckCircle, Truck, Package, XCircle, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

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
  const ordersCollectionRef = useMemoFirebase(() => query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: orders, isLoading, error } = useCollection(ordersCollectionRef);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const orderDocRef = doc(firestore, 'orders', orderId);
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

  const handleDeleteOrder = async (orderId: string) => {
    const orderDocRef = doc(firestore, 'orders', orderId);
    try {
        await deleteDoc(orderDocRef)
        .catch(error => {
            errorEmitter.emit('permission-error', new FirestorePermissionError({
                path: orderDocRef.path,
                operation: 'delete',
            }));
            throw error;
        });

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
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className="h-5 w-5" />
          <span>Pedidos de Clientes</span>
        </CardTitle>
        <CardDescription>Lista de todos los pedidos realizados.</CardDescription>
      </CardHeader>
      <CardContent>
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
            {!isLoading && !error && orders?.map((order) => (
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'En proceso')}>
                            <Package className="mr-2 h-4 w-4" />
                            Marcar como "En proceso"
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Enviado')}>
                            <Truck className="mr-2 h-4 w-4" />
                            Marcar como "Enviado"
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'Entregado')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Marcar como "Entregado"
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-amber-600 focus:text-amber-700 focus:bg-amber-50" onClick={() => handleStatusChange(order.id, 'Cancelado')}>
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
                                <AlertDialogAction onClick={() => handleDeleteOrder(order.id)} className="bg-destructive hover:bg-destructive/90">
                                    Sí, borrar pedido
                                </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && !error && orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
