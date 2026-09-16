import { Link } from 'react-router-dom'

function HostelCard({ hostel }) {

    const image = hostel.images?.[0]
    const imageUrl = typeof image === 'string' ? image : image?.url
    const rating = hostel.rating?.average ?? 0
    const reviewCount = hostel.rating?.count ?? 0

    return (
        <article className="hostel-card">
            <div className="hostel-card-image">
                {imageUrl ? <img src={imageUrl} alt={hostel.name} /> : <span>StayFinder</span>}
                <span className="hostel-card-badge">{hostel.gender || 'All guests'}</span>
            </div>
            <div className="hostel-card-body">
                <div className="hostel-card-heading">
                    <div>
                        <p className="hostel-card-location">{hostel.city}{hostel.locality ? ` · ${hostel.locality}` : ''}</p>
                        <h2>{hostel.name}</h2>
                    </div>
                    <span className="hostel-card-rating">★ {rating.toFixed ? rating.toFixed(1) : rating}</span>
                </div>

                <p className="hostel-card-reviews">{reviewCount ? `${reviewCount} guest reviews` : 'New listing'}</p>

            {hostel.roomPricing && (
                <div className="hostel-card-pricing">
                    <span>Starting from</span>
                    <strong>₹{hostel.roomPricing.daily ?? 'N/A'} <small>/ day</small></strong>
                </div>
            )}

                <Link className="hostel-card-link" to={`/hostels/${hostel._id}`}>View details <span>→</span></Link>
            </div>

        </article>
    )
}

export default HostelCard
