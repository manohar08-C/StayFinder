import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import stayfinderLogo from '../assets/stayfinder-logo.png'

function Navbar() {

    const { user, isAuthenticated, logout } = useAuth()
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const closeMenu = () => setMenuOpen(false)

    return (
        <nav className="site-nav">
            <div className="nav-inner">
                {/* <Link className="brand" to="/" onClick={closeMenu}>
                    <span className="brand-mark">S</span>
                    <strong>StayFinder</strong>
                </Link> */}

                <Link to="/" className="navbar-brand" aria-label="StayFinder home">
                    <img src={stayfinderLogo} alt="StayFinder" className="navbar-logo"/>
                    <h2 >StayFinder</h2>
                </Link>

                <button className="nav-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen(current => !current)}>
                    <span />
                    <span />
                    <span />
                    <span className="sr-only">Menu</span>
                </button>

                <div id="primary-navigation" className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
                    <Link to="/hostels" onClick={closeMenu}>Explore stays</Link>

                    {isAuthenticated && user?.role === 'User' && <>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <Link to="/bookings" onClick={closeMenu}>Bookings</Link>
                        <Link to="/favorites" onClick={closeMenu}>Favorites</Link>
                        <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
                    </>}

                    {isAuthenticated && user?.role === 'hostelOwner' && <>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                        <Link to="/owner/dashboard" onClick={closeMenu}>Owner dashboard</Link>
                        <Link to="/owner/bookings" onClick={closeMenu}>Bookings</Link>
                        <Link to="/favorites" onClick={closeMenu}>Favorites</Link>
                        <Link to="/reviews" onClick={closeMenu}>Reviews</Link>
                    </>}

                    {isAuthenticated && user?.role === 'Admin' && <>
                        <Link to="/admin/dashboard" onClick={closeMenu}>Admin dashboard</Link>
                        <Link to="/profile" onClick={closeMenu}>Profile</Link>
                     </>}

                    {isAuthenticated ? <button className="nav-logout" onClick={handleLogout}>Log out</button> : <>
                        <Link to="/login" onClick={closeMenu}>Log in</Link>
                        <Link className="nav-cta" to="/signup" onClick={closeMenu}>Create account</Link>
                    </>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar