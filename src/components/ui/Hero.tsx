import Image from "next/image";
import Link from "next/link";
import { HERO_CONTENT, type HeroContent } from "@/constants/Hero";

type Props = {
  content?: HeroContent;
  className?: string;
};

const Hero = ({ content = HERO_CONTENT, className = "" }: Props) => {
  const {
    eyebrow,
    title,
    highlight,
    subtitle,
    primaryAction,
    secondaryAction,
    stats,
    brands,
    image,
  } = content;

  return (
    <section className={`relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 text-white ${className}`}>
      {/* Glow backgrounds - monochromatic */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-neutral-400/20 blur-3xl" />

      <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
        {/* Left column: copy & actions */}
        <div className="flex flex-col justify-center gap-6">
          {eyebrow && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              {eyebrow}
            </span>
          )}

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}{" "}
            {highlight && (
              <span className="bg-gradient-to-r from-neutral-300 via-white to-neutral-300 bg-clip-text text-transparent">
                {highlight}
              </span>
            )}
          </h1>

          <p className="max-w-xl text-sm leading-6 text-neutral-300 sm:text-base">
            {subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                aria-label={primaryAction.ariaLabel ?? primaryAction.label}
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {primaryAction.label}
              </Link>
            )}

            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                aria-label={secondaryAction.ariaLabel ?? secondaryAction.label}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/0 px-4 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>

          {stats && stats.length > 0 && (
            <dl className="mt-4 grid grid-cols-3 gap-4 sm:max-w-md">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="text-xs text-neutral-400">{s.label}</dt>
                  <dd className="text-lg font-semibold text-white">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {brands && brands.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs text-neutral-400">Trusted checkout</p>
              <div className="flex items-center gap-4 opacity-80">
                {brands.map((b) => (
                  <div key={b.alt} className="relative h-6 w-16">
                    <Image src={b.src} alt={b.alt} fill className="object-contain grayscale" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: feature image */}
        <div className="relative">
          <div className="absolute -inset-12 -z-10 rounded-[2rem] bg-gradient-to-tr from-white/10 to-white/0 blur-2xl" />
          <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur sm:max-w-lg">
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/70">
                Image coming soon
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

