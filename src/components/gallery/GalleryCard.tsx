import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'
import { useEffect, useRef, useState } from 'react'

type Props = {
  images: string[]
  title: string
}

const GalleryCard: React.FC<Props> = ({ images, title }) => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [imageSizes, setImageSizes] = useState<
    { width: number; height: number }[]
  >([])

  useEffect(() => {
    if (!images || images.length === 0) return

    const loadImageSizes = async () => {
      const sizes = await Promise.all(
        images.map((src) => {
          return new Promise<{ width: number; height: number }>((resolve) => {
            const img = new Image()
            img.src = src
            img.onload = () => {
              resolve({ width: img.naturalWidth, height: img.naturalHeight })
            }
            img.onerror = () => {
              resolve({ width: 1600, height: 1200 }) // fallback en caso de error
            }
          })
        })
      )
      setImageSizes(sizes)
    }

    loadImageSizes()
  }, [images])

  useEffect(() => {
    if (!galleryRef.current || imageSizes.length !== images.length) return

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: 'a',
      pswpModule: () => import('photoswipe'),
    })

    lightbox.init()

    return () => {
      lightbox.destroy()
    }
  }, [imageSizes])

  if (!images || images.length === 0 || imageSizes.length !== images.length) {
    return null // mientras carga
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="aspect-video w-full overflow-hidden">
        <div
          className="pswp-gallery w-full overflow-hidden rounded-lg bg-white shadow-md"
          ref={galleryRef}
        >
          {images.map((src, index) => (
            <a
              key={index}
              href={src}
              data-pswp-width={imageSizes[index].width}
              data-pswp-height={imageSizes[index].height}
              target="_blank"
              className={index === 0 ? '' : 'hidden'}
            >
              <img
                src={src}
                alt={`${title} - Imagen ${index + 1}`}
                className="h-full w-full cursor-pointer object-cover"
              />
            </a>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
  )
}

export default GalleryCard
