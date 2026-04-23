import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

interface BrandImageProps {
  src: string;
  alt: string;
  size: number;
  className?: string;
}

export function BrandImage({ src, alt, size, className }: BrandImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return <BrandFallback label={alt} size={size} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
      className={cn('shrink-0 rounded-sm object-contain', className)}
    />
  );
}

export function BrandFallback({ label, size, className }: { label: string; size: number; className?: string }) {
  const text = `${label || '?'}`.trim();
  const glyph = text ? text.slice(0, 1).toUpperCase() : '?';

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex shrink-0 select-none items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-accent/20 font-semibold text-foreground/80',
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.46)) }}
    >
      {glyph}
    </span>
  );
}
