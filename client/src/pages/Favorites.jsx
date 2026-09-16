import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../services/favorite.service'

function Favorites() {
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const loadFavorites = async () => {
        try {
            setLoading(true)
            setError('')
            const response = await getFavorites()
            setFavorites(response.data?.favorites || response.favorites || [])
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadFavorites() }, [])

    const handleRemove = async (hostelId) => {
        try {
            await removeFavorite(hostelId)
            setFavorites(current => current.filter(item => (item.hostel?._id || item.hostel) !== hostelId))
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to remove favorite')
        }
    }

    if (loading) return <main className="page-shell"><p className="status-message">Loading favorites...</p></main>
    if (error) return <main className="page-shell"><div className="error-state"><h1>Favorites</h1><p>{error}</p><button onClick={loadFavorites}>Try again</button></div></main>

    return (
        <main className="page-shell">
            <header className="page-heading"><p className="eyebrow">Your shortlist</p><h1>Favorite hostels</h1><p>Keep the places you would happily call home close at hand.</p></header>
            {favorites.length === 0 ? (
                <section className="empty-state"><h2>No favorite hostels</h2><p>Save a hostel while you explore and it will appear here.</p><Link className="button button-primary" to="/hostels">Explore hostels</Link></section>
            ) : (
                <section className="favorite-grid">
                    {favorites.map(item => {
                        const hostel = item.hostel || item
                        return <article className="favorite-card" key={item._id || hostel._id}>
                            {hostel.images?.[0] && <img src={typeof hostel.images[0] === 'string' ? hostel.images[0] : hostel.images[0].url} alt={hostel.name} />}
                            <div className="favorite-card-content"><p className="eyebrow">{hostel.city || 'StayFinder'}</p><h2>{hostel.name}</h2><p>{hostel.description || 'A comfortable place to stay.'}</p><div className="card-actions"><Link to={`/hostels/${hostel._id}`}>View hostel</Link><button className="button button-quiet" onClick={() => handleRemove(hostel._id)}>Remove</button></div></div>
                        </article>
                    })}
                </section>
            )}
        </main>
    )
}

export default Favorites