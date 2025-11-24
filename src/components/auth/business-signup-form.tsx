'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { businessSignupSchema } from '@/lib/auth-validation';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TermsContent } from '@/components/legal/terms-content';
import { PrivacyContent } from '@/components/legal/privacy-content';


export function BusinessSignupForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof businessSignupSchema>>({
    resolver: zodResolver(businessSignupSchema),
    defaultValues: {
      companyName: '',
      legalRepName: '',
      email: '',
      rfc: '',
      phone: '',
      password: '',
      acceptTerms: false,
    },
  });

  function onSubmit(values: z.infer<typeof businessSignupSchema>) {
    console.log(values);
    toast({
      title: '¡Cuenta Creada!',
      description: 'Tu cuenta de empresa ha sido creada exitosamente.',
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Empresa</FormLabel>
              <FormControl>
                <Input placeholder="Constructora S.A. de C.V." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="legalRepName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Representante Legal</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rfc"
          render={({ field }) => (
            <FormItem>
              <FormLabel>RFC</FormLabel>
              <FormControl>
                <Input placeholder="XAXX010101000" {...field} />
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
              <FormLabel>Número Telefónico</FormLabel>
              <FormControl>
                <Input placeholder="55 1234 5678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="contact@constructora.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
               <div className="space-y-1 leading-none">
                <FormLabel>
                  Acepto los términos y condiciones.
                </FormLabel>
                <FormDescription>
                  Al registrarte, aceptas nuestros{' '}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-sm">Términos de Servicio</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Términos y Condiciones</DialogTitle>
                        <DialogDescription>
                           Por favor, lee nuestros términos de servicio antes de continuar.
                        </DialogDescription>
                      </DialogHeader>
                       <ScrollArea className="h-96 pr-6">
                         <TermsContent />
                       </ScrollArea>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Cerrar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {' '}y{' '}
                   <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-sm">Política de Privacidad</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Política de Privacidad</DialogTitle>
                        <DialogDescription>
                           Por favor, lee nuestra política de privacidad antes de continuar.
                        </DialogDescription>
                      </DialogHeader>
                       <ScrollArea className="h-96 pr-6">
                          <PrivacyContent />
                       </ScrollArea>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button>Cerrar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  .
                </FormDescription>
                 <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full font-bold">
          Crear Cuenta de Empresa
        </Button>
      </form>
    </Form>
  );
}
