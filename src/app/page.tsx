import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import Link from 'next/link';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
const featuredProducts = [
  PlaceHolderImages.find((img) => img.id === 'cement'),
  PlaceHolderImages.find((img) => img.id === 'bricks'),
  PlaceHolderImages.find((img) => img.id === 'rebar'),
  PlaceHolderImages.find((img) => img.id === 'wood'),
].filter(Boolean) as (typeof PlaceHolderImages)[0][];

const productDetails = [
  { title: 'Cemento Premium', description: 'Cemento de alta resistencia para todas tus necesidades de construcción.' },
  { title: 'Ladrillos de Arcilla', description: 'Ladrillos duraderos y clásicos para cimientos fuertes.' },
  { title: 'Varilla de Acero', description: 'Refuerza tus estructuras de concreto con acero de primera calidad.' },
  { title: 'Madera Estructural', description: 'Madera versátil y resistente para entramados y más.' },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-shadow-lg">
            Construyendo Tus Sueños, Un Material a la Vez
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90">
            Materiales de construcción de alta calidad para cada proyecto, desde los cimientos hasta los toques finales.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg" className="font-bold">
              <Link href="/signup">Empezar</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Productos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <div className="aspect-w-3 aspect-h-2">
                    <Image
                      src={product.imageUrl}
                      alt={product.description}
                      width={600}
                      height={400}
                      className="object-cover"
                      data-ai-hint={product.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold font-headline mb-2">{productDetails[index].title}</CardTitle>
                  <p className="text-muted-foreground">{productDetails[index].description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
