import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldCheck, Users, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

const whyChooseUs = [
  {
    icon: <ShieldCheck className="h-12 w-12 text-primary" />,
    title: 'Calidad Insuperable',
    description: 'Solo ofrecemos materiales que cumplen con los más altos estándares de la industria para garantizar la durabilidad y seguridad de tu proyecto.',
  },
  {
    icon: <Users className="h-12 w-12 text-primary" />,
    title: 'Asesoramiento Experto',
    description: 'Nuestro equipo de expertos está siempre disponible para guiarte en la selección de los mejores materiales para tus necesidades específicas.',
  },
  {
    icon: <Truck className="h-12 w-12 text-primary" />,
    title: 'Logística Eficiente',
    description: 'Entregamos tus materiales a tiempo y en perfectas condiciones, directamente en tu obra, para que no tengas que preocuparte por nada.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col animate-fade-in">
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
          <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-shadow-lg animate-slide-in-up animation-delay-300">
            Construyendo Tus Sueños, Un Material a la Vez
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-primary-foreground/90 animate-slide-in-up animation-delay-500">
            Materiales de construcción de alta calidad para cada proyecto, desde los cimientos hasta los toques finales.
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-slide-in-up animation-delay-700">
            <Button asChild size="lg" className="font-bold">
              <Link href="/signup">Empezar</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="font-bold">
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="why-us" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12 animate-fade-in animation-delay-200">
            ¿Por Qué Elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {whyChooseUs.map((reason, index) => (
              <div
                key={reason.title}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${200 * (index + 2)}ms` }}
              >
                {reason.icon}
                <h3 className="mt-4 text-2xl font-bold font-headline">{reason.title}</h3>
                <p className="mt-2 text-muted-foreground max-w-xs">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
