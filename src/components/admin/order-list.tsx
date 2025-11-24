'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertTriangle, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const priorityStyles: {[key: string]: string} = {
    'Urgente': 'bg-red-500 hover:bg-red-500/80',
    'Pronto': 'bg-yellow-500 hover:bg-yellow-500/80',
    'Normal': 'bg-blue-500 hover:bg-blue-500/80',
}

export default function OrderList() {
  const firestore = useFirestore();
  const ordersCollectionRef = useMemoFirebase(() => query(collection(firestore, 'orders'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: orders, isLoading, error } = useCollection(ordersCollectionRef);

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-destructive">
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
              </TableRow>
            ))}
            {!isLoading && !error && orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
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
