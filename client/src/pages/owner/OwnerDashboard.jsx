import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function OwnerDashboard() {

    const { user } = useAuth()

    return (
        <main className="owner-dashboard">
            <header>
                <h1>Owner Dashboard</h1>
                <p>Welcome, {user?.name || 'Owner'}</p>
            </header>

            <section className="owner-dashboard-grid">
                <Link to="/owner/hostel">
                    <h2>🏠 My Hostel</h2>
                    <p>Manage your hostel information</p>
                </Link>

                <Link to="/owner/rooms">
                    <h2>🛏️ Rooms</h2>
                    <p>Add and manage rooms</p>
                </Link>

                <Link to="/owner/bookings">
                    <h2>📋 Bookings</h2>
                    <p>Manage customer bookings</p>
                </Link>
            </section>
        </main>
    )
}

export default OwnerDashboard
