'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { mexicoStates, State } from '@/lib/mexico-states';
import { useState, useEffect, useMemo } from "react";
import { CalendarIcon, Plus, BrainCircuit, Trash2, Loader2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { analyzeDeliveryDate } from "@/ai/flows/analyze-delivery-date-flow";
import { useRouter } from "next/navigation";
import { useFirestore, useUser } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FirestorePermissionError } from "@/firebase/errors";
import { errorEmitter } from "@/firebase/error-emitter";
import { useToast } from "@/hooks/use-toast";
import { DeliveryMap } from "@/components/maps/delivery-map";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const materialOrderSchema = z.object({
  name: z.string().min(1, { message: "Debes seleccionar un material." }),
  quantity: z.coerce.number().min(1, { message: "La cantidad debe ser mayor a 0." }),
});

const orderSchema = z.object({
  requesterName: z.string().min(1, { message: "El nombre es requerido." }),
  projectName: z.string().min(1, { message: "El nombre de la obra es requerido." }),
  phone: z.string().min(10, { message: "El teléfono debe tener al menos 10 dígitos." }).regex(/^\d+$/, { message: "Solo se permiten números." }),
  street: z.string().min(1, { message: "La calle es requerida." }),
  number: z.string().min(1, {message: 'El número exterior es requerido.'}).regex(/^\d+$/, { message: "Solo se permiten números." }),
  colony: z.string().min(1, { message: "La colonia es requerida." }),
  postalCode: z.string().min(5, { message: "El código postal debe tener 5 dígitos." }).regex(/^\d+$/, { message: "Solo se permiten números." }),
  state: z.string().min(1, { message: "Debes seleccionar un estado." }),
  municipality: z.string().min(1, { message: "Debes seleccionar un municipio/delegación." }),
  materials: z.array(materialOrderSchema).min(1, { message: "Debes añadir al menos un material." }),
  deliveryDates: z.object({
    from: z.date({ required_error: "La fecha de inicio es requerida."}),
    to: z.date({ required_error: "La fecha de fin es requerida."}),
  }),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
});

type Material = {
  name: string;
  price: number;
  unit: string;
};

const materialsList: Material[] = [
  { name: "cemento", price: 250, unit: "bulto" },
  { name: "mortero", price: 220, unit: "bulto" },
  { name: "cal", price: 80, unit: "bulto" },
  { name: "alambre", price: 15, unit: "kg" },
];

export default function NewOrderPage() {
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [deliveryAnalysis, setDeliveryAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressToGeocode, setAddressToGeocode] = useState<string>("");
  const [showMap, setShowMap] = useState(false);

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      requesterName: '',
      projectName: '',
      phone: '',
      street: '',
      number: '',
      colony: '',
      postalCode: '',
      state: '',
      municipality: '',
      materials: [{ name: '', quantity: '' as any }],
      deliveryDates: {
        from: undefined,
        to: undefined
      },
      location: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "materials"
  });

  const watchedAddressFields = form.watch(['street', 'number', 'colony', 'postalCode', 'municipality', 'state']);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const watchMaterials = form.watch('materials');
  const deliveryDates = form.watch('deliveryDates');
  const location = form.watch('location');

  const total = watchMaterials.reduce((acc, current) => {
    const materialInfo = materialsList.find(m => m.name === current.name);
    const price = materialInfo?.price || 0;
    const quantity = Number(current.quantity) || 0;
    return acc + (price * quantity);
  }, 0);


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

  async function onSubmit(values: z.infer<typeof orderSchema>) {
    if (!user || !firestore || !deliveryAnalysis || !values.location) return;
    setIsSubmitting(true);
    
    const orderData = { 
      ...values, 
      total,
      userId: user.uid,
      priority: deliveryAnalysis,
      status: 'Pendiente',
      createdAt: serverTimestamp(),
     };

    const ordersCollectionRef = collection(firestore, 'users', user.uid, 'orders');
    
    addDoc(ordersCollectionRef, orderData)
      .then((docRef) => {
        toast({
            title: "Pedido Enviado",
            description: "Tu pedido se ha guardado correctamente.",
        });
        router.push(`/order-summary?userId=${user.uid}&orderId=${docRef.id}`);
      })
      .catch((error) => {
        console.error("Error al guardar el pedido:", error);
        
        // Emitir error contextual para depuración
        errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: ordersCollectionRef.path,
            operation: 'create',
            requestResourceData: orderData
        }));

        toast({
            variant: "destructive",
            title: "Error al enviar el pedido",
            description: "No se pudo guardar tu pedido. Por favor, revisa tus permisos e intenta de nuevo.",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const handleGeocode = () => {
    const [street, number, colony, postalCode, municipality, state] = watchedAddressFields;
    const fullAddress = `${street} ${number}, ${colony}, ${municipality}, ${state}, C.P. ${postalCode}`;
    setAddressToGeocode(fullAddress);
    setShowMap(true);
  };
  
  const addressFieldsAreValid = useMemo(() => {
    const [street, number, colony, postalCode, municipality, state] = watchedAddressFields;
    return street && number && colony && postalCode && municipality && state;
  }, [watchedAddressFields]);

  const isCdmx = selectedState?.nombre === 'Ciudad de México';
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";


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
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Obra</FormLabel>
                      <FormControl>
                        <Input placeholder="Torre Reforma" {...field} />
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="colony"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colonia</FormLabel>
                        <FormControl>
                          <Input placeholder="Centro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
              </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="flex justify-end pt-2">
                <Button type="button" onClick={handleGeocode} disabled={!addressFieldsAreValid}>
                  <MapPin className="mr-2 h-4 w-4" />
                  Buscar Dirección
                </Button>
              </div>


              {showMap && (
                    <div className="space-y-4 pt-4">
                         <h3 className="text-lg font-semibold border-b pb-2">Confirmar Ubicación</h3>
                         <Alert>
                            <MapPin className="h-4 w-4" />
                            <AlertTitle>¡Confirma tu ubicación!</AlertTitle>
                            <AlertDescription>
                                Un marcador aparecerá en el mapa basado en la dirección que proporcionaste. Si no es preciso, haz clic en el mapa para ajustar la ubicación exacta de la entrega.
                            </AlertDescription>
                        </Alert>
                        <div className="h-[300px] w-full rounded-lg overflow-hidden border">
                            <DeliveryMap
                                apiKey={mapsApiKey} 
                                address={addressToGeocode}
                                onLocationChange={(coords) => {
                                    form.setValue('location', coords, { shouldValidate: true });
                                }}
                                isDraggable={true}
                            />
                        </div>
                         {form.formState.errors.location && (
                           <p className="text-sm font-medium text-destructive">{form.formState.errors.location.message}</p>
                        )}
                    </div>
                )}
              
              <h3 className="text-lg font-semibold border-b pb-2 pt-4">Pedido de Material</h3>

              <div className="space-y-4">
                {fields.map((field, index) => {
                   const selectedMaterialInfo = materialsList.find(m => m.name === watchMaterials[index]?.name);
                   const subtotal = (Number(watchMaterials[index]?.quantity) || 0) * (selectedMaterialInfo?.price || 0);

                  return (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 border rounded-lg relative">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-3">
                            <FormLabel>Material</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {materialsList.map(material => (
                                  <SelectItem key={material.name} value={material.name} className="capitalize">{material.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="space-y-2 md:col-span-2">
                          <Label>P. Unitario</Label>
                          <Input 
                            readOnly 
                            value={selectedMaterialInfo ? `$${selectedMaterialInfo.price.toFixed(2)} / ${selectedMaterialInfo.unit}`: '$0.00'} 
                            className="bg-muted"
                          />
                      </div>

                      <FormField
                        control={form.control}
                        name={`materials.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                inputMode="numeric"
                                placeholder="0"
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="space-y-2 md:col-span-2">
                          <Label>Subtotal</Label>
                          <Input 
                            readOnly 
                            value={`$${subtotal.toFixed(2)}`} 
                            className="bg-muted font-bold"
                          />
                      </div>

                      {fields.length > 1 && (
                         <div className="md:col-span-1">
                          <Button variant="ghost" size="icon" onClick={() => remove(index)} className="text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}

                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => append({ name: '', quantity: '' as any })}
                  className="w-full md:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir otro material
                </Button>

                {watchMaterials.length > 0 && (
                   <div className="flex justify-end pt-4">
                      <div className="w-full md:w-1/3">
                          <Label className="text-lg font-semibold">Total del Pedido</Label>
                          <Input 
                            readOnly 
                            value={`$${total.toFixed(2)}`} 
                            className="bg-muted font-bold text-2xl h-12 mt-2"
                          />
                      </div>
                  </div>
                )}
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
                      <DialogContent className="w-auto sm:max-w-4xl flex justify-center">
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
                          />
                          <div className="w-full mt-4 p-4 border-t">
                            <h4 className="text-sm font-semibold mb-2">Simbología</h4>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-red-500"></div>
                                <span>Fecha Próxima (Inicio)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-green-500"></div>
                                <span>Fecha Límite (Fin)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-md bg-primary/90"></div>
                                <span>Día de Hoy</span>
                              </div>
                            </div>
                          </div>
                          <DialogFooter className="pt-4">
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
                  <Button size="lg" type="submit" disabled={!form.formState.isValid || isSubmitting || !deliveryAnalysis}>
                      {isSubmitting ? (
                          <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enviando...
                          </>
                      ) : (
                        'Enviar Pedido'
                      )}
                  </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
