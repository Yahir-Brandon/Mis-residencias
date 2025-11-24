'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { testUser } from "@/lib/placeholder-data";
import Link from "next/link";
import { User, Mail, Phone, LogOut, PackagePlus, ShoppingCart, Activity } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/');
  };

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card className="w-full shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={testUser.avatar} alt={testUser.name} />
                <AvatarFallback>{testUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold font-headline">{testUser.name}</CardTitle>
              <CardDescription>Panel de Perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{testUser.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">{testUser.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">+52 55 1234 5678 (ficticio)</span>
                </div>
              </div>
              <Button onClick={handleLogout} variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Section */}
        <div className="md:col-span-2">
            <h2 className="text-3xl font-bold font-headline mb-4">Panel de Control</h2>
            <div className="mb-6">
                 <Button asChild size="lg">
                    <Link href="/new-order">
                        <PackagePlus className="mr-2 h-5 w-5" />
                        Nuevo Pedido
                    </Link>
                </Button>
            </div>
            
            <Separator className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Pedidos Recientes</CardTitle>
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">en el último mes</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Estatus de Cuenta</CardTitle>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">Activa</div>
                        <p className="text-xs text-muted-foreground">desde Hoy</p>
                    </CardContent>
                </Card>
            </div>
            {/* Future content like recent orders table can go here */}
        </div>
      </div>
    </div>
  );
}
