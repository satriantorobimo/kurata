interface PropertyGalleryProps {
  title: string;
  imageUrls: string[];
}

export function PropertyGallery({ title, imageUrls }: PropertyGalleryProps) {
  const images = imageUrls.slice(0, 4);

  return (
    <section aria-label={`Galeri ${title}`} className="grid gap-3 md:grid-cols-2 md:grid-rows-2">
      <div className="relative min-h-72 overflow-hidden rounded-xl bg-surface-container-low md:row-span-2 md:min-h-[31rem]">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${images[0]}')` }} role="img" aria-label={title} />
      </div>
      {images.slice(1, 3).map((image, index) => (
        <div key={image} className="relative min-h-44 overflow-hidden rounded-xl bg-surface-container-low md:min-h-0">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${image}')` }} role="img" aria-label={`${title}, foto ${index + 2}`} />
          {index === 1 && images.length > 3 && (
            <div className="absolute inset-0 flex items-center justify-center bg-on-surface/45 text-label-md font-label-md text-on-primary">
              +{images.length - 3} foto
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
