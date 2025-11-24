'use client';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Briefcase, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export default function BusinessList() {
  const firestore = useFirestore();
  const businessesCollectionRef = useMemoFirebase(() => collection(firestore, 'businesses'), [firestore]);
  const { data: businesses, isLoading, error } = useCollection(businessesCollectionRef);

  return (
    <Card>
       <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Briefcase className="h-5 w-5" />
          <span>Usuarios de Empresa</span>
        </CardTitle>
        <CardDescription>Lista de todas las empresas registradas.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Empresa</TableHead>
                <TableHead>Representante Legal</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>RFC</TableHead>
                <TableHead>Teléfono</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  </TableCell>
                </TableRow>
              )}
              {error && (
                 <TableRow>
                   <TableCell colSpan={5} className="text-center text-destructive">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-5 w-5"/>
                      <span>Error al cargar empresas: Permisos insuficientes.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !error && businesses?.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.companyName}</TableCell>
                  <TableCell>{business.legalRepresentativeName}</TableCell>
                  <TableCell>{business.email}</TableCell>
                  <TableCell>{business.rfc}</TableCell>
                  <TableCell>{business.phoneNumber}</TableCell>
                </TableRow>
              ))}
               {!isLoading && !error && businesses?.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No se encontraron empresas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
