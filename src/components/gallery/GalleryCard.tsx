import 'lightgallery/css/lg-thumbnail.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lightgallery.css'
import LightGallery from 'lightgallery/react'

type Props = {
  images: string[]
  title: string
}

const GalleryCard: React.FC<Props> = ({ images, title }) => {
  if (!images || images.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="aspect-video w-full overflow-hidden">
        <div className="bg-white shadow-md rounded-lg overflow-hidden w-full">
          <LightGallery
            speed={500}
            thumbnail={true}
            plugins={[]}
            mode="lg-fade"
            elementClassNames="w-full"
          >
            <a href={images[0]}>
              <img
                src={images[0]}
                alt={title}
                className="w-full h-full object-cover cursor-pointer"
              />
            </a>

            {images.slice(1).map((src, index) => (
              <a href={src} key={index} className="hidden">
                <img src={src} alt={`${title}`} />
              </a>
            ))}
          </LightGallery>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
  )
}

export default GalleryCard
