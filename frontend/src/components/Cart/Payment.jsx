import React, { useRef } from 'react';
import "./Payment.css";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import axios from 'axios';
import { CiCreditCard1 } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';
import { toast } from 'react-toastify';
// import creditCardType from 'credit-card-type';


const Payment = ({ cartItems, price, address }) => {

    const { user } = useSelector(state => state.loggedIn);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const payBtnRef = useRef(null);
    // const [cardType, setCardType] = useState('');


    // const handleCardNumberChange = (e) => {
        // const cardNumber = e.target.value;
        // const cardResult = creditCardType(cardNumber);
        // if (cardResult.length > 0) {
        //     setCardType(cardResult[0].type);
        // } else {
        //     setCardType('');
        // }
    // };


    // useEffect(() => {
    //     console.log(cardType);
    // }, [cardType])


    const toastErrPopUp = (msg) => {
        toast.error(msg, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }


    const toastSuccessPopUp = (msg) => {
        toast.success(msg, {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }


    const paymentSubmitHandler = async(e) => {

        e.preventDefault();

        payBtnRef.current.disabled = true;

        try {

            dispatch(loaderSpin(true));

            const config = { headers: { "Content-Type" : "application/json" } };

            const order_items = [];
            cartItems.forEach(item => {
                const obj = {};
                obj.product = item.product;
                obj.quantity = item.quantity;
                order_items.push(obj);
            })

            const { data } = await axios.post("/api/v1/order/payment", { order_items }, config);

            const clientSecret = data.client_secret;

            if(!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: address.flat,
                            line2: address.street_address,
                            city: address.city,
                            state: address.state,
                            postal_code: address.zip,
                        }
                    }
                }
            });

            dispatch(loaderSpin(false));

            if(result.error){
                payBtnRef.current.disabled = false;
                toastErrPopUp(toast.error);
            }else{
                if(result.paymentIntent.status === "succeeded"){
                    toastSuccessPopUp("Payment successful!")
                    navigate("/success");
                }
                else{
                    toastErrPopUp("An issue ocuurred while processing your request!")
                }
            }
            
        } catch (error) {
            payBtnRef.current.disabled = false;
            toastErrPopUp(error.response.data.message);
            dispatch(loaderSpin(false));
        }
    }

    return (
        <div className='payment-container'>

            <div className="heading">Pay with card</div>

            <form className='payment-form' onSubmit={paymentSubmitHandler}>
                <div>
                    <CiCreditCard1 className='icon' size={30} />
                    <label htmlFor='card-number' className="label1">Card number*</label>
                    <CardNumberElement className='payment-card-input extra' id='card-number' />
                </div>

                <label htmlFor='expiry-date' className="label1">Expiry date*</label>
                <CardExpiryElement className='payment-card-input' id='expiry-date' />

                <label htmlFor='card-cvc' className="label1">CVC*</label>
                <CardCvcElement className='payment-card-input' id='card-cvc' />

                <div className="modal-btn-container">
                    <button ref={payBtnRef} type="submit" className='main-btn'>Continue</button>
                </div>
            </form>
        </div>
    )
}

export default Payment
