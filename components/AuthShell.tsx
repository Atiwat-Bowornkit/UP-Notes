import type { ReactNode } from "react";

/** Centered card used by /login and /register. */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center">
      <div className="card space-y-6 p-7 sm:p-8">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
        </header>
        {children}
      </div>
      <p className="mt-5 text-center text-sm text-gray-400">{footer}</p>
    </div>
  );
}
