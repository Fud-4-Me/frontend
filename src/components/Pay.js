import React, { useState, useEffect } from "react"
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import cartEmpty from "../assets/cart_empty.gif"
import payLogo from '../assets/pay.svg'
import paySuccessLogo from '../assets/pay-success.svg'
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css'


function Menu() {
    let navigate = useNavigate();
    const [data1Fetched, setData1Fetched] = useState(false);
    const [justPaid, setJustPaid] = useState(false);
    const [adding_order, setAdding_order] = useState(false);
    const [fetch_loading, setFetch_loading] = useState('Loading...');
    const [pay_success, setPay_success] = useState(false);
    const [grand_total, setGrand_total] = useState('Loading...');
    const [no_item_in_cart, setNo_item_in_cart] = useState('');
    const [cart_fetched, setCart_fetched] = useState([]);

    const data1Fetcher = async () => {
        setGrand_total(localStorage.getItem('gt'))
    }


    useEffect(() => {
        if (!(localStorage.getItem('user') && localStorage.getItem('user') != null)) {
            navigate("/", { replace: true });
        }

        if ((!(localStorage.getItem('order-id') && localStorage.getItem('order-id') != null) || !(localStorage.getItem('payment-order-id') && localStorage.getItem('payment-order-id') != null)) && !justPaid) {
            navigate("/cart", { replace: true });
        }

        if (!data1Fetched) {
            data1Fetcher()
        }
    });

    const validatePay = async (data, order_id) => {
        let _data = {}
        _data.payment_id = data.razorpay_payment_id
        _data.signature = data.razorpay_signature
        _data.order_id = localStorage.getItem('order-id')
        console.log(_data)
        await fetch('https://api.fud4.me/user/v1/payment/verify/order', {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8", "authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken },
            mode: 'cors'
        })
            .then(response => {
                var data = response.json()
                return data
            }
            )
            .then(data => {
                if (data.response_code == 200) {
                    setPay_success(true)
                    setJustPaid(true)
                    localStorage.setItem('cart', JSON.stringify({}))
                    localStorage.removeItem('order-id')
                    localStorage.removeItem('payment-order-id')
                    localStorage.removeItem('gt')
                } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("temp_user");
                } else {
                    alert(data.message)
                }
            })
            .catch(err => { console.log(err); });
    }

    const navigatePay = async () => {
        let order_id = localStorage.getItem('payment-order-id')
        let user = JSON.parse(localStorage.getItem('user')).user
        var options = {
            "key": "rzp_test_wj1AU7zct0TYYc",
            "amount": (grand_total * 100).toString(),
            "currency": "INR",
            "name": "Fud4Me App",
            "description": "Order payment.",
            "image": "https://app.geekstudios.tech/cdn/img/knife100.de32a2733f64245c8b6c.png",
            "order_id": order_id,
            "handler": function (response) {
                validatePay(response)
            },
            "prefill": {
                "contact": user.phone,
                "name": user.name,
                "email": "nihalansar9008@gmail.com"
            },
            "theme": {
                "color": "#2300a3"
            }
        };
        var rzp = new window.Razorpay(options);
        rzp.open();
    }

    const renderHeader = () => {
        if (cart_fetched.length > 0) {
            return (
                <>
                    <p className="menuHeadText">Items</p>
                    <p className="menuHeadTextCenter">Qty.</p>
                    <p className="menuHeadTextEnd">Total</p>
                </>
            )
        } else {
            return (
                <>
                    <img className="img-center-small" src={cartEmpty}></img>
                    <p className="black">{no_item_in_cart}</p>
                </>
            )
        }
    }

    const navigateHome = () => {
        navigate("/", { replace: true });
    }

    const renderPayButton = () => {
        if (!pay_success) {
            return (
                <>
                    <button id="pay-button" className="fud4me-button-new" onClick={navigatePay}>{(adding_order) ? 'Processing...' : 'Pay Now'}</button>
                </>
            )
        } else {
            return (
                <>
                    <button className="fud4me-button-new" onClick={navigateHome}>🏠 Home</button>
                </>
            )
        }
    }

    return (

        <div class="contents">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/grid/"></link>
            <ToastContainer />
            <Navbar />

            <br />
            {/* <label class="CartText">Payment</label> */}
            <div className="pay-img-div">
                {pay_success ?
                    <>
                        <img src={paySuccessLogo} alt="Login-Logo" height="350"></img>
                        <p className="new-grand-total"><b>Success ✅</b></p>
                    </>
                    :
                    <>
                        <img src={payLogo} alt="Login-Logo" height="350"></img>
                        <p className="new-grand-total"><b>Grand Total</b> : ₹{grand_total}</p>
                    </>
                }
                {renderPayButton()}
            </div>
        </div>

    );
}

export default Menu