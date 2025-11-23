import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { testUser } from "@/lib/placeholder-data";
import Link from "next/link";
import { User, Mail, Phone, LogOut } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12 px-4 animate-fade-in">
      <Card className="w-full max-w-lg shadow-2xl">
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
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
