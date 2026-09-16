
import { useState } from 'react'

function RoomImageGallery({ images = [], alt = 'Room image' }) {
    const validImages = images.filter(Boolean)

    const [currentIndex, setCurrentIndex] = useState(0)

    if (!validImages.length) {
        return (
            <div className="room-gallery room-gallery-empty">
                <div className="room-gallery-placeholder">
                    <span>🏠</span>
                    <p>No room image</p>
                </div>
            </div>
        )
    }

    const nextImage = () => {
        setCurrentIndex((current) =>
            current === validImages.length - 1 ? 0 : current + 1
        )
    }

    const previousImage = () => {
        setCurrentIndex((current) =>
            current === 0 ? validImages.length - 1 : current - 1
        )
    }

    return (
        <div className="room-gallery">

            <img
                src={validImages[currentIndex]}
                alt={`${alt} ${currentIndex + 1}`}
                className="room-gallery-main-image"
                loading="lazy"
            />

            {validImages.length > 1 && (
                <>
                    <button
                        type="button"
                        className="room-gallery-arrow room-gallery-prev"
                        onClick={previousImage}
                        aria-label="Previous room image"
                    >
                        ‹
                    </button>

                    <button
                        type="button"
                        className="room-gallery-arrow room-gallery-next"
                        onClick={nextImage}
                        aria-label="Next room image"
                    >
                        ›
                    </button>

                    <div className="room-gallery-counter">
                        {currentIndex + 1} / {validImages.length}
                    </div>

                    <div className="room-gallery-dots">
                        {validImages.map((_, index) => (
                            <button
                                type="button"
                                key={index}
                                className={
                                    index === currentIndex
                                        ? 'active'
                                        : ''
                                }
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Show image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default RoomImageGallery

