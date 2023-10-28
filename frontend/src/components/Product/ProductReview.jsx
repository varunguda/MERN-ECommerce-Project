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


const ProductReview = ({ products, mainProduct }) => {

    const [state, reviewDispatch] = useReducer(reviewReducer, initialState);

    const { loggedIn, user } = useSelector(state => state.loggedIn);
    const { reviewsLoading, productReview, productReviewsError } = useSelector((state) => state.productReviews);

    const dispatch = useDispatch();
    const { getProductReviews, addProductReview, deleteProductReview } = bindActionCreators(actionCreators, dispatch);

    const { openModal, closeModal, setModalContent } = useContext(ModalContext);

    const [reviewPage, setReviewPage] = useState(null);
    const [reviewExist, setReviewExist] = useState(false);
    const [validateFields, setValidateFields] = useState(false);
    const [noReviews, setNoReviews] = useState(false);


    useEffect(() => {
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
    }, [productReviewsError])


    useEffect(() => {
        let isFetched = false;
        const fetchReviews = () => {
            if ((window.scrollY > 800) && !isFetched && Object.keys(productReview).length === 0) {
                if (products && products.length > 0 && products[0].review_id) {
                    setNoReviews(false);
                    getProductReviews(products[0]._id);
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
    }, [products]);


    useEffect(() => {
        if (productReview && Object.keys(productReview).length && productReview.reviews && (productReview.reviews.length > 0) && loggedIn) {
            const exist = productReview.reviews.filter((rev) => rev.user_id.toString() === user._id.toString());
            if (exist.length > 0) {
                reviewDispatch({ type: SET_REVIEW_TITLE, payload: exist[0].title })
                reviewDispatch({ type: SET_REVIEW_COMMENT, payload: exist[0].comment })
                reviewDispatch({ type: SET_REVIEW_RATING, payload: exist[0].rating })
                setReviewExist(true);
            };
        }
        // eslint-disable-next-line
    }, [productReview])


    useEffect(() => {
        if (reviewPage) {
            getProductReviews(products[0]._id, reviewPage);
        }
        // eslint-disable-next-line
    }, [reviewPage]);


    const handleReviewPageClick = (page) => {
        setReviewPage(page);
    }

    const reviewChangeHandler = (e) => {
        switch (e.target.name) {
            case "title": {
                return reviewDispatch({ type: SET_REVIEW_TITLE, payload: e.target.value.slice(0, 100) })
            }
            case "comment": {
                return reviewDispatch({ type: SET_REVIEW_COMMENT, payload: e.target.value.slice(0, 400) })
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


    const addReviewHandler = (e) => {
        e.preventDefault();

        setValidateFields(true);

        if (!reviewTitleValidator(state.title) && !reviewCommentValidator(state.comment) && !reviewRatingValidator(state.rating)) {
            addProductReview(state, mainProduct._id);
            closeModal();
            reviewDispatch({ type: RESET_REVIEW });
        }
    }


    const reviewContainer = (state) => (

        <form onSubmit={addReviewHandler}>

            <div className="review-stars-container input-section">
                <Stars
                    size={30}
                    readOnly={false}
                    value={state.rating}
                    getVal={(val) => reviewDispatch({ type: SET_REVIEW_RATING, payload: val })}
                />
                {(validateFields && reviewRatingValidator(state.rating)) && (
                    <span className='input-error'>{reviewRatingValidator(state.rating)}</span>
                )}
            </div>

            <div className="form-instruction" style={{ marginBottom: "8px" }}>*Required fields</div>

            <div className="input-section">
                <label htmlFor="title" className="label1">Title*</label>
                <input onChange={reviewChangeHandler} maxLength={100} className='input1' type="text" name="title" id="title" defaultValue={state.title} />
                <span className="input-caption" style={{ alignSelf: "flex-end" }}>{state.title.length}/100</span>
                {(validateFields && reviewTitleValidator(state.title)) && (
                    <span className='input-error'>{reviewTitleValidator(state.title)}</span>
                )}
            </div>

            <div className="input-section">
                <label htmlFor="comment" className="label1">Comment*</label>
                <textarea onChange={reviewChangeHandler} maxLength={400} className='textarea1' name="comment" id="comment" defaultValue={state.comment} />
                <span className="input-caption" style={{ alignSelf: "flex-end" }}>{state.comment.length}/400</span>
                {(validateFields && reviewCommentValidator(state.comment)) && (
                    <span className='input-error'>{reviewCommentValidator(state.comment)}</span>
                )}
            </div>

            <div className="modal-btn-container">
                <button type="button" onClick={cancelClickHandler} className='secondary-btn'>Cancel</button>
                <button type="submit" className='main-btn'>Add</button>
            </div>
        </form>
    )

    const handleWriteReview = () => {
        openModal(reviewExist ? "Edit your review" : "Write your review", reviewContainer(state), true);
    }

    useEffect(() => {
        setModalContent(reviewContainer(state));
        // eslint-disable-next-line
    }, [state, validateFields]);


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
