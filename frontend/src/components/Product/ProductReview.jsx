import React, { useContext, useEffect, useReducer, useState } from 'react';
import "./ProductPage.css";
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Stars from '../elements/Cards/Stars';
import { useDispatch, useSelector } from 'react-redux';
import Paginate from '../elements/Pagination/Paginate';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../../State/action-creators';
import { RESET_REVIEW, SET_REVIEW_COMMENT, SET_REVIEW_RATING, SET_REVIEW_TITLE } from '../../State/constants/ProductConstants';
import { ModalContext } from '../../Context/ModalContext';
import { reviewCommentValidator, reviewRatingValidator, reviewTitleValidator } from './utils';
import Loader from '../layouts/Loader/Loader';
import DropdownButton from '../elements/Buttons/DropdownButton';
import { toast } from 'react-toastify';
import LikesDislikes from './LikesDislikes';


const initialState = {
    title: "",
    comment: "",
    rating: 0
}

const reviewReducer = (state, action) => {

    switch (action.type) {

        case SET_REVIEW_TITLE: {
            return ({ ...state, title: action.payload });
        }

        case SET_REVIEW_COMMENT: {
            return ({ ...state, comment: action.payload });
        }

        case SET_REVIEW_RATING: {
            return ({ ...state, rating: action.payload })
        }

        case RESET_REVIEW: {
            return ({ ...initialState });
        }

        default: {
            return state;
        }
    }
}

const reviewCardOptions = ["Delete", "Edit"];



const ReviewModalContent = ({ state, addReviewHandler }) => {

    const [modalState, modalReviewDispatch] = useReducer(reviewReducer, initialState);

    const { closeModal } = useContext(ModalContext);

    const [validateFields, setValidateFields] = useState(false);

    useEffect(() => {
        modalReviewDispatch({ type: SET_REVIEW_TITLE, payload: state.title });
        modalReviewDispatch({ type: SET_REVIEW_COMMENT, payload: state.comment });
        modalReviewDispatch({ type: SET_REVIEW_RATING, payload: state.rating });
    }, [state]);


    const reviewChangeHandler = (e) => {
        switch (e.target.name) {
            case "title": {
                return modalReviewDispatch({ type: SET_REVIEW_TITLE, payload: e.target.value.slice(0, 50) })
            }
            case "comment": {
                return modalReviewDispatch({ type: SET_REVIEW_COMMENT, payload: e.target.value.slice(0, 600) })
            }
            default: {
                return
            }
        }
    }

    const cancelClickHandler = () => {
        closeModal();
        setValidateFields(false);
    }

    const submitHandler = (e) => {
        e.preventDefault();

        setValidateFields(true);

        if (!reviewTitleValidator(modalState.title) && !reviewCommentValidator(modalState.comment) && !reviewRatingValidator(modalState.rating)) {
            addReviewHandler(modalState.title, modalState.comment, modalState.rating);
            closeModal();
            modalReviewDispatch({ type: RESET_REVIEW });
        }
    }


    return (
        <form onSubmit={submitHandler}>

            <div className="review-stars-container input-section">
                <Stars
                    size={30}
                    readOnly={false}
                    value={modalState.rating}
                    getVal={(val) => modalReviewDispatch({ type: SET_REVIEW_RATING, payload: val })}
                />
                {(validateFields && !!reviewRatingValidator(modalState.rating)) && (
                    <span className='input-error'>{reviewRatingValidator(modalState.rating)}</span>
                )}
            </div>

            <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

            <div className="input-section">
                <label htmlFor="title" className="label1">Title*</label>
                <input onChange={reviewChangeHandler} maxLength={50} className='input1' type="text" name="title" id="title" defaultValue={modalState.title} />
                <span className="input-caption" style={{ alignSelf: "flex-end" }}>{modalState.title.length}/50</span>
                {(validateFields && !!reviewTitleValidator(modalState.title)) && (
                    <span className='input-error'>{reviewTitleValidator(modalState.title)}</span>
                )}
            </div>

            <div className="input-section">
                <label htmlFor="comment" className="label1">Comment*</label>
                <textarea 
                    onChange={reviewChangeHandler} 
                    maxLength={600} 
                    className='textarea1'
                    name="comment" 
                    id="comment" 
                    defaultValue={modalState.comment} 
                />
                <span className="input-caption" style={{ alignSelf: "flex-end" }}>{modalState.comment.length}/600</span>

                {(validateFields && !!reviewCommentValidator(modalState.comment)) && (
                    <span className='input-error'>{reviewCommentValidator(modalState.comment)}</span>
                )}
            </div>

            <div className="modal-btn-container">
                <button type="button" onClick={cancelClickHandler} className='secondary-btn'>Cancel</button>
                <button type="submit" className='main-btn'>Add</button>
            </div>
        </form>
    )
}



const ProductReview = ({ mainProduct }) => {

    const [state, reviewDispatch] = useReducer(reviewReducer, initialState);

    const { loggedIn, user } = useSelector(state => state.loggedIn);
    const { reviewsLoading, productReview, productReviewsError } = useSelector((state) => state.productReviews);

    const dispatch = useDispatch();
    const { getProductReviews, addProductReview, deleteProductReview } = bindActionCreators(actionCreators, dispatch);

    const { openModal, closeModal } = useContext(ModalContext);

    const [reviewPage, setReviewPage] = useState(null);
    const [reviewExist, setReviewExist] = useState(false);
    const [noReviews, setNoReviews] = useState(false);

    useEffect(() => {
        if(productReviewsError){
            setNoReviews(true);
            toast.error(productReviewsError, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }, [productReviewsError]);


    useEffect(() => {
        let isFetched = false;
        const fetchReviews = () => {
            if ((window.scrollY > 800) && !isFetched && Object.keys(productReview).length === 0) {
                if (mainProduct.review_id) {
                    setNoReviews(false);
                    getProductReviews(mainProduct._id);
                    isFetched = true;
                }
                else {
                    setNoReviews(true);
                }
            }
        }
        window.addEventListener("scroll", fetchReviews);

        return () => {
            window.removeEventListener("scroll", fetchReviews);
        }
        // eslint-disable-next-line
    }, [mainProduct]);


    useEffect(() => {
        if (productReview && Object.keys(productReview).length && productReview.reviews && (productReview.reviews.length > 0) && loggedIn) {
            setNoReviews(false);
            const exist = productReview.reviews.find((rev) => rev.user_id.toString() === user._id.toString());
            if (!!exist) {
                reviewDispatch({ type: SET_REVIEW_TITLE, payload: exist.title })
                reviewDispatch({ type: SET_REVIEW_COMMENT, payload: exist.comment })
                reviewDispatch({ type: SET_REVIEW_RATING, payload: exist.rating })
                setReviewExist(true);
            }
        }
        else if(productReview && Object.keys(productReview).length === 0){
            setReviewExist(false);
            setNoReviews(true);
        }
        // eslint-disable-next-line
    }, [productReview])


    useEffect(() => {
        if (reviewPage) {
            getProductReviews(mainProduct._id, reviewPage);
        }
        // eslint-disable-next-line
    }, [reviewPage]);


    const handleReviewPageClick = (page) => {
        setReviewPage(page);
    }

    const addReviewHandler = (title, comment, rating) => {
        addProductReview({ title, comment, rating }, mainProduct._id);
        getProductReviews(mainProduct._id, reviewPage ? reviewPage : 1);
    }

    const handleWriteReview = () => {
        openModal(
            reviewExist ? "Edit your review" : "Write your review", 
            <ReviewModalContent 
                state={state}
                addReviewHandler={addReviewHandler}
            />,
            true
        );
    }

    const reviewOptionsClickHandler = (val) => {
        switch (val) {
            case "Delete": {
                openModal(
                    "Are you sure you want to delete your review?",
                    <>
                        <div className="modal-btn-container">
                            <div onClick={closeModal} className="secondary-btn">No</div>
                            <div onClick={() => {
                                deleteProductReview(mainProduct._id);
                                closeModal();
                                reviewDispatch({ type: RESET_REVIEW });
                            }} className="main-btn">Yes</div>
                        </div>
                    </>
                )
                break
            }

            case "Edit": {
                handleWriteReview();
                break
            }

            default: {
                return
            }
        }
    }


    return (
        <div className="customer-reviews-container">

            {reviewsLoading ? <Loader /> : (

                (productReview && Object.keys(productReview).length > 0) ? (
                    <>
                        <div className="heading">Customer reviews & ratings</div>

                        <div className="rating-container">

                            <div className="rating-section">
                                <div className="total-rating">{productReview.rating}<span> out of </span>5</div>
                                <Stars value={productReview.rating} size="13px" /><span>{`(${productReview.total_reviews} reviews)`}</span>
                                <br />
                                <button
                                    onClick={handleWriteReview}
                                    className='main-btn'
                                    style={{ margin: "16px 0px" }}
                                >
                                    {reviewExist ? "Edit your review" : "Write a review"}
                                </button>
                            </div>


                            <div className="reviews-section">
                                {(reviewsLoading) ? (<span className="loader"></span>) : (Object.keys(productReview).length && productReview.reviews && productReview.reviews.length > 0) && (

                                    <ResponsiveMasonry
                                        columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 2 }}
                                    >
                                        <Masonry gutter='20px'>
                                            {productReview.reviews.map((review, index) => {
                                                return (
                                                    <div key={index} className="review-card">
                                                        {(user && (review.user_id === user._id)) && (
                                                            <div className="review-card-more-btn">
                                                                <DropdownButton
                                                                    icon={true}
                                                                    contentArr={reviewCardOptions}
                                                                    clickedElem={(val) => reviewOptionsClickHandler(val)}
                                                                />
                                                            </div>
                                                        )}

                                                        <Stars value={review.rating} size="11px" />
                                                        {review.is_verified_purchase && (
                                                            <span className='verified-review'>&nbsp; Verified Purchaser</span>
                                                        )}
                                                        <div className='review-product'>{(review.product_name) ? review.product_name.slice(0, 30) : mainProduct.name.slice(0, 30)}</div>

                                                        <div className="review-content">

                                                            <div className="review-title">{review.title}</div>
                                                            <div className="review-comment">{review.comment}</div>

                                                            <div className="reviewer-name">{review.name}</div>
                                                            
                                                            <LikesDislikes reviewsId={productReview._id} review={review} />

                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </Masonry>
                                    </ResponsiveMasonry>
                                )}
                            </div>

                            {(productReview.total_reviews.length > 10) && (
                                <Paginate total={productReview.total_reviews} pageSize={10} onChange={handleReviewPageClick} current={reviewPage} />
                            )}

                        </div>
                    </>

                ) : (

                    (noReviews) && (
                        <>
                            <div className="heading">Customer reviews & ratings</div>

                            <div className="rating-container">

                                <div className="rating-section">
                                    <div className="total-rating">No reviews yet!</div>
                                    <Stars value={0} size="13px" /><span>&nbsp;&nbsp; Be the first to review this product!</span>
                                    <br />
                                    <button
                                        onClick={handleWriteReview}
                                        className='secondary-btn'
                                        style={{ margin: "16px 2px" }}
                                    >
                                        Write a review
                                    </button>
                                </div>
                            </div>
                        </>
                    )
                )
            )}
        </div>
    )
}

export default ProductReview
