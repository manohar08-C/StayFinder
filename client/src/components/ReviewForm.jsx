import { useState } from 'react'
import { createReview, updateReview } from '../services/review.service'

function ReviewForm({ bookingId, review, onSaved, onCancel }) {
    const [rating, setRating] = useState(review?.rating || 5)
    const [comment, setComment] = useState(review?.comment || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async event => {
        event.preventDefault()
        try {
            setLoading(true)
            setError('')
            const payload = { booking: bookingId, rating, comment }
            const response = review
                ? await updateReview(review._id, payload)
                : await createReview(payload)
            onSaved(response.data?.review || response.review)
        } catch (requestError) {
            setError(requestError.response?.data?.message || 'Unable to save review')
        } finally {
            setLoading(false)
        }
    }

    return <form className="review-form" onSubmit={handleSubmit}>
        <div className="review-form-heading"><h3>{review ? 'Edit your review' : 'Review your stay'}</h3>{onCancel && <button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button>}</div>
        <label>Rating <span className="star-picker">{[1, 2, 3, 4, 5].map(value => <button type="button" className={value <= rating ? 'selected' : ''} key={value} onClick={() => setRating(value)} aria-label={`${value} stars`}>★</button>)}</span></label>
        <label>Comment<textarea value={comment} onChange={event => setComment(event.target.value)} placeholder="What should future guests know?" rows="4" required /></label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="button button-primary" disabled={loading}>{loading ? 'Saving...' : review ? 'Save changes' : 'Publish review'}</button>
    </form>
}

export default ReviewForm