import { Fish as FishIcon } from "lucide-react";
import Image from "next/image";

/** Small fish thumbnail. Local photos are optimised; external URLs are rendered as-is. */
export function FishImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md bg-ocean-100">
      {src ? (
        <Image src={src} alt={alt} fill sizes="56px" unoptimized={!src.startsWith("/")} className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center">
          <FishIcon className="h-5 w-5 text-ocean-400" />
        </div>
      )}
    </div>
  );
}