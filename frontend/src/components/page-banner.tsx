interface PageBannerProps {
    eyebrow: string;
    title: string;
    /** one of the strips in /public/img */
    image?: "banner_a.jpg" | "banner_b.jpg";
  }
  
  export function PageBanner({ eyebrow, title, image = "banner_a.jpg" }: PageBannerProps) {
    return (
      <div
        className="relative h-36 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(100deg, rgba(8,42,61,.95) 0%, rgba(11,69,96,.78) 45%, rgba(11,69,96,.1) 100%), url(/img/${image})`,
        }}
      >
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-widest text-accent">{eyebrow}</div>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
        </div>
      </div>
    );
  }