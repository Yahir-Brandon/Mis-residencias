'use client';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, AlertTriangle, ShoppingCart, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

type OrderStatus = 'Pendiente' | 'En proceso' | 'Enviado' | 'Entregado' | 'Cancelado';

const statusStyles: {[key in OrderStatus]: string} = {
    'Pendiente': 'border-gray-500/50 text-gray-500',
    'En proceso': 'border-blue-500/50 text-blue-500',
    'Enviado': 'border-purple-500/50 text-purple-500',
    'Entregado': 'border-green-500/50 text-green-500',
    'Cancelado': 'border-red-500/50 text-red-500 line-through',
};

export default function UserOrderList() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  const userOrdersQuery = useMemoFirebase(() => {
    if (isUserLoading || !user) return null;
    return query(
      collection(firestore, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user, isUserLoading]);

  const { data: orders, isLoading, error } = useCollection(userOrdersQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className="h-5 w-5" />
          <span>Mis Pedidos</span>
        </CardTitle>
        <CardDescription>Consulta el historial de tus pedidos.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Obra</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className='text-right'>Acciones</TableHead>
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
                    <span>Error al cargar tus pedidos.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !error && orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  {order.createdAt ? format(order.createdAt.toDate(), 'dd/MM/yyyy', { locale: es }) : 'N/A'}
                </TableCell>
                <TableCell>{order.projectName}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyles[order.status as OrderStatus] || ''}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => router.push(`/order-summary?id=${order.id}`)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Resumen
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && !error && orders?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aún no has realizado ningún pedido.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
