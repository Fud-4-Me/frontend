import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code"
import payFailLogo from '../assets/failed.png'
import paySuccessLogo from '../assets/success.png'
import qr from '../assets/qr-scan.png'
import delivered from '../assets/delivered.png'
import timer from '../assets/timer.png'
import cancel from '../assets/cancel.png'
import Popup from "./Popup";
import './Yourorder.css'

function Order({ data }) {
    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    let temp = 0
    let text_map = {
        'created': 'Order Created 😀',
        'preparing': 'Order Preparing ⏰',
        'ready': 'Ready for delivery ✅',
        'delivered': 'Order Delivered 🚚',
        'payment-failed': 'Payment Pending 🚫'
    }
    data.order.forEach(element => {
        temp += element.quantity
    });
    const [expand, setExpand] = useState(false)
    const [quantity, setQuantity] = useState(temp)
    const [products, setProducts] = useState(data.order.length)

    const [new_data, setData] = useState([])

    useEffect(() => { setData(new Date()) }, [new_data])

    const qrShower = () => {
        setIsOpen(!isOpen)
        if (isOpen == true) {
            window.location.reload();
        }
    }

    const orderRemover = async (id) => {
        if (window.confirm('Do you want to cancel this order ❌? This cannot be revered.')) {
            let _data = {}
            _data.id = id
            await fetch('https://api.fud4.me/user/v1/order/cancel', {
                method: "POST",
                body: JSON.stringify(_data),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken
                },
                mode: 'cors'
            })
                .then(response => {
                    var data = response.json()
                    return data
                }
                )
                .then(data => {
                    if (data.response_code == 401 || data.response_code == 403) {
                        localStorage.removeItem("user");
                        localStorage.removeItem("temp_user");
                    } else {
                        alert(data.message)
                        window.location.reload();
                    }
                })
                .catch(err => {
                    alert('Error')
                    window.location.reload();
                });
        }
    }
    return (
        <div class="orderbox">
            <div class="Container-w-100">
                {
                    data.payment_completed ?
                        <img src={paySuccessLogo} class="menuImg"></img>
                        :
                        <img src={payFailLogo} class="menuImg"></img>
                }
                <p className="menuText">{'Purchase of ' + products.toString() + ' products'}<br /><span className="menuSpan">₹{(data.amount)}</span><br /><span className="menuSpan">{'Quantity : ' + quantity}</span></p>
                <span className={"menuTextCenterNew" + " status-" + (data.payment_completed ? data.order_status : 'payment-failed')}>{text_map[(data.payment_completed ? data.order_status : 'payment-failed')]}</span>
                <button className='qr-button' disabled={(data.order_status == 'ready' || data.order_status == 'created') ? false : true} onClick={() => qrShower()}>
                    {
                        (data.order_status == 'delivered') ?
                            <img src={delivered} class="menuImg"></img>
                            :
                            ''
                    }
                    {
                        (data.order_status == 'created') ?
                            <img src={cancel} class="menuImg"></img>
                            :
                            ''
                    }
                    {
                        (data.order_status == 'preparing') ?
                            <img src={timer} class="menuImg"></img>
                            :
                            ''
                    }
                    {
                        (data.order_status == 'ready') ?
                            <img src={qr} class="menuImg"></img>
                            :
                            ''
                    }
                </button>
                {isOpen && <Popup
                    content={<>
                        {data.order_status == 'created' ?
                            <>
                                <p className='pop-up-head'><b>Cancel Order</b></p>
                                <p className='text-center'>Are you sure, do you want to cancel this order ❌ ?</p>
                                <button onClick={() => orderRemover(data._id)}>Cancel Order</button>
                            </> :
                            <>
                                <p className='pop-up-head'><b>Scan QR</b></p>
                                <p className='text-center'><QRCode value={data._id} /></p>
                                <button onClick={() => qrShower()}>Close</button>
                            </>
                        }
                    </>}
                    handleClose={() => qrShower()}
                />}
            </div>
        </div>
    )
}

export default Order