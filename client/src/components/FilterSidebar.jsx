function FilterSidebar({ filters, setFilters, onApply, onReset, onClose }) {
    const handleChange = (field, value) => {
        setFilters(previous => ({ ...previous, [field]: value }))
    }

    const handleAmenity = (amenity) => {
        setFilters(previous => {
            const current = previous.amenities || []
            const amenities = current.includes(amenity)
                ? current.filter(item => item !== amenity)
                : [...current, amenity]

            return { ...previous, amenities }
        })
    }

    const amenities = [
        'WiFi',
        'Food',
        'Parking',
        'Laundry',
        'AC',
        'Security',
        'CCTV',
        'Power Backup'
    ]

    return (
        <aside className="filter-sidebar">
            <div className="filter-header">
                <div><span className="filter-kicker">Refine results</span><h2>Filters</h2></div>
                <div className="filter-actions"><button type="button" onClick={onReset}>Reset</button>{onClose && <button className="filter-close" type="button" onClick={onClose}>Close</button>}</div>
            </div>

            <div className="filter-group">
                <label htmlFor="filter-city">City</label>
                <input
                    id="filter-city"
                    value={filters.city}
                    placeholder="Hyderabad"
                    onChange={event => handleChange('city', event.target.value)}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="filter-locality">Locality</label>
                <input
                    id="filter-locality"
                    value={filters.locality}
                    placeholder="Gachibowli"
                    onChange={event => handleChange('locality', event.target.value)}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="filter-gender">Gender</label>
                <select
                    id="filter-gender"
                    value={filters.gender}
                    onChange={event => handleChange('gender', event.target.value)}
                >
                    <option value="">Any</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="co-ed">Co-ed</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="filter-price-type">Price Type</label>
                <select
                    id="filter-price-type"
                    value={filters.priceType}
                    onChange={event => handleChange('priceType', event.target.value)}
                >
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="filter-min-price">Minimum Price</label>
                <input
                    id="filter-min-price"
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    placeholder="500"
                    onChange={event => handleChange('minPrice', event.target.value)}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="filter-max-price">Maximum Price</label>
                <input
                    id="filter-max-price"
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    placeholder="15000"
                    onChange={event => handleChange('maxPrice', event.target.value)}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="filter-room-type">Room Type</label>
                <select
                    id="filter-room-type"
                    value={filters.roomType}
                    onChange={event => handleChange('roomType', event.target.value)}
                >
                    <option value="">Any</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Dormitory">Dormitory</option>
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="filter-capacity">Minimum Capacity</label>
                <input
                    id="filter-capacity"
                    type="number"
                    min="1"
                    value={filters.capacity}
                    placeholder="1"
                    onChange={event => handleChange('capacity', event.target.value)}
                />
            </div>

            <div className="filter-group">
                <label htmlFor="filter-rating">Minimum Rating</label>
                <select
                    id="filter-rating"
                    value={filters.rating}
                    onChange={event => handleChange('rating', event.target.value)}
                >
                    <option value="">Any</option>
                    <option value="4">4+</option>
                    <option value="3">3+</option>
                    <option value="2">2+</option>
                    <option value="1">1+</option>
                </select>
            </div>

            <fieldset className="filter-group amenity-filter">
                <legend>Amenities</legend>
                {amenities.map(amenity => (
                    <label key={amenity} className="checkbox-item">
                        <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={() => handleAmenity(amenity)}
                        />
                        {amenity}
                    </label>
                ))}
            </fieldset>

            <button className="apply-filter-button" type="button" onClick={onApply}>
                Apply Filters
            </button>
        </aside>
    )
}

export default FilterSidebar
