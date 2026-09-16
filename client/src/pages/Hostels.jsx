import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getHostels } from '../services/hostel.service'
import HostelCard from '../components/HostelCard'
import SearchBar from '../components/SearchBar'
import FilterSidebar from '../components/FilterSidebar'
import AgentButton from '../components/agent/AgentButton'
import AgentPanel from '../components/agent/AgentPanel'

const defaultFilters = {
    city: '', locality: '', gender: '', priceType: 'daily', minPrice: '',
    maxPrice: '', roomType: '', capacity: '', rating: '', amenities: [],
    checkIn: '', checkOut: '', availableBeds: '', sort: 'newest'
}

function filtersFromParams(searchParams) {
    return {
        ...defaultFilters,
        city: searchParams.get('city') || '',
        locality: searchParams.get('locality') || '',
        gender: searchParams.get('gender') || '',
        priceType: searchParams.get('priceType') || 'daily',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        roomType: searchParams.get('roomType') || '',
        capacity: searchParams.get('capacity') || '',
        rating: searchParams.get('rating') || '',
        amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
        checkIn: searchParams.get('checkIn') || '',
        checkOut: searchParams.get('checkOut') || '',
        availableBeds: searchParams.get('availableBeds') || '',
        sort: searchParams.get('sort') || 'newest'
    }
}

function filtersToParams(filters) {
    const params = {}

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (value.length) params[key] = value.join(',')
        } else if (value !== '' && value !== null && value !== undefined) {
            params[key] = value
        }
    })

    return params
}

function apiFiltersFromParams(searchParams) {
    const filters = filtersFromParams(searchParams)
    const params = filtersToParams(filters)

    // The backend accepts availability filters only as a complete date range.
    if (!filters.checkIn || !filters.checkOut || filters.checkOut <= filters.checkIn) {
        delete params.checkIn
        delete params.checkOut
        delete params.availableBeds
    }

    return params
}

function Hostels() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [hostels, setHostels] = useState([])
    const [pagination, setPagination] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [filters, setFilters] = useState(() => filtersFromParams(searchParams))
    const [page, setPage] = useState(() => Number(searchParams.get('page')) || 1)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const searchKey = searchParams.toString()
    const [agentOpen, setAgentOpen] = useState(false)

    useEffect(() => {
        setFilters(filtersFromParams(searchParams))
        setPage(Number(searchParams.get('page')) || 1)
    }, [searchKey])

    useEffect(() => {
        const loadHostels = async () => {
            try {
                setLoading(true)
                setError('')

                const params = {
                    ...apiFiltersFromParams(searchParams),
                    page: Number(searchParams.get('page')) || 1,
                    limit: 10
                }

                const data = await getHostels(params)
                setHostels(data.data?.hostels || data.hostels || [])
                setPagination(data.pagination || data.data?.pagination || null)
            } catch (err) {
                console.error(err)
                setError(err.response?.data?.message || 'Failed to load hostels')
            } finally {
                setLoading(false)
            }
        }

        loadHostels()
    }, [page, searchKey])

    const applyFilters = () => {
        setPage(1)
        setSearchParams({ ...filtersToParams(filters), page: '1' })
        setFiltersOpen(false)
    }

    const resetFilters = () => {
        setFilters(defaultFilters)
        setPage(1)
        setSearchParams({})
        setFiltersOpen(false)
    }

    const changeSort = (sort) => {
        const nextFilters = { ...filters, sort }
        setFilters(nextFilters)
        setPage(1)
        setSearchParams({ ...filtersToParams(nextFilters), page: '1' })
    }

    const changePage = (nextPage) => {
        setPage(nextPage)
        setSearchParams({ ...filtersToParams(filters), page: String(nextPage) })
    }

   const applyAgentFilters =
        (agentFilters) => {

            if (!agentFilters) {
                return;
            }


            const nextFilters = {
                ...defaultFilters
            };


            if (agentFilters.city) {
                nextFilters.city =
                    agentFilters.city;
            }


            if (agentFilters.locality) {
                nextFilters.locality =
                    agentFilters.locality;
            }


            if (agentFilters.gender) {
                nextFilters.gender =
                    agentFilters.gender;
            }


            if (
                agentFilters.minPrice !==
                undefined
            ) {
                nextFilters.minPrice =
                    agentFilters.minPrice;
            }


            if (
                agentFilters.maxPrice !==
                undefined
            ) {
                nextFilters.maxPrice =
                    agentFilters.maxPrice;
            }


            if (agentFilters.priceType) {
                nextFilters.priceType =
                    agentFilters.priceType;
            }


            if (
                Array.isArray(
                    agentFilters.amenities
                )
            ) {
                nextFilters.amenities =
                    agentFilters.amenities;
            }


            if (
                agentFilters.rating !==
                undefined
            ) {
                nextFilters.rating =
                    agentFilters.rating;
            }


            if (agentFilters.roomType) {
                nextFilters.roomType =
                    agentFilters.roomType;
            }


            if (
                agentFilters.capacity !==
                undefined
            ) {
                nextFilters.capacity =
                    agentFilters.capacity;
            }


            if (agentFilters.sort) {
                nextFilters.sort =
                    agentFilters.sort;
            }


            setFilters(
                nextFilters
            );

            setPage(1);


            setSearchParams({

                ...filtersToParams(
                    nextFilters
                ),

                page: "1"
            });
        };

    return (
        <main>
            <SearchBar />
            <section className="hostels-page hostels-layout">
                <div className="mobile-filter-bar">
                    <button type="button" onClick={() => setFiltersOpen(current => !current)}>
                        {filtersOpen ? 'Hide filters' : 'Show filters'}
                    </button>
                    <span>{pagination?.total ?? 0} stays available</span>
                </div>
                <div className={`filter-drawer ${filtersOpen ? 'is-open' : ''}`}>
                    <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        onApply={applyFilters}
                        onReset={resetFilters}
                        onClose={() => setFiltersOpen(false)}
                    />
                </div>

                <section className="hostel-results">
                    <div className="results-header">
                        <div>
                            <p className="eyebrow">EXPLORE STAYFINDER</p>
                            <h1>Find your next stay</h1>
                            {pagination && <p>{pagination.total} hostels found</p>}
                        </div>
                        <div className="sort-control">
                            <label htmlFor="sort-hostels">Sort</label>
                            <select
                                id="sort-hostels"
                                value={filters.sort}
                                onChange={event => changeSort(event.target.value)}
                            >
                                <option value="newest">Newest</option>
                                <option value="rating_desc">Highest Rated</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {loading && <p>Searching hostels...</p>}
                    {error && <p className="search-error">{error}</p>}
                    {!loading && !error && hostels.length === 0 && (
                        <div className="empty-state">
                            <h2>No hostels found</h2>
                            <p>Try changing your filters.</p>
                        </div>
                    )}
                    {!loading && !error && hostels.length > 0 && (
                        <div className="hostel-grid">
                            {hostels.map(hostel => (
                                <HostelCard key={hostel._id} hostel={hostel} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.pages > 1 && (
                        <div className="pagination">
                            <button type="button" disabled={page <= 1} onClick={() => changePage(page - 1)}>
                                Previous
                            </button>
                            <span>Page {page} of {pagination.pages}</span>
                            <button type="button" disabled={page >= pagination.pages} onClick={() => changePage(page + 1)}>
                                Next
                            </button>
                        </div>
                    )}
                </section>

                <AgentButton
                    isOpen={agentOpen}
                    onClick={() =>
                        setAgentOpen(current => !current)
                    }
                />

                {agentOpen && (
                    <AgentPanel
                        onClose={() => setAgentOpen(false)}
                        onApplyFilters={applyAgentFilters}
                    />
                )}
            </section>
        </main>
    )
}

export default Hostels
