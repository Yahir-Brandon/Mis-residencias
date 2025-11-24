'use client';

import { HardHat } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function Logo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // This check needs to be in a useEffect to run on the client-side
    // where localStorage is available.
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, [pathname]); // Re-check on path change to ensure it's up-to-date

  const href = isAuthenticated ? '/profile' : '/';

  return (
    <Link href={href} className="flex items-center gap-2">
      <HardHat className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter">
        Tlapaleria los Pinos
      </span>
    </Link>
  );
}
