'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Mail, Phone, LogOut, PackagePlus, ShoppingCart, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth, useUser } from "@/firebase";
import { signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // First, handle the case where loading is finished but there's no user.
    if (!isUserLoading && !user) {
      router.push('/login');
      return;
    }

    // If the user object exists, verify its validity with the server.
    if (user) {
      user.reload().catch((error) => {
        // This catch block will execute if the user's token is invalid,
        // for example, if the user has been deleted from the Firebase console.
        console.error("Error reloading user, signing out:", error);
        // Force sign out and redirect to login page.
        signOut(auth).finally(() => {
          router.push('/login');
        });
      });
    }
  }, [user, isUserLoading, router, auth]);


  const handleLogout = () => {
    signOut(auth);
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const nameFallback = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Profile Card */}
        <div className="md:col-span-1">
          <Card className="w-full shadow-lg">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                <AvatarFallback>{nameFallback}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-3xl font-bold font-headline">{user.displayName || 'Usuario'}</CardTitle>
              <CardDescription>Panel de Perfil</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                {user.displayName && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{user.displayName}</span>
                  </div>
                )}
                {user.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{user.email}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">{user.phoneNumber}</span>
                  </div>
                )}
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
            <h2 className="text-3xl font-bold font-headline mb-6">Panel de Control</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Nuevo Pedido</CardTitle>
                        <PackagePlus className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="mt-4">
                            <Link href="/new-order">
                                Crear un nuevo pedido
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
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
