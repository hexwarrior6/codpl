import { BrandImage } from './brand-image';
import { resolveModelBrand, resolveProviderBrand } from '@/lib/provider-registry';

interface GlyphProps {
  provider: string;
  model?: string;
  size?: number;
  className?: string;
}

export function ProviderGlyph({ provider, model = '', size = 20, className }: GlyphProps) {
  const { icon, alt } = resolveProviderBrand(provider, model);
  return <BrandImage src={icon} alt={alt} size={size} className={className} />;
}

export function ModelGlyph({ provider, model = '', size = 20, className }: GlyphProps) {
  const { icon, alt } = resolveModelBrand(provider, model);
  return <BrandImage src={icon} alt={alt} size={size} className={className} />;
}
