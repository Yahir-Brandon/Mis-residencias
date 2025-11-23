'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';

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
import { loginSchema } from '@/lib/auth-validation';
import { testUser } from '@/lib/placeholder-data';
import { useToast } from '@/hooks/use-toast';

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // For local testing, check against the test user
    if (values.email === testUser.email && values.password === testUser.password) {
      toast({
        title: 'Inicio de Sesión Exitoso',
        description: '¡Bienvenido de vuelta!',
      });
      console.log('Login successful:', values);
      router.push('/profile');
    } else {
      toast({
        variant: 'destructive',
        title: 'Inicio de Sesión Fallido',
        description: 'Correo electrónico o contraseña no válidos.',
      });
      console.log('Login failed: Invalid credentials');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="nombre@ejemplo.com" {...field} />
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
        <Button type="submit" className="w-full font-bold">
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}
