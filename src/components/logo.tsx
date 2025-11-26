'use client';

import { useUser } from '@/firebase';
import { HardHat } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  const { user } = useUser();
  
  // El enlace siempre apunta a la página de inicio para evitar errores de hidratación.
  const href = '/';

  return (
    <Link href={href} className="flex items-center gap-2">
      <HardHat className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter">
        Tlapaleria los Pinos
      </span>
    </Link>
  );
}
