import { SignupForm } from "@/components/auth/signup-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold font-headline">Crear una Cuenta</CardTitle>
          <CardDescription>Elige tu tipo de cuenta y empieza.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
           <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Iniciar Sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
