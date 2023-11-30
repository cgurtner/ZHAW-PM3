import Rating from './Rating'

export default function Ratings({ ratings }) {
    return <>
        {
            ratings.map((rating, key) => {
                return <Rating rating={rating} key={"rating" + key + rating.id} />
            })
        }
    </>
}