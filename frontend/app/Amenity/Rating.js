import RatingStars from './RatingStars';

const Rating = ({ rating }) => {
    const { text, food, service, comfort, location, price, created } = rating

    return (
        <div className="bg-dark-dh text-white p-3 flex flex-col justify-between h-full">
            <div>
                <h3 className="text-xl mb-3">Erstellt am {created}</h3>
                <div className="mb-3">
                    {text}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center">
                    <span>Essen:</span>
                    <RatingStars rating={food} />
                </div>
                <div className="flex justify-between items-center">
                    <span>Service:</span>
                    <RatingStars rating={service} />
                </div>
                <div className="flex justify-between items-center">
                    <span>Komfort:</span>
                    <RatingStars rating={comfort} />
                </div>
                <div className="flex justify-between items-center">
                    <span>Standort:</span>
                    <RatingStars rating={location} />
                </div>
                <div className="flex justify-between items-center">
                    <span>Value:</span>
                    <RatingStars rating={price} />
                </div>
            </div>
        </div>
    )
}

export default Rating