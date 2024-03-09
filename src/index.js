import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Menu from './components/Menu';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './components/Login';
import Yourorder from './components/Yourorder';
import Cart from './components/Cart';
import Pay from './components/Pay';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" index element={<Login />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/yourorder" element={<Yourorder />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/pay" element={<Pay />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
