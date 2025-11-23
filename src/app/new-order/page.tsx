import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function NewOrderPage() {
  return (
    <div className="container mx-auto py-12 px-4 animate-fade-in">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Crear Nuevo Pedido</CardTitle>
          <CardDescription>Completa el formulario para realizar tu pedido.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría de Producto</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cement">Cemento y Morteros</SelectItem>
                    <SelectItem value="bricks">Ladrillos y Bloques</SelectItem>
                    <SelectItem value="steel">Acero de Refuerzo</SelectItem>
                    <SelectItem value="wood">Madera</SelectItem>
                    <SelectItem value="other">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product">Producto</Label>
                 <Select>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Items would be populated based on category */}
                    <SelectItem value="prod1">Producto A</SelectItem>
                    <SelectItem value="prod2">Producto B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="quantity">Cantidad</Label>
                <Input id="quantity" type="number" placeholder="Ej: 10" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección de Entrega</Label>
              <Textarea id="address" placeholder="Escribe la dirección completa de la obra" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea id="notes" placeholder="¿Alguna instrucción especial para la entrega?" />
            </div>

            <div className="flex justify-end pt-4">
                <Button size="lg" type="submit">
                    Realizar Pedido
                </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
