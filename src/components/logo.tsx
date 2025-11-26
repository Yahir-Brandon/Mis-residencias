'use client';

import { HardHat } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  const href = '/';

  const LogoContent = () => (
    <>
      <HardHat className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline tracking-tighter">
        Tlapaleria los Pinos
      </span>
    </>
  );

  return (
    <>
      <div className="flex items-center gap-2 non-interactive-logo-container">
        <LogoContent />
      </div>
      <Link href={href} className="flex items-center gap-2 interactive-logo-container">
        <LogoContent />
      </Link>
      <style jsx global>{`
        .login-in-progress .interactive-logo-container {
          display: none;
        }
        .login-in-progress .non-interactive-logo-container {
          display: flex;
          pointer-events: none;
          opacity: 0.5;
        }
        .interactive-logo-container {
          display: flex;
        }
        .non-interactive-logo-container {
          display: none;
        }
      `}</style>
    </>
  );
}
