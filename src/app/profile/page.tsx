'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User, Mail, Phone, LogOut, PackagePlus, ShoppingCart, Activity, Shield, Users, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useUser, useFirestore } from "@/firebase";
import { signOut } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import UserList from "@/components/admin/user-list";
import BusinessList from "@/components/admin/business-list";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const checkUser = async () => {
      try {
        await user.reload();
        const userDocRef = doc(firestore, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const fetchedUserData = userDocSnap.data();
          setUserData(fetchedUserData);
          if (fetchedUserData.userType === 'admin') {
            setIsAdmin(true);
          }
        } else {
          signOut(auth).finally(() => router.push('/login'));
        }
      } catch (error) {
        console.error("User token is invalid or user deleted, forcing sign out:", error);
        signOut(auth).finally(() => router.push('/login'));
      } finally {
        setIsLoadingProfile(false);
      }
    };

    checkUser();
  }, [user, isUserLoading, router, auth, firestore]);

  const handleLogout = () => {
    signOut(auth).finally(() => {
      router.push('/');
    });
  };

  if (isLoadingProfile || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }
  
  const nameFallback = (user.displayName || user.email || 'U').charAt(0).toUpperCase();

  if (isAdmin) {
    return (
      <SidebarProvider>
          <div className="flex h-[calc(100vh-4rem)]">
              <Sidebar className="h-full">
                  <SidebarHeader>
                    <div className="flex items-center justify-between w-full">
                      <Logo />
                      <SidebarTrigger />
                    </div>
                  </SidebarHeader>
                  <SidebarContent className="p-2">
                       <Card className="shadow-none border-none">
                          <CardHeader className="items-center text-center p-4">
                              <Avatar className="h-24 w-24 mb-2">
                                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'Admin'} />
                                  <AvatarFallback>{nameFallback}</AvatarFallback>
                              </Avatar>
                              <CardTitle className="text-xl font-bold font-headline">{user.displayName || 'Administrador'}</CardTitle>
                              <CardDescription>Panel de Administrador</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3 text-xs text-muted-foreground px-2">
                              {user.email && (
                                  <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4 text-primary" />
                                      <span className="font-medium text-foreground truncate">{user.email}</span>
                                  </div>
                              )}
                              <div className="flex items-center gap-2 p-1.5 bg-primary/10 rounded-md">
                                  <Shield className="h-4 w-4 text-primary" />
                                  <span className="font-bold text-primary">Rol de Administrador</span>
                              </div>
                          </CardContent>
                      </Card>
                      <Separator className="my-4"/>
                       <SidebarMenu>
                           <SidebarMenuItem>
                               <SidebarMenuButton tooltip="Usuarios" isActive={true} className="justify-start"><Users />Usuarios</SidebarMenuButton>
                           </SidebarMenuItem>
                           <SidebarMenuItem>
                               <SidebarMenuButton tooltip="Empresas" className="justify-start"><Briefcase />Empresas</SidebarMenuButton>
                           </SidebarMenuItem>
                       </SidebarMenu>
                  </SidebarContent>
                  <div className="mt-auto p-2">
                    <Button onClick={handleLogout} variant="outline" className="w-full justify-start gap-2 p-2 h-auto text-sm">
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar Sesión</span>
                    </Button>
                  </div>
              </Sidebar>
              <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold font-headline">Administrador General</h1>
                  </div>
                  <div className="space-y-8">
                      <UserList />
                      <BusinessList />
                  </div>
              </div>
          </div>
      </SidebarProvider>
    );
  }

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
        </div>
      </div>
    </div>
  );
}
