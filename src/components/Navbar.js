import React,{useState} from "react"
import { useNavigate } from "react-router-dom";
import './Navbar.css' 
import logoknife from "../assets/knife100.png"
import cartlogo from "../assets/Cart.png"
import ClickAwayListener from 'react-click-away-listener';
import logouser from "../assets/User.png"


function Navbar(){
    let navigate = useNavigate();
    const [popup, setPopup] = useState(false)
    const logMeOut = () => {
        localStorage.removeItem("user");
        navigate("/", { replace: true });
    }
    const navigateCart = () => {
        navigate("/cart", { replace: true });
    }
    const navigateMenu = () => {
        navigate("/menu", { replace: true });
    }
    const navigateOrder = () => {
        navigate("/yourorder", { replace: true });
    }
    return (
        
        <div>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
            <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous"></link>
            <nav class="navbar navbar-expand-lg navbar-light">
                <a class="navbar-brand" href="/menu"><img src={logoknife} alt='FUD4ME' height='100' width='185'></img></a>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <button class="nav-link basic-nav-link" onClick={navigateMenu}>MENU <span class="sr-only">(current)</span></button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link basic-nav-link" onClick={navigateOrder}>YOUR ORDERS</button>
                    </li>
                    </ul>
                    <button class="nav-link cartlg" onClick={navigateCart}><img src={cartlogo} alt='cart' height='19' width='19'></img>CART</button>
                    <button class='myacc' onClick={() => setPopup(true)}>MY ACCOUNT</button>
                    
                </div>
            </nav>
            <div class='pop'>
            {popup && (
            <ClickAwayListener onClickAway={() => setPopup(false)}>
                    <div className={'popup'}>
                        <img src= {logouser} alt="user" height='70' width='70'></img>
                        {JSON.parse(localStorage.getItem("user")).user.name}
                        <br/>
                        <div className="popup_div"><button onClick={logMeOut} class='logout'>SIGN OUT</button></div>
                    </div>
            </ClickAwayListener>
        )}
        </div>
        </div>
    );
}

export default Navbar        