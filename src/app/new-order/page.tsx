'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mexicoStates, State } from '@/lib/mexico-states';
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Plus, BrainCircuit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { analyzeDeliveryDate } from "@/ai/flows/analyze-delivery-date-flow";


const orderSchema = z.object({
  requesterName: z.string().min(1, { message: "El nombre es requerido." }),
  phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, { message: "Solo se permiten números." }),
  street: z.string().min(1, { message: "La calle es requerida." }),
  number: z.string().min(1, {message: 'El número exterior es requerido.'}).regex(/^\d+$/, { message: "Solo se permiten números." }),
  postalCode: z.string().min(5, { message: "El código postal debe tener 5 dígitos." }).regex(/^\d+$/, { message: "Solo se permiten números." }),
  state: z.string().min(1, { message: "Debes seleccionar un estado." }),
  municipality: z.string().min(1, { message: "Debes seleccionar un municipio/delegación." }),
  material: z.string().min(1, { message: "Debes seleccionar un material." }),
  quantity: z.coerce.number().min(1, { message: "La cantidad debe ser al menos 1." }),
  deliveryDates: z.object({
    from: z.date({ required_error: "La fecha de inicio es requerida."}),
    to: z.date({ required_error: "La fecha de fin es requerida."}),
  }),
});

type Material = {
  name: string;
  price: number;
  unit: string;
};

const materials: Material[] = [
  { name: "cemento", price: 250, unit: "bulto" },
  { name: "mortero", price: 220, unit: "bulto" },
  { name: "cal", price: 80, unit: "bulto" },
  { name: "alambre", price: 15, unit: "kg" },
];

export default function NewOrderPage() {
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deliveryAnalysis, setDeliveryAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      material: '',
      quantity: 0,
      deliveryDates: {
        from: undefined,
        to: undefined
      }
    },
  });

  const quantity = form.watch('quantity');
  const deliveryDates = form.watch('deliveryDates');
  const total = selectedMaterial ? quantity * selectedMaterial.price : 0;

  useEffect(() => {
    const handleAnalysis = async () => {
      if (deliveryDates.from && deliveryDates.to) {
        setIsAnalyzing(true);
        setDeliveryAnalysis(null);
        try {
          const result = await analyzeDeliveryDate({
            startDate: deliveryDates.from.toISOString(),
            endDate: deliveryDates.to.toISOString(),
          });
          setDeliveryAnalysis(result.priority);
        } catch (error) {
          console.error("Error analyzing date:", error);
          setDeliveryAnalysis("No se pudo analizar la fecha.");
        } finally {
          setIsAnalyzing(false);
        }
      } else {
        setDeliveryAnalysis(null);
      }
    };

    handleAnalysis();
  }, [deliveryDates.from, deliveryDates.to]);


  const handleStateChange = (stateName: string) => {
    const stateData = mexicoStates.find(s => s.nombre === stateName) || null;
    setSelectedState(stateData);
    form.setValue('municipality', ''); // Reset municipality on state change
  };

  const handleMaterialChange = (materialName: string) => {
    const materialData = materials.find(m => m.name === materialName) || null;
    setSelectedMaterial(materialData);
    form.setValue('material', materialName);
  };

  function onSubmit(values: z.infer<typeof orderSchema>) {
    console.log({...values, total});
    toast({
      title: "Pedido Enviado",
      description: "Hemos recibido tu pedido correctamente.",
    });
    form.reset();
    setSelectedState(null);
    setSelectedMaterial(null);
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
                        <Input 
                          type="text" 
                          inputMode="numeric" 
                          placeholder="55 1234 5678" 
                          {...field}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            field.onChange(numericValue);
                          }}
                        />
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
                        <Input 
                          type="text" 
                          inputMode="numeric" 
                          placeholder="742" 
                          {...field}
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            field.onChange(numericValue);
                          }}
                        />
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
                        <Input 
                          type="text" 
                          inputMode="numeric" 
                          placeholder="12345" 
                          {...field} 
                          onChange={(e) => {
                            const numericValue = e.target.value.replace(/\D/g, '');
                            field.onChange(numericValue);
                          }}
                        />
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
              
              <h3 className="text-lg font-semibold border-b pb-2 pt-4">Pedido de Material</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                <FormField
                  control={form.control}
                  name="material"
                  render={({ field }) => (
                    <FormItem className="md:col-span-1">
                      <FormLabel>Material</FormLabel>
                      <Select onValueChange={(value) => handleMaterialChange(value)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materials.map(material => (
                            <SelectItem key={material.name} value={material.name} className="capitalize">{material.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedMaterial && (
                  <>
                    <div className="space-y-2">
                        <Label>Precio Unitario</Label>
                        <Input 
                          readOnly 
                          value={`$${selectedMaterial.price.toFixed(2)} / ${selectedMaterial.unit}`} 
                          className="bg-muted"
                        />
                    </div>
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              inputMode="numeric"
                              min="0"
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow empty string or numbers
                                if (value === '' || /^\d+$/.test(value)) {
                                   field.onChange(value === '' ? 0 : parseInt(value, 10));
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="space-y-2">
                        <Label>Total</Label>
                        <Input 
                          readOnly 
                          value={`$${total.toFixed(2)}`} 
                          className="bg-muted font-bold text-lg"
                        />
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-start pt-2">
                <Button type="button" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Material
                </Button>
              </div>

              <h3 className="text-lg font-semibold border-b pb-2 pt-4">Cronograma de Entrega</h3>
              <FormField
                control={form.control}
                name="deliveryDates"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fechas de Entrega</FormLabel>
                    <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <DialogTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full max-w-sm justify-start text-left font-normal",
                              !field.value.from && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "PPP", { locale: es })} -{" "}
                                  {format(field.value.to, "PPP", { locale: es })}
                                </>
                              ) : (
                                format(field.value.from, "PPP", { locale: es })
                              )
                            ) : (
                              <span>Elige un rango de fechas</span>
                            )}
                          </Button>
                        </FormControl>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-4xl flex justify-center">
                        <div className="flex flex-col items-center">
                          <DialogHeader>
                            <DialogTitle>Selecciona las Fechas</DialogTitle>
                            <DialogDescription>
                              Selecciona una fecha de inicio y una fecha final para la entrega.
                            </DialogDescription>
                          </DialogHeader>
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={field.value.from}
                            selected={{from: field.value.from!, to: field.value.to}}
                            onSelect={(dateRange) => {
                              field.onChange(dateRange)
                            }}
                            numberOfMonths={2}
                            locale={es}
                            className="p-4"
                            disabled={{ before: new Date() }}
                            classNames={{
                              day_today: "bg-primary/90 text-primary-foreground rounded-md",
                              day_range_start: "bg-red-500 text-white hover:bg-red-600",
                              day_range_end: "bg-green-500 text-white hover:bg-green-600",
                            }}
                          />
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button onClick={() => setIsCalendarOpen(false)}>Confirmar</Button>
                            </DialogClose>
                          </DialogFooter>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <FormDescription>
                        Define el periodo en el que puedes recibir el material.
                    </FormDescription>
                    {isAnalyzing && (
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <BrainCircuit className="mr-2 h-4 w-4 animate-pulse" />
                        Analizando prioridad...
                      </div>
                    )}
                    {deliveryAnalysis && !isAnalyzing && (
                       <div className="flex items-center text-sm font-medium mt-2">
                        <BrainCircuit className="mr-2 h-4 w-4 text-primary" />
                        Prioridad del pedido: <span className="ml-1 font-bold">{deliveryAnalysis}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                  <Button size="lg" type="submit" disabled={!form.formState.isValid}>
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
