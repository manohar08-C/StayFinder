import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Hostels from './pages/Hostels'
import HostelDetails from './pages/HostelDetails'
import MyBookings from './pages/MyBookings'
import BookingDetails from './pages/BookingDetails'
import UserDashboard from './pages/Userprofile'
import Favorites from './pages/Favorites'
import BookingSuccess from './pages/BookingSuccess'
import Profile from './pages/Profile'
import Reviews from './pages/Reviews'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

import OwnerApplication from './pages/OwnerApplication'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import OwnerHostel from './pages/owner/OwnerHostel'
import OwnerRooms from './pages/owner/OwnerRooms'
import OwnerBookings from './pages/owner/OwnerBookings'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminHostels from './pages/admin/AdminHostels'
import AdminHostelDetails from './pages/admin/AdminHostelDetails'
import AdminOwners from './pages/admin/AdminOwners'
import AdminOwnerDetails from './pages/admin/AdminOwnerDetails'
import CreateAdmin from './pages/admin/CreateAdmin'

import ProtectedRoute from './routes/ProtectedRoute'
import RoleRoute from './routes/RoleRoute'

function App() {

    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                <Route
                    path="/hostels"
                    element={<Hostels />}
                />

                <Route
                    path="/hostels/:id"
                    element={<HostelDetails />}
                />


                {/* Logged-in users */}

                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/dashboard"
                        element={<Navigate to="/profile" replace />}
                    />

                    <Route
                        path="/bookings"
                        element={<MyBookings />}
                    />

                    <Route
                        path="/bookings/:id"
                        element={<BookingDetails />}
                    />

                    <Route
                        path="/booking-success/:id"
                        element={<BookingSuccess />}
                    />

                    <Route
                        path="/owner/apply"
                        element={<OwnerApplication />}
                    />

                    <Route
                        path="/favorites"
                        element={<Favorites />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/reviews"
                        element={<Reviews />}
                    />

                </Route>


                {/* Owner */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={['hostelOwner']}
                        />
                    }
                >

                    <Route
                        path="/owner/dashboard"
                        element={<OwnerDashboard />}
                    />

                    <Route
                        path="/owner/hostel"
                        element={<OwnerHostel />}
                    />

                    <Route
                        path="/owner/rooms"
                        element={<OwnerRooms />}
                    />

                    <Route
                        path="/owner/bookings"
                        element={<OwnerBookings />}
                    />

                </Route>


                {/* Admin */}

                <Route
                    element={
                        <RoleRoute
                            allowedRoles={['Admin']}
                        />
                    }
                >

                    <Route
                        path="/admin/dashboard"
                        element={<AdminDashboard />}
                    />

                    <Route
                        path="/admin/hostels"
                        element={<AdminHostels />}
                    />

                    <Route
                        path="/admin/hostels/:id"
                        element={<AdminHostelDetails />}
                    />

                    <Route
                        path="/admin/owners"
                        element={<AdminOwners />}
                    />

                    <Route
                        path="/admin/owners/:id"
                        element={<AdminOwnerDetails />}
                    />

                    <Route
                        path="/admin/create-admin"
                        element={<CreateAdmin />}
                    />

                </Route>


                {/* 404 */}

                <Route
                    path="*"
                    element={<h1>Page Not Found</h1>}
                />

            </Routes>

        </BrowserRouter>
    )
}

export default App