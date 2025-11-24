'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { phoneAuthSchema, verifyCodeSchema } from '@/lib/auth-validation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

export function PhoneAuthForm() {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Declarar esto en el objeto window si se usa TypeScript
  useEffect(() => {
    return () => {
      // Limpiar el verificador de reCAPTCHA al desmontar el componente
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  const phoneForm = useForm<z.infer<typeof phoneAuthSchema>>({
    resolver: zodResolver(phoneAuthSchema),
    defaultValues: { phone: '' },
  });

  const codeForm = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: { code: '' },
  });

  async function onPhoneSubmit(values: z.infer<typeof phoneAuthSchema>) {
    setIsLoading(true);
    try {
      // Asegurarse de que el contenedor reCAPTCHA esté limpio
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
              // reCAPTCHA resuelto, permite signInWithPhoneNumber.
            }
        });
      }
      
      const appVerifier = window.recaptchaVerifier;
      const phoneNumber = `+52${values.phone}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      
      setConfirmationResult(confirmation);
      setStep('code');
      toast({
        title: 'Código Enviado',
        description: 'Hemos enviado un código de verificación a tu teléfono.',
      });
    } catch (error: any) {
      console.error('Error enviando SMS:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo enviar el código. Revisa el número e inténtalo de nuevo.',
      });
       // En caso de error, limpia el recaptcha para que el usuario pueda intentarlo de nuevo
       if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function onCodeSubmit(values: z.infer<typeof verifyCodeSchema>) {
    if (!confirmationResult) return;
    setIsLoading(true);
    try {
      await confirmationResult.confirm(values.code);
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: '¡Bienvenido!',
      });
      router.push('/profile');
    } catch (error: any) {
      console.error('Error verificando código:', error);
      toast({
        variant: 'destructive',
        title: 'Código Inválido',
        description: 'El código que ingresaste no es correcto. Inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <div id="recaptcha-container"></div>
      {step === 'phone' ? (
        <Form {...phoneForm}>
          <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
            <FormField
              control={phoneForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Teléfono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="55 1234 5678"
                      {...field}
                      disabled={isLoading}
                      type="tel"
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
            <Button type="submit" className="w-full font-bold" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Código'}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...codeForm}>
          <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-6">
            <FormField
              control={codeForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código de Verificación</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} disabled={isLoading} type="text" inputMode="numeric" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('phone')} disabled={isLoading}>
                    Atrás
                </Button>
                <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Verificar e Iniciar Sesión'}
                </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

// Se necesita declarar esto en el objeto window si se está usando TypeScript
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
