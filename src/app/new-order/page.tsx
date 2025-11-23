'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mexicoStates, State } from '@/lib/mexico-states';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const orderSchema = z.object({
  requesterName: z.string().min(1, { message: "El nombre es requerido." }),
  phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 dígitos." }),
  street: z.string().min(1, { message: "La calle es requerida." }),
  number: z.string().min(1, {message: 'El número exterior es requerido.'}).regex(/^\d+$/, { message: "Solo se permiten números." }),
  postalCode: z.string().min(5, { message: "El código postal debe tener 5 dígitos." }).regex(/^\d+$/, { message: "Solo se permiten números." }),
  state: z.string().min(1, { message: "Debes seleccionar un estado." }),
  municipality: z.string().min(1, { message: "Debes seleccionar un municipio/delegación." }),
});

export default function NewOrderPage() {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<State | null>(null);
  
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      requesterName: '',
      phone: '',
      street: '',
      number: '',
      postalCode: '',
      state: '',
      municipality: '',
    },
  });

  const handleStateChange = (stateName: string) => {
    const stateData = mexicoStates.find(s => s.nombre === stateName) || null;
    setSelectedState(stateData);
    form.setValue('municipality', ''); // Reset municipality on state change
  };

  function onSubmit(values: z.infer<typeof orderSchema>) {
    console.log(values);
    toast({
      title: "Pedido Enviado",
      description: "Hemos recibido tu pedido correctamente.",
    });
    form.reset();
    setSelectedState(null);
  }

  const isCdmx = selectedState?.nombre === 'Ciudad de México';

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Crear Nuevo Pedido</CardTitle>
          <CardDescription>Completa el formulario para realizar tu pedido.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="requesterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Solicitante</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="55 1234 5678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 pt-4">Dirección de Entrega</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calle</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Siempre Viva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="numeric" placeholder="742" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal</FormLabel>
                      <FormControl>
                        <Input type="text" inputMode="numeric" placeholder="12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={(value) => {
                          field.onChange(value);
                          handleStateChange(value);
                        }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mexicoStates.map(state => (
                            <SelectItem key={state.nombre} value={state.nombre}>{state.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Controller
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{isCdmx ? 'Delegación' : 'Municipio'}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={!selectedState ? 'Elige un estado primero' : `Selecciona un ${isCdmx ? 'delegación' : 'municipio'}`} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedState?.municipios.map(municipio => (
                            <SelectItem key={municipio} value={municipio}>{municipio}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                  <Button size="lg" type="submit">
                      Enviar Pedido
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
