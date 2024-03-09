import React, { useState, useEffect } from "react"
import Navbar from './Navbar';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Menu.css'


function Menu() {
    let navigate = useNavigate();
    const [data1Fetched, setData1Fetched] = useState(false);
    const [fetched_menu, setFetched_menu] = useState([]);
    const [fetch_loading_all, setFetch_loading_all] = useState('Loading...');
    const [data2Fetched, setData2Fetched] = useState(false);
    const [fetched_menu_recommended, setFetched_menu_recommended] = useState([]);
    const [fetch_loading_recommended, setFetch_loading_recommended] = useState('Loading...');

    const newData1Fetcher = async (name, type) => {

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
                        if(type == 'add'){
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
                        }else{
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
                        if(type == 'add'){
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
                } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("temp_user");
                }
            })
            .catch(err => { console.log(err); });
    }

    const addToCart = (id, name) => {
        let updated_cart = (localStorage.getItem('cart')) ? JSON.parse(localStorage.getItem('cart')) : {}
        updated_cart[id] = updated_cart[id] ? (updated_cart[id] + 1) : 1
        localStorage.setItem('cart', JSON.stringify(updated_cart))
        newData1Fetcher(name,'add')
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
        newData1Fetcher(name,'rem')
    }


    useEffect(() => {
        if (!(localStorage.getItem('user') && localStorage.getItem('user') != null)) {
            navigate("/", { replace: true });
        }

        const data1Fetcher = async () => {
            await fetch('https://api.fud4.me/user/v1/menu/get', {
                method: "GET",
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
                    if (data.response_code == 200) {
                        setFetched_menu(data.response.data)
                        if (data.response.data.length == 0) {
                            setFetch_loading_all('No food available 😔')
                        } else {
                            setFetch_loading_all(null)
                        }
                    } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                        localStorage.removeItem("user");
                        localStorage.removeItem("temp_user");
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => { console.log(err); });
        }

        const data2Fetcher = async () => {
            await fetch('https://api.fud4.me/user/v1/menu/get/recommended', {
                method: "GET",
                headers: { "Content-type": "application/json; charset=UTF-8", "authorization": "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken },
                mode: 'cors'
            })
                .then(response => {
                    var data = response.json()
                    return data
                }
                )
                .then(data => {
                    setData2Fetched(true);
                    if (data.response_code == 200) {
                        setFetched_menu_recommended(data.response.data)
                        if (data.response.data.length == 0) {
                            setFetch_loading_recommended('No recommendations available 🙅')
                        } else {
                            setFetch_loading_recommended(null)
                        }
                    } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                        localStorage.removeItem("user");
                        localStorage.removeItem("temp_user");
                    } else {
                        console.log(data)
                    }
                })
                .catch(err => { console.log(err); });
        }

        if (!data1Fetched) {
            data1Fetcher()
        }
        if (!data2Fetched) {
            data2Fetcher()
        }
    });
    return (

        <div class="contents">
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/grid/"></link>
            <ToastContainer />
            <Navbar />

            <br />
            <label class="Recommended">RECOMMENDED</label>
            <div class="parent">
                {fetch_loading_recommended}
                {fetched_menu_recommended.map(element => (
                    <div class="Container">
                        <button class="leftAddButton" onClick={() => removeFromCart(element._id, element.name)}>-</button>
                        <button class="rightAddButton" onClick={() => addToCart(element._id, element.name)}>+</button>
                        <img src={element.image} class="menuImg"></img>
                        <p className="menuText">{element.name}<br /><span className="menuSpan">₹{element.price}</span><br /><span className="menuSpan">{element.owner.name}</span></p>
                    </div>
                ))}
            </div>

            <br />
            <label class="Fooditems">MENU</label>

            <div class="parent">
                {fetch_loading_all}
                {fetched_menu.map(element => (
                    <div class="Container">
                        <button class="leftAddButton" onClick={() => removeFromCart(element._id, element.name)}>-</button>
                        <button class="rightAddButton" onClick={() => addToCart(element._id, element.name)}>+</button>
                        <img src={element.image} class="menuImg"></img>
                        <p className="menuText">{element.name}<br /><span className="menuSpan">₹{element.price}</span><br /><span className="menuSpan">{element.owner.name}</span></p>
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Menu