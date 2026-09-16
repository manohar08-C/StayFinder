import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {

    const { user } = useAuth()

    return (

        <main className="admin-dashboard">

            <header>

                <h1>
                    Admin Dashboard
                </h1>

                <p>
                    Welcome, {user?.name}
                </p>

            </header>

            <section className="admin-dashboard-grid">

                <Link to="/admin/hostels">

                    <h2>
                        🏠 Hostel Approvals
                    </h2>

                    <p>
                        Review and manage hostel
                        submissions.
                    </p>

                </Link>

                <Link to="/admin/owners">

                    <h2>
                        👤 Owner Applications
                    </h2>

                    <p>
                        Review hostel owner
                        applications.
                    </p>

                </Link>

                <Link to="/admin/create-admin">

                    <h2>
                        🛡️ Create Admin
                    </h2>

                    <p>
                        Create another administrator.
                    </p>

                </Link>

            </section>

        </main>
    )
}

export default AdminDashboard
