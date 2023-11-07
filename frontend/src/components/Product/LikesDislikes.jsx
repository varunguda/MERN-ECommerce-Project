import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from 'react-icons/bi';


const LikesDislikes = ({ reviewsId, review }) => {

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [disliked, setDisliked] = useState(false);
    const [dislikesCount, setDislikesCount] = useState(0);
    const [saveLike, setSaveLike] = useState(false);
    const [saveDislike, setSaveDislike] = useState(false);
    const likeInterval = useRef();
    const dislikeInterval = useRef();

    useEffect(() => {
        setLiked(review.liked);
        setSaveLike(review.liked);
        setDisliked(review.disliked);
        setSaveDislike(review.disliked);
        setDislikesCount(review.dislikes);
        setLikesCount(review.likes)
    }, [review]);


    const toggleReviewLike = async(reviews_id, review_id) => {
        const config = { headers: { "Content-Type": "application/json" } };

        await axios.post("/api/v1/products/reviews/like", { reviews: reviews_id, review: review_id }, config);
    }

    const toggleReviewDislike = async(reviews_id, review_id) => {
        const config = { headers: { "Content-Type": "application/json" } };

        await axios.post("/api/v1/products/reviews/dislike", { reviews: reviews_id, review: review_id }, config);
    }


    const likeReviewClickHandler = () => {
        let tempLiked;

        if (disliked) {
            setDisliked(false);
            setSaveDislike(false);
            setDislikesCount(prev => prev - 1);
        }
        if (liked) {
            setLiked(false);
            tempLiked = false;
            setLikesCount(prev => prev - 1);
        } else {
            setLiked(true);
            tempLiked = true;
            setLikesCount(prev => prev + 1);
        }

        clearTimeout(likeInterval.current);
        likeInterval.current = setTimeout(() => {
            if (tempLiked !== saveLike) {
                toggleReviewLike(reviewsId, review._id);
                setSaveLike(tempLiked);
            }
        }, 1000);
    }


    const dislikeReviewClickHandler = () => {
        let tempDisliked;

        if (liked) {
            setLiked(false);
            setSaveLike(false);
            setLikesCount(prev => prev - 1);
        }
        if (disliked) {
            setDisliked(false);
            tempDisliked = false;
            setDislikesCount(prev => prev - 1);
        } else {
            setDisliked(true);
            tempDisliked = true;
            setDislikesCount(prev => prev + 1);
        }

        clearTimeout(dislikeInterval.current);
        dislikeInterval.current = setTimeout(() => {
            if (tempDisliked !== saveDislike) {
                toggleReviewDislike(reviewsId, review._id);
                setSaveDislike(tempDisliked);
            }
        }, 1000);
    }


    return (
        <div className="likes-dislikes">
            <div onClick={likeReviewClickHandler}>
                {liked ? <BiSolidLike /> : <BiLike />}
                <span>{likesCount}</span>
            </div>
            <div onClick={dislikeReviewClickHandler}>
                {disliked ? <BiSolidDislike /> : <BiDislike />}
                <span>{dislikesCount}</span>
            </div>
        </div>
    )
}

export default LikesDislikes
