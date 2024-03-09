import React, { useState, useEffect } from "react"
import './Login.css'
import logoknife from '../assets/knife100.png'
import loginlogo from '../assets/loginlogo.svg'
import loadinglogo from '../assets/Process.gif'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('fcm') || (localStorage.getItem('fcm') && localStorage.getItem('fcm') == null)) {
      var uniq = 'fcm_id' + (new Date()).getTime();
      localStorage.setItem('fcm', uniq, 1000);
    }

    if (localStorage.getItem('user') && localStorage.getItem('user') != null) {
      navigate("/menu", { replace: true });
    }

    if (localStorage.getItem('temp_user') && localStorage.getItem('temp_user') != null) {
      setlogin_state(false)
      setpreferance(true)
    }

    navigator.geolocation.getCurrentPosition((position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
    }, () => { });
  });

  const [mobile, setmobile] = useState('')
  const [otp, setotp] = useState('')
  const [name, setname] = useState('')
  const [age, setage] = useState('')
  const [gender, setgender] = useState('')
  const [fav_food_type, setfav_food_type] = useState('')
  const [fav_food_content, setfav_food_content] = useState('')
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [login_state, setlogin_state] = useState(true)
  const [loading_state, setloading_state] = useState(false)
  const [preferance, setpreferance] = useState(false)

  async function logindetails(e) {
    setloading_state(true)
    e.preventDefault();
    let _data = {
      phone: mobile,
      type: "user"
    }

    await fetch('https://api.fud4.me/auth/v1/login', {
      method: "POST",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
      mode: 'cors'
    })
      .then(response => {
        var data = response.json()
        return data
      }
      )
      .then((data) => {
        if (data.response_code != 200) {
          toast(data.message, {
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
          setlogin_state(true)
          setloading_state(false)
        } else {
          toast(data.message, {
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
          setlogin_state(false)
          setloading_state(false)
        }
      })
      .catch(err => {
        console.log(err);
        setlogin_state(true)
        setloading_state(false)
      });
  }
  async function preferancesubmit(e) {
    setloading_state(true)
    e.preventDefault();
    let _data = {
      name: name,
      age: parseInt(age),
      gender: gender,
      fav_food_type: fav_food_type,
      fav_food_content: fav_food_content,
      lat: lat,
      lon: lng
    }

    await fetch('https://api.fud4.me/user/v1/user/profile/complete/1/', {
      method: "POST",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8", "authorization" : "Bearer "+JSON.parse(localStorage.getItem("temp_user")).accessToken },
      mode: 'cors'
    })
      .then(response => {
        var data = response.json()
        return data
      }
      )
      .then((data) => {
        if (data.response_code == 401 || data.response_code == 403 || data.response_code == 404) {
          toast(data.message, {
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
          setpreferance(false)
          setloading_state(false)
          setlogin_state(true)
          localStorage.removeItem("user");
          localStorage.removeItem("temp_user");
        }else if (data.response_code != 200) {
          toast(data.message, {
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
          setpreferance(true)
          setloading_state(false)
        } else {
          let temp_data_user = JSON.parse(localStorage.getItem("temp_user"))
          temp_data_user.user = data.response.user
          localStorage.setItem("user", JSON.stringify(temp_data_user));
          localStorage.removeItem("temp_user");
          toast(data.message, {
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
          setpreferance(false)
          setloading_state(false)
        }
      })
      .catch(err => {
        console.log(err);
        setlogin_state(true)
        setloading_state(false)
      });
  }
  async function validatedetails(e) {
    setloading_state(true)
    e.preventDefault();
    let _data = {
      phone: mobile,
      otp: otp,
      device: {
        fcm: localStorage.getItem('fcm')
      }
    }

    await fetch('https://api.fud4.me/auth/v1/validate/otp', {
      method: "POST",
      body: JSON.stringify(_data),
      headers: { "Content-type": "application/json; charset=UTF-8" },
      mode: 'cors'
    })
      .then(response => {
        console.log(response)
        var data = response.json()
        return data
      }
      )
      .then((data) => {
        if (data.response_code != 200) {
          toast(data.message, {
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
          setlogin_state(true)
          setloading_state(false)
        } else {
          toast(data.message, {
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
          if (data.response.user.profile_completion != 0) {
            localStorage.setItem("user", JSON.stringify(data.response));
            setlogin_state(false)
            setloading_state(false)
            navigate("/menu", { replace: true });
          } else {
            localStorage.setItem("temp_user", JSON.stringify(data.response));
            setlogin_state(false)
            setpreferance(true)
            setloading_state(false)
          }
        }
      })
      .catch(err => {
        console.log(err);
        setlogin_state(true)
        setloading_state(false)
      });
  }

  if (loading_state) {
    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        </head>
        <ToastContainer />
        {/* { Title - FUD4ME } */}
        <div className="login">
          <div className="title">
            <div className="knifelogo" > <img src={logoknife} alt="Logo-knife"></img></div>
          </div>

          {/* LOGIN CARD */}
          <div className="card-new">
            <div className="card-body-new">
              <div className="loadinglogo">
                <img src={loadinglogo} alt="Loading-Logo" height="300" width="300"></img>
              </div>
            </div>
          </div>
          <div className="loginlogo">
            <img src={loginlogo} alt="Login-Logo" height="406" width="492"></img>
          </div>
        </div>
      </html>


    );
  } else if (login_state) {
    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        </head>
        <ToastContainer />
        {/* { Title - FUD4ME } */}
        <div className="login">
          <div className="title">
            <div className="knifelogo" > <img src={logoknife} alt="Logo-knife"></img></div>
          </div>

          {/* LOGIN CARD */}
          <div className="card">
            <div className="card-body">
              <br />
              <h1>LOGIN</h1>
              <br />
              <form onSubmit={logindetails} className="login-form">
                <div className="container">
                  <label for="Mobile">Mobile Number</label><br />
                  <input type="text" pattern="^[0-9]{10}$" maxLength="10" minLength="10" placeholder="Mobile Number" name="Mobile" id="Mobile" onChange={(e) => setmobile(e.target.value)} required></input><br />
                  <button type="submit" className="btn">GENERATE OTP</button>
                </div>
              </form>
            </div>
          </div>
          <div className="loginlogo">
            <img src={loginlogo} alt="Login-Logo" height="406" width="492"></img>
          </div>
        </div>
      </html>


    );
  } else if (preferance) {
    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        </head>
        <ToastContainer />
        {/* { Title - FUD4ME } */}
        <div className="login">
          <div className="title">
            <div className="knifelogo" > <img src={logoknife} alt="Logo-knife"></img></div>
          </div>

          {/* LOGIN CARD */}
          <div className="card-new">
            <div className="card-body-new">
              <br />
              <h1>PREFERENCES</h1>
              <br />
              <form onSubmit={preferancesubmit} className="login-form">
                <div className="container">
                  <label for="Preferances">NAME</label><br />
                  <input type="text" placeholder="Name" name="Name" id="Mobile" onChange={(e) => setname(e.target.value)} required></input><br />
                  <br />
                  <label for="Preferances">AGE</label><br />
                  <input type="text" pattern="^[0-9]{2}$" maxLength="2" minLength="2" placeholder="AGE" name="Age" id="Mobile" onChange={(e) => setage(e.target.value)} required></input><br />
                  <br />
                  <label for="Preferances">GENDER : </label><br />
                  <select name="gender" id="DropdownList" onChange={(e) => setgender(e.target.value)} required>
                    <option value="">SELECT GENDER</option>
                    <option value="male">MALE</option>
                    <option value="female">FEMALE</option>
                  </select>
                  <br /><label id="PreferancesDrop">Favourite Food Type : </label><br />
                  <select name="fav_food_type" id="DropdownList" onChange={(e) => setfav_food_type(e.target.value)} required>
                    <option value="">SELECT VALUE</option>
                    <option value="indian">INDIAN</option>
                    <option value="chinese">CHINESE</option>
                    <option value="arabic">ARABIC</option>
                  </select>
                  <br /><label id="PreferancesDrop">Favourite Food Content : </label><br />
                  <select name="fav_food_content" id="DropdownList" onChange={(e) => setfav_food_content(e.target.value)} required>
                    <option value="">SELECT VALUE</option>
                    <option value="rice">RICE</option>
                    <option value="non-rice">NON - RICE</option>
                  </select>
                  <button type="submit" className="btn">OK</button>
                </div>
              </form>
            </div>
          </div>
          <div className="loginlogo">
            <img src={loginlogo} alt="Login-Logo" height="406" width="492"></img>
          </div>
        </div>
      </html>


    );
  } else {
    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></link>
          <link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'></link>
        </head>
        <ToastContainer />
        {/* { Title - FUD4ME } */}
        <div className="login">
          <div className="title">
            <div className="knifelogo" > <img src={logoknife} alt="Logo-knife"></img></div>
          </div>

          {/* LOGIN CARD */}
          <div className="card">
            <div className="card-body">
              <br />
              <h1>Login</h1>
              <br />
              <form onSubmit={validatedetails} className="login-form">
                <div className="container">
                  <label for="OTP">OTP Validate</label><br />
                  <input value={otp} type="text" pattern="^[0-9]{6}$" maxLength="6" minLength="6" placeholder="OTP" name="OTP" id="Mobile" onChange={(e) => setotp(e.target.value)} required></input><br />
                  <button type="submit" className="btn">Login</button>
                </div>
              </form>
            </div>
          </div>
          <div className="loginlogo">
            <img src={loginlogo} alt="Login-Logo" height="406" width="492"></img>
          </div>
        </div>
      </html>


    );
  }

}
export default Login