import api from './api'


export const getPendingHostels = async () => {

    const response =
        await api.get('/admin/hostels/pending')

    return response.data
}

export const getAdminHostelById = async (id) => {

    const response =
        await api.get(`/admin/hostels/${id}`)

    return response.data
}


export const approveHostel = async (id) => {

    const response =
        await api.patch(
            `/admin/hostels/${id}/approve`
        )

    return response.data
}

export const rejectHostel = async (
    id,
    rejectionReason
) => {

    const response =
        await api.patch(
            `/admin/hostels/${id}/reject`,
            {
                rejectionReason
            }
        )

    return response.data
}

export const getOwnerApplications = async () => {

    const response =
        await api.get(
            '/admin/owner-applications'
        )

    return response.data
}

export const getOwnerApplicationById =
    async (id) => {

        const response =
            await api.get(
                `/admin/owner-applications/${id}`
            )

        return response.data
    }


export const approveOwnerApplication =
    async (id) => {

        const response =
            await api.put(
                `/admin/owner-applications/${id}/approve`
            )

        return response.data
    }


export const rejectOwnerApplication =
    async (
        id,
        rejectionReason
    ) => {

        const response =
            await api.put(
                `/admin/owner-applications/${id}/reject`,
                {
                    rejectionReason
                }
            )

        return response.data
    }


export const createAdmin = async (
    adminData
) => {

    const response =
        await api.post(
            '/admin/users/admin',
            adminData
        )

    return response.data
}
