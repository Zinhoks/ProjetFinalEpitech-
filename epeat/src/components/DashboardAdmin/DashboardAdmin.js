import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import { Link } from "react-router-dom";

import "./dashboardadmin.css";
import Chartjs from "../Chart/NumberOrderOfRestaurant.js";
import TopUsersOrder from "../Chart/TopUsersOrder";
import Divider from "@mui/material/Divider";
import TopAndWorstRestaurants from "../Chart/TopAndWorstRestaurants";

import { Helmet } from 'react-helmet';


const DashboardAdmin = () => {
  const [cartItems, setCartItems] = useState([]);

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.Dish_Price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const onAdd = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist) {
      const newCartItems = cartItems.map((x) =>
        x.id === product.id ? { ...x, qty: x.qty + 1 } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems = [...cartItems, { ...product, qty: 1 }];
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  };
  const onRemove = (product) => {
    const exist = cartItems.find((x) => x.id === product.id);
    if (exist.qty === 1) {
      const newCartItems = cartItems.filter((x) => x.id !== product.id);
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    } else {
      const newCartItems = cartItems.map((x) =>
        x.id === product.id ? { ...exist, qty: exist.qty - 1 } : x
      );
      setCartItems(newCartItems);
      localStorage.setItem("cartItems", JSON.stringify(newCartItems));
    }
  };

  let countCartItems = cartItems.length;

  useEffect(() => {
    setCartItems(
      localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : []
    );
    // console.log(cartItems);
  }, []);

  return (
    <div>
<Helmet>
        <title>Epeat | Admin</title>
      </Helmet>
      <Navbar
        countCartItems={countCartItems}
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        taxPrice={taxPrice}
        totalPrice={totalPrice}
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
      />
      <div className="Backgroundstat">
        <div
          style={{
            fontFamily: "Bukhari Script",
            marginTop: 100,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "Bukhari Script",
            }}
          >
            Dashboard Admin
          </h1>
        </div>
        
        <Divider />
        <div
          style={{
            marginTop: 0,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          className="graph-container"
        >
          <Chartjs />

          <TopUsersOrder />
          <TopAndWorstRestaurants />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 70,
          }}
          className="containerbutton"
        >
          <Link to="/admin/users">
            <a className="btn btn-5">CRUD USER</a>
          </Link>
          <Link to="/crudrestaurants">
            <a className="btn btn-2">CRUD RESTAURANT</a>
          </Link>
          <Link to="/dish-crud">
            <a className="btn btn-3">CRUD DISHES</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
