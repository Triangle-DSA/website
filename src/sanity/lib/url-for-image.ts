import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "sanity:client";

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityImageSource) {
  return imageBuilder.image(source);
}

const SRCSET_WIDTHS = [400, 800, 1200, 1600, 2000];

/**
 * Returns a single optimized URL: auto format (WebP/AVIF), quality 80, constrained width.
 */
export function sanityImageUrl(
  source: SanityImageSource,
  width: number,
  quality = 80,
): string {
  return urlForImage(source).auto("format").quality(quality).width(width).url();
}

/**
 * Returns a `srcset` string covering standard responsive breakpoints.
 * Use with a `sizes` attribute so browsers pick the right entry.
 */
export function sanityImageSrcset(
  source: SanityImageSource,
  widths: number[] = SRCSET_WIDTHS,
  quality = 80,
): string {
  return widths
    .map((w) => `${sanityImageUrl(source, w, quality)} ${w}w`)
    .join(", ");
}
