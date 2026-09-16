import { Link, useParams } from 'react-router-dom'

function BookingSuccess() {
    const { id } = useParams()

    return <main className="page-shell success-page">
        <section className="success-panel">
            <span className="success-mark">✓</span>
            <p className="eyebrow">Booking confirmed</p>
            <h1>Your stay is on its way.</h1>
            <p>We have saved your reservation. Keep your booking reference handy: <strong>{id}</strong></p>
            <div className="card-actions"><Link className="button button-primary" to={`/bookings/${id}`}>View booking</Link><Link className="button button-secondary" to="/hostels">Find another stay</Link></div>
        </section>
    </main>
}

export default BookingSuccess