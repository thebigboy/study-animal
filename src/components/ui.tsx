import Link from "next/link";

export function Panel({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-[28px] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_rgba(126,95,54,0.12)] backdrop-blur md:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600">
        {description}
      </p>
    </div>
  );
}

export function PrimaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700"
    >
      {children}
    </Link>
  );
}

export function SecondaryLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-200"
    >
      {children}
    </Link>
  );
}
