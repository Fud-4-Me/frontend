import React,{useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";
import Navbar from './Navbar';
import Order from "./Order";
import './Yourorder.css'

function Yourorder(){

    let navigate = useNavigate();

    const [data1Fetched, setData1Fetched] = useState(false);
    const [loadData, setLoadData] = useState('Loading... 😀');
    const [orders, setOrders] = useState([]);

    const data1Fetcher = async () => {
        await fetch('https://api.fud4.me/user/v1/order/get', {
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
                console.log(data.response.data)
                setData1Fetched(true)
                setLoadData('')
                if (data.response_code == 200) {
                    setOrders(data.response.data)
                } else if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
                    localStorage.removeItem("user");
                    localStorage.removeItem("temp_user");
                } else {
                    console.log(data)
                }
            })
            .catch(err => { console.log(err); });
    }

    useEffect(() => {
        if (!(localStorage.getItem('user') && localStorage.getItem('user') != null)) {
            navigate("/", { replace: true });
        }

        if (!data1Fetched) {
            data1Fetcher()
        }
    });

    const content=[
        {
            orderid:"ORDER ID : #8976655432",
            orderon:'ORDERED ON : 25-06-2022',
            order:[
                {
                    item:"Meals",
                    quantity:"9"
                }
            ]
        },
        {
            orderid:"ORDER ID : #8976655432",
            orderon:'ORDERED ON : 25-06-2022',
            order:[
                {
                    item:"Meals",
                    quantity:"9"
                }
            ]
        },
        {
            orderid:"ORDER ID : #8976655432",
            orderon:'ORDERED ON : 25-06-2022',
            order:[
                {
                    item:"Meals",
                    quantity:"9"
                }
            ]
        },
        {
            orderid:"ORDER ID : #8976655432",
            orderon:'ORDERED ON : 25-06-2022',
            order:[
                {
                    item:"Meals",
                    quantity:"9"
                }
            ]
        },
        {
            orderid:"ORDER ID : #8976655432",
            orderon:'ORDERED ON : 25-06-2022',
            order:[
                {
                    item:"Meals",
                    quantity:"9"
                }
            ]
        },
    ]
    return (
        
        <div class="contents">
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <link rel="canonical" href="https://getbootstrap.com/docs/4.0/examples/grid/"></link>

            <Navbar/>

            <br/>
            <label class="orders">ORDER HISTORY</label>
            <br/>

            <br/>
            <p class="orders-load">{loadData}</p>
            {
                orders.map(e=>{
                    return(
                        <Order data={e}/>
                    )
                })
            }
            <br/>
        </div>
    );
}

export default Yourorder