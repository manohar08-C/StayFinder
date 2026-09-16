
function ReviewCard({ review }) {

    return (
        <article className="review-card">

            <div>
                <strong>
                    {review.user?.name || 'Anonymous'}
                </strong>

                <span>
                    {' ⭐'.repeat(review.rating || 0)}
                </span>
            </div>

            <p>
                {review.comment || 'No comment'}
            </p>

            {review.cleanliness && (
                <small>
                    Cleanliness: {review.cleanliness}/5
                </small>
            )}

            {review.food && (
                <small>
                    Food: {review.food}/5
                </small>
            )}

            {review.location && (
                <small>
                    Location: {review.location}/5
                </small>
            )}

            {review.staff && (
                <small>
                    Staff: {review.staff}/5
                </small>
            )}

        </article>
    )
}

export default ReviewCard