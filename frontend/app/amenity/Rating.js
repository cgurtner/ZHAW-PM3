import RatingStars from './RatingStars';

const Rating = ({rating}) => {
    const {name, text, food, service, comfort, location} = rating
    
    return (
        <div className="bg-dark-dh text-white p-3">
            <h3 className="text-xl mb-3">{name}</h3>
            <div className="mb-3">
                {text}
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                    <span>Food:</span>
                    <RatingStars rating={food} />
                </div>
                <div className="flex justify-between">
                    <span>Service:</span>
                    <RatingStars rating={service} />
                </div>
                <div className="flex justify-between">
                    <span>Comfort:</span>
                    <RatingStars rating={comfort} />
                </div>
                <div className="flex justify-between">
                    <span>Location:</span>
                    <RatingStars rating={location} />
                </div>
            </div>
        </div>
    )
}

export default Rating