import React, { useState, useEffect } from "react"
import Navbar from './Navbar';
import TimePicker from 'react-time-picker';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import cartEmpty from "../assets/cart_empty.gif"
import 'react-toastify/dist/ReactToastify.css';
import './Cart.css'


function Menu() {
    let navigate = useNavigate();
    const [data1Fetched, setData1Fetched] = useState(false);
    const [adding_order, setAdding_order] = useState(false);
    const [fetch_loading, setFetch_loading] = useState('Loading...');
    const [grand_total, setGrand_total] = useState('Loading...');
    const [no_item_in_cart, setNo_item_in_cart] = useState('');
    const [cart_fetched, setCart_fetched] = useState([]);

    var currentdate = new Date();

    const [hr_value, onhrChange] = useState(currentdate.getHours().toString())
    const [mi_value, onmiChange] = useState(currentdate.getMinutes().toString())

    const [min_hr_value, onmhrChange] = useState(currentdate.getHours().toString())
    const [min_mi_value, onmmiChange] = useState(currentdate.getMinutes().toString())

    const data1Fetcher = async (name, type) => {

        let cart_items = JSON.parse(localStorage.getItem('cart'))
        let temp_arr = []
        let gt = 0
        let pop_index = []
        let cart_corrected = false

        for (const [key, value] of Object.entries(cart_items)) {
            temp_arr.push(key)
        }

        let _data = {
            ids: temp_arr
        }

        await fetch('https://api.fud4.me/user/v1/menu/get/specific', {
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
                setData1Fetched(true);
                setFetch_loading('')
                if (data.response_code == 200) {
                    for (let i = 0; i < data.response.data.length; i++) {
                        if (data.response.data[i].quantity < cart_items[data.response.data[i]._id]) {
                            cart_corrected = true
                            if (data.response.data[i].quantity == 0) {
                                cart_items[data.response.data[i]._id] = undefined
                                pop_index.push(i)
                            } else {
                                cart_items[data.response.data[i]._id] = data.response.data[i].quantity
                                data.response.data[i].count = cart_items[data.response.data[i]._id]
                                gt += data.response.data[i].count * data.response.data[i].price
                            }
                        } else {
                            data.response.data[i].count = cart_items[data.response.data[i]._id]
                            gt += data.response.data[i].count * data.response.data[i].price
                        }
                    }
                    if (cart_corrected) {
                        if (type == 'add') {
                            toast("No more stock left to add ⚠️", {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                type: "error"
                            });
                        } else {
                            toast("Your cart has been updated according to available stock ⚠️", {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                type: "error"
                            });
                        }
                    } else {
                        if (type == 'add') {
                            toast(name + " added to cart 🥳", {
                                position: "top-right",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "colored",
                                type: "success"
                            });
                        }
                    }
                    pop_index.forEach(element => {
                        data.response.data.splice(element, 1)
                    })
                    localStorage.setItem('cart', JSON.stringify(cart_items))
                    setGrand_total(gt.toFixed(2))
                    setCart_fetched(data.response.data)
                    if (data.response.data.length == 0) {
                        setNo_item_in_cart('No item in your cart 🥺!')
                    }
                } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("temp_user");
                }
            })
            .catch(err => { console.log(err); });
    }


    useEffect(() => {
        if (!(localStorage.getItem('user') && localStorage.getItem('user') != null)) {
            navigate("/", { replace: true });
        }

        if (!data1Fetched) {
            data1Fetcher('updater', 'fetch')
        }
    });

    const addToCart = (id, name) => {
        let updated_cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {}
        updated_cart[id] = updated_cart[id] ? (updated_cart[id] + 1) : 1
        localStorage.setItem('cart', JSON.stringify(updated_cart))
        data1Fetcher(name, 'add')
    }

    const removeFromCart = (id, name) => {
        let updated_cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {}
        let temp_val = updated_cart[id]
        updated_cart[id] = temp_val ? (((temp_val - 1) > 0) ? (temp_val - 1) : undefined) : undefined
        localStorage.setItem('cart', JSON.stringify(updated_cart))
        if (temp_val >= 0) {
            toast(name + " removed from cart 😩", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                type: "error"
            });
        }
        data1Fetcher(name, 'rem')
    }

    const navigatePay = async () => {
        let hr_dif = parseInt(hr_value) - parseInt(min_hr_value)
        let mi_dif = parseInt(mi_value) - parseInt(min_mi_value)
        let crctd_hr = hr_dif * 60
        let total_min = crctd_hr + mi_dif
        setAdding_order(true)
        let cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {}
        let arr = []
        for (const [key, value] of Object.entries(cart)) {
            let obj = {}
            obj.id = key
            obj.quantity = value
            arr.push(obj)
        }
        let _data = {}
        _data.order_items = arr
        if(total_min >= 11){
            _data.delivery_time = total_min
        }
        await fetch('https://api.fud4.me/user/v1/order/add', {
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
                    localStorage.setItem('order-id', data.response._id)
                    localStorage.setItem('payment-order-id', data.response.payment.order_id)
                    localStorage.setItem('gt', grand_total)
                    navigate("/pay", { replace: true });
                } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("temp_user");
                } else {
                    alert(data.message)
                }
            })
            .catch(err => { console.log(err); });
        // alert('This feature will be added soon.')
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

    const renderPayButton = () => {
        if (cart_fetched.length > 0) {
            return (
                <>
                    <button disabled={(adding_order) ? true : false} className="fud4me-button" onClick={navigatePay}>{(adding_order) ? 'Processing...' : 'Proceed'}</button>
                </>
            )
        } else {
            return
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
            <label class="CartText">Cart</label>
            <div class="new-parent">
                {renderHeader()}
                <p className="black">{fetch_loading}</p>
                {cart_fetched.map(element => (
                    <div class="Container-w-100">
                        <button class="leftAddButton" onClick={() => removeFromCart(element._id, element.name)}>-</button>
                        <button class="rightAddButton" onClick={() => addToCart(element._id, element.name)}>+</button>
                        <img src={element.image} class="menuImg"></img>
                        <p className="menuText">{element.name}<br /><span className="menuSpan">₹{element.price}</span><br /><span className="menuSpan">{element.owner.name}</span></p>
                        <p className="menuTextCenter">{element.count}</p>
                        <p className="menuTextEnd">₹{element.count * element.price}</p>
                    </div>
                ))}
                {
                    cart_fetched.length > 0 ?
                        <>
                            <label className="black small-txt">Please fill the below fields if you want food in a later time : &nbsp;</label><br></br>
                            <label className="black mar-less">Hour : &nbsp;</label>
                            <input className="black" type="number" min={min_hr_value} onChange={(e) => onhrChange(e.target.value)} max="23" value={hr_value}></input>
                            <label className="black mar-less">&nbsp; &nbsp;Minute : &nbsp;</label>
                            <input className="black" type="number" min={min_mi_value} onChange={(e) => onmiChange(e.target.value)} max="59" value={mi_value}></input>
                        </> :
                        <></>
                }
            </div>
            <p class="grand-total"><b>Grand Total</b> : ₹{grand_total}</p>
            {renderPayButton()}
        </div>

    );
}

export default Menu