import React, { useRef } from 'react';
import "./Payment.css";
import {
    CardNumberElement,
    CardCvcElement,
    CardExpiryElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import axios from 'axios';
import IconCreditCard from '@tabler/icons-react/dist/esm/icons/IconCreditCard';
import { useDispatch, useSelector } from 'react-redux';
import { loaderSpin } from '../../State/action-creators/LoaderActionCreator';
import { toast } from 'react-toastify';
import GooglePayButton from '@google-pay/button-react';
// import creditCardType from 'credit-card-type';


const Payment = ({ cartItems, price, address, setOrderPlaced }) => {

    const { user } = useSelector(state => state.loggedIn);

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

    const placeNewOrder = async (order_items, address, payment_id) => {

        try {
            const config = { headers: { "Content-Type": "application/json" } };

            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/order/placeneworder`, { order_items, address, stripe_payment_id: payment_id }, config);

            dispatch(loaderSpin(false));

            return data.success;

        } catch (error) {
            payBtnRef.current.disabled = false;
            toastErrPopUp(error.response.data.message);
            dispatch(loaderSpin(false));
        }
    }

    const paymentSubmitHandler = async (e) => {

        e.preventDefault();

        payBtnRef.current.disabled = true;

        try {

            dispatch(loaderSpin(true));

            const config = { headers: { "Content-Type": "application/json" } };

            const order_items = [];
            cartItems.forEach(item => {
                const obj = {};
                obj.product = item.product;
                obj.quantity = item.quantity;
                order_items.push(obj);
            })

            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/v1/order/payment`, { order_items }, config);

            const clientSecret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(clientSecret, {
                receipt_email: user.email,
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


            if (result.error) {
                payBtnRef.current.disabled = false;
                toastErrPopUp(toast.error);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    let placedOrder = await placeNewOrder(order_items, address, result.paymentIntent.id);
                    if (placedOrder) {
                        toastSuccessPopUp("Order placed successfully!");
                        window.scrollTo(0,0);
                        setOrderPlaced(true);
                    }
                    else {
                        toastErrPopUp("Unable to process your request, please contact ManyIN customer service!")
                    }
                }
                else {
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

            <section className="payment-method">
                <div className="heading">Pay with card</div>

                <form className='payment-form' onSubmit={paymentSubmitHandler}>
                    <div>
                        <IconCreditCard className='icon' size={25} strokeWidth={1.25} />
                        <label htmlFor='card-number' className="label1">Card number*</label>
                        <CardNumberElement className='payment-card-input extra' id='card-number' />
                    </div>

                    <label htmlFor='expiry-date' className="label1">Expiry date*</label>
                    <CardExpiryElement className='payment-card-input' id='expiry-date' />

                    <label htmlFor='card-cvc' className="label1">CVC*</label>
                    <CardCvcElement className='payment-card-input' id='card-cvc' />

                    <div className="modal-btn-container">
                        <button ref={payBtnRef} type="submit" className='main-btn'>Pay &nbsp;-&nbsp; <span className='price'>{price}</span></button>
                    </div>
                </form>
            </section>

            <section className="payment-method">
                <div className="heading">Pay with G-Pay</div>

                <GooglePayButton
                    environment="TEST"
                    buttonColor='white'
                    buttonType='pay'
                    paymentRequest={{
                        apiVersion: 2,
                        apiVersionMinor: 0,
                        allowedPaymentMethods: [
                            {
                                type: 'CARD',
                                parameters: {
                                    allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                    allowedCardNetworks: ['MASTERCARD', 'VISA'],
                                },
                                tokenizationSpecification: {
                                    type: 'PAYMENT_GATEWAY',
                                    parameters: {
                                        gateway: 'example',
                                        gatewayMerchantId: 'exampleGatewayMerchantId',
                                    },
                                },
                            }
                        ],
                        merchantInfo: {
                            merchantId: '12345678901234567890',
                            merchantName: 'Demo Merchant',
                        },
                        transactionInfo: {
                            totalPriceStatus: 'FINAL',
                            totalPriceLabel: 'Total',
                            totalPrice: price && price.toString(),
                            currencyCode: 'INR',
                            countryCode: 'IN',
                        },
                        shippingAddressRequired: true,
                        callbackIntents: ['PAYMENT_AUTHORIZATION']
                    }}
                    onLoadPaymentData={paymentRequest => {
                        console.log('load payment data', paymentRequest);
                    }}
                    onPaymentAuthorized={paymentData => {
                        console.log('Payment Authorization Success', paymentData);
                        return { transactionState: "SUCCESS" }
                    }}
                    onCancel={() => toastErrPopUp("Payment Cancelled!")}
                />
            </section>
        </div>
    )
}

export default Payment
