import { Link } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../context/AuthContext'
import stayfinderLogo from '../assets/stayfinder-logo.png'

function Home() {
    const { user, isAuthenticated } = useAuth()

    return (
        <main className="home">

            {/* =========================================
                HERO
            ========================================= */}

            <section className="home-hero">

                <div className="home-hero-decoration home-decoration-one" />
                <div className="home-hero-decoration home-decoration-two" />

                <div className="home-hero-inner">

                    {/* LEFT CONTENT */}

                    <div className="home-hero-content">

                        <div className="home-badge">
                            <span className="home-badge-dot" />
                            Smart stays. Simple booking.
                        </div>

                        {isAuthenticated && (
                            <p className="home-welcome">
                                Welcome back,{' '}
                                <strong>
                                    {user?.name || 'traveler'}
                                </strong>
                            </p>
                        )}

                        <h1>
                            Find your
                            <span> perfect stay.</span>
                        </h1>

                        <p className="home-hero-description">
                            Discover comfortable PGs, hostels and
                            shared stays that fit your budget,
                            location and lifestyle.
                        </p>

                        <div className="home-hero-actions">

                            <Link
                                to="/hostels"
                                className="home-primary-button"
                            >
                                Explore Stays
                                <span>→</span>
                            </Link>

                            <Link
                                to="/about"
                                className="home-secondary-button"
                            >
                                How it works
                            </Link>

                        </div>

                        <div className="home-trust-mini">

                            <div className="home-avatar-stack">
                                <span>M</span>
                                <span>R</span>
                                <span>A</span>
                                <span>+</span>
                            </div>

                            <div>
                                <strong>
                                    Trusted by stay seekers
                                </strong>

                                <small>
                                    Find verified stays with confidence
                                </small>
                            </div>

                        </div>

                    </div>


                    {/* RIGHT VISUAL */}

                    <div className="home-hero-visual">

                        <div className="home-visual-card">

                            <div className="home-visual-top">

                                <span className="home-location-pill">
                                    📍 Hyderabad
                                </span>

                                <span className="home-verified-pill">
                                    ✓ Verified
                                </span>

                            </div>


                            <div className="home-room-visual">

                                <div className="home-room-window">
                                    <span />
                                    <span />
                                    <span />
                                </div>

                                <div className="home-bed">
                                    <div className="home-bed-head" />
                                    <div className="home-bed-pillow" />
                                    <div className="home-bed-body" />
                                </div>

                                <div className="home-plant">
                                    <span />
                                    <span />
                                    <span />
                                </div>

                                <div className="home-lamp">
                                    <span />
                                </div>

                            </div>


                            <div className="home-visual-info">

                                <div>

                                    <span>
                                        Featured stay
                                    </span>

                                    <h3>
                                        Comfort Living PG
                                    </h3>

                                    <p>
                                        Kondapur, Hyderabad
                                    </p>

                                </div>

                                <div className="home-visual-price">

                                    <strong>
                                        ₹9,000
                                    </strong>

                                    <small>
                                        / month
                                    </small>

                                </div>

                            </div>


                            <div className="home-visual-rating">

                                <span>★</span>

                                <strong>
                                    4.8
                                </strong>

                                <small>
                                    Excellent stay
                                </small>

                            </div>

                        </div>


                        <div className="home-floating-card home-floating-rating">

                            <span className="home-floating-icon">
                                ★
                            </span>

                            <div>
                                <strong>
                                    4.8/5
                                </strong>

                                <small>
                                    Guest rating
                                </small>
                            </div>

                        </div>


                        <div className="home-floating-card home-floating-safe">

                            <span className="home-floating-icon">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Verified
                                </strong>

                                <small>
                                    Safe properties
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                SEPARATE SEARCH SECTION
            ========================================= */}

            <section className="home-search-section">

                <div className="home-search-wrapper">

                    <div className="home-search-heading">

                        <span>
                            Find your next stay
                        </span>

                        <small>
                            Choose a place, dates and room requirements
                        </small>

                    </div>

                    <div className="home-search-bar">
                        <SearchBar />
                    </div>

                </div>

            </section>


            {/* =========================================
                TRUST STRIP
            ========================================= */}

            <section className="home-trust-strip">

                <div className="home-trust-item">

                    <span>✓</span>

                    <div>
                        <strong>
                            Verified Properties
                        </strong>

                        <small>
                            Admin-approved stays
                        </small>
                    </div>

                </div>


                <div className="home-trust-item">

                    <span>⌂</span>

                    <div>
                        <strong>
                            Multiple Options
                        </strong>

                        <small>
                            PGs, hostels & rooms
                        </small>
                    </div>

                </div>


                <div className="home-trust-item">

                    <span>₹</span>

                    <div>
                        <strong>
                            Budget Friendly
                        </strong>

                        <small>
                            Compare before booking
                        </small>
                    </div>

                </div>


                <div className="home-trust-item">

                    <span>★</span>

                    <div>
                        <strong>
                            Trusted Reviews
                        </strong>

                        <small>
                            Real guest feedback
                        </small>
                    </div>

                </div>

            </section>


            {/* =========================================
                AI ASSISTANT
            ========================================= */}

            <section className="home-ai-section">

                <div className="home-ai-content">

                    <div className="home-ai-label">
                        <span>✦</span>
                        STAYFINDER AI
                    </div>

                    <h2>
                        Tell us what you need.
                        <span> We'll help you find it.</span>
                    </h2>

                    <p>
                        Looking for a PG near your college?
                        Need a room under ₹10,000 with food and
                        Wi-Fi? Describe what you want and let
                        StayFinder help you discover suitable stays.
                    </p>

                    <Link
                        to="/ai-assistant"
                        className="home-ai-button"
                    >
                        Try AI Assistant
                        <span>→</span>
                    </Link>

                </div>


                <div className="home-ai-chat">

                    <div className="home-chat-header">

                        <div className="home-chat-avatar">
                            S
                        </div>

                        <div>
                            <strong>
                                StayFinder Assistant
                            </strong>

                            <small>
                                ● Online
                            </small>
                        </div>

                    </div>


                    <div className="home-chat-messages">

                        <div className="home-chat-message user">
                            I need a PG in Gachibowli
                            under ₹12,000 with Wi-Fi.
                        </div>

                        <div className="home-chat-message bot">

                            <strong>
                                I found some great options.
                            </strong>

                            <span>
                                Let me show you stays that
                                match your budget and preferences.
                            </span>

                        </div>

                    </div>


                    <div className="home-chat-input">

                        <span>
                            Describe your ideal stay...
                        </span>

                        <button type="button">
                            →
                        </button>

                    </div>

                </div>

            </section>


            {/* =========================================
                WHY STAYFINDER
            ========================================= */}

            <section className="home-section home-features-section">

                <div className="home-section-heading">

                    <div>

                        <p className="eyebrow">
                            WHY STAYFINDER
                        </p>

                        <h2>
                            Everything you need
                            <span> in one place.</span>
                        </h2>

                    </div>

                    <p>
                        From discovering the right neighbourhood
                        to finding an available room, StayFinder
                        keeps the entire process simple.
                    </p>

                </div>


                <div className="home-feature-grid">

                    <article className="home-feature-card home-feature-large">

                        <div className="home-feature-number">
                            01
                        </div>

                        <div className="home-feature-icon">
                            ⌕
                        </div>

                        <h3>
                            Smart Search
                        </h3>

                        <p>
                            Find stays using city, locality,
                            price, gender, amenities, ratings
                            and room preferences.
                        </p>

                    </article>


                    <article className="home-feature-card">

                        <div className="home-feature-number">
                            02
                        </div>

                        <div className="home-feature-icon">
                            ✓
                        </div>

                        <h3>
                            Verified Hostels
                        </h3>

                        <p>
                            Browse properties that go through
                            our approval process before appearing
                            on StayFinder.
                        </p>

                    </article>


                    <article className="home-feature-card">

                        <div className="home-feature-number">
                            03
                        </div>

                        <div className="home-feature-icon">
                            ♢
                        </div>

                        <h3>
                            Easy Booking
                        </h3>

                        <p>
                            Check available rooms and beds,
                            choose your dates and book your
                            preferred stay.
                        </p>

                    </article>

                </div>

            </section>


            {/* =========================================
                POPULAR LOCATIONS
            ========================================= */}

            <section className="home-section home-destinations">

                <div className="home-section-heading">

                    <div>

                        <p className="eyebrow">
                            EXPLORE LOCATIONS
                        </p>

                        <h2>
                            Popular places to
                            <span> stay.</span>
                        </h2>

                    </div>

                    <Link
                        to="/hostels"
                        className="home-view-all"
                    >
                        View all stays →
                    </Link>

                </div>


                <div className="home-destination-grid">

                    <Link
                        to="/hostels?locality=Gachibowli"
                        className="home-destination-card destination-gachibowli"
                    >
                        <div>
                            <small>01</small>
                            <h3>Gachibowli</h3>
                            <span>Hyderabad</span>
                        </div>

                        <span className="home-destination-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/hostels?locality=Madhapur"
                        className="home-destination-card destination-madhapur"
                    >
                        <div>
                            <small>02</small>
                            <h3>Madhapur</h3>
                            <span>Hyderabad</span>
                        </div>

                        <span className="home-destination-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/hostels?locality=Kondapur"
                        className="home-destination-card destination-kondapur"
                    >
                        <div>
                            <small>03</small>
                            <h3>Kondapur</h3>
                            <span>Hyderabad</span>
                        </div>

                        <span className="home-destination-arrow">
                            →
                        </span>
                    </Link>


                    <Link
                        to="/hostels?locality=Hitech%20City"
                        className="home-destination-card destination-hitech"
                    >
                        <div>
                            <small>04</small>
                            <h3>Hitech City</h3>
                            <span>Hyderabad</span>
                        </div>

                        <span className="home-destination-arrow">
                            →
                        </span>
                    </Link>

                </div>

            </section>


            {/* =========================================
                FINAL CTA
            ========================================= */}

            <section className="home-final-cta">

                <div>

                    <p className="eyebrow">
                        YOUR NEXT STAY IS WAITING
                    </p>

                    <h2>
                        Find somewhere
                        <span> you'll love coming home to.</span>
                    </h2>

                    <p>
                        Search verified stays, compare rooms
                        and book with confidence.
                    </p>

                    <Link
                        to="/hostels"
                        className="home-cta-button"
                    >
                        Find My Stay
                        <span>→</span>
                    </Link>

                </div>

                {/* <div className="home-cta-mark">
                    S
                </div> */}
                <img src={stayfinderLogo} alt="StayFinder" className="home-cta-mark"/>
                                

            </section>


            {/* =========================================
                FOOTER
            ========================================= */}

            <footer className="home-footer">

                <div className="home-footer-inner">

                    <div className="home-footer-brand">

                        <div >
                            <img src={stayfinderLogo} alt="StayFinder" className="home-footer-logo" />
                        </div>

                        <div>
                            <strong>
                                StayFinder
                            </strong>

                            <span>
                                Find Your Perfect Stay
                            </span>
                        </div>

                    </div>


                    <div className="home-footer-links">

                        <Link to="/hostels">
                            Explore Stays
                        </Link>

                        <Link to="/about">
                            About
                        </Link>

                        <Link to="/ai-assistant">
                            AI Assistant
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                    </div>

                </div>


                <div className="home-footer-bottom">

                    <span>
                        © {new Date().getFullYear()} StayFinder.
                        All rights reserved.
                    </span>

                    <span>
                        Made for better stays.
                    </span>

                </div>

            </footer>

        </main>
    )
}

export default Home