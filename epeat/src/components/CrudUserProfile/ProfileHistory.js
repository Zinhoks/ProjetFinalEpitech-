import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { TextField, Button } from "@mui/material";
import { Routes, Route, useNavigate, json } from "react-router-dom";
import Moment from "react-moment";
import Navbar from "../Navbar/Navbar";

const UserHistory = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#ff1f1f",
      },
      secondary: {
        main: "#4fc2c7",
      },
    },
  });

  const navigate = useNavigate();
  const navigateToProfile = () => {
    navigate(`/profile/user?id=${id}`);
  };
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const [userData, setUserData] = useState([]);
  const [userOrder, setUserOrder] = useState([]);

  useEffect(() => {
    const getUserHistory = async () => {
      const userResponse = await fetch(
        `http://localhost:3002/profile/user/${id}`
      );
      const userData = await userResponse.json();

      const ordersResponse = await fetch(`http://localhost:3002/orders`);
      const ordersData = await ordersResponse.json();

      const orderOfCurrentUser = ordersData.filter(
        (order) => order.idUser === id
      );
      const orderByUser = {
        ...userData,
        order: orderOfCurrentUser,
      };

      setUserOrder(orderByUser.order);
    };
    getUserHistory();
  }, []);

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

      <div
        style={{
          display: "flex",
          height: "800px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "90%",
            width: "90%",
            fontSize: "20px",
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
              <List
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Button
                  onClick={navigateToProfile}
                  variant="contained"
                  style={{
                    backgroundColor: "#82DEE4",
                    width: "50%",
                    marginBottom: "5%",
                  }}
                >
                  Back to my profile
                </Button>
                <ListSubheader style={{ fontSize: "30px" }}>
                  My order history
                </ListSubheader>
                <ListItemText style={{ marginTop: "30px" }}>
                  {userOrder.map((order, index) => {
                    console.log("Order", order);
                    const NewDate = order.createdAt;

                    return (
                      <div key={index}>
                        <div
                          style={{
                            textTransform: "uppercase",
                            fontSize: "20px",
                            marginTop: "50px",
                            fontFamily: "Bukhari Script, Arial",
                          }}
                        >
                          Order {index + 1}
                        </div>
                        <hr />
                        Command order: {order._id}
                        <br />
                        Description: {order.description}
                        <br />
                        Order date:{" "}
                        <Moment format="YYYY/MM/DD HH:mm">{NewDate}</Moment>
                        <br />
                        Amount: {parseInt(order.amount) / 100} /{" "}
                        {order.currency} <hr />
                        {order.dishinfo.map((info, index) => {
                          console.log("Order", info);
                          return (
                            <div key={index}>
                              <hr />
                              Dish name: {info.Dish_Name}
                              <br />
                              Dish price: {info.Dish_Price} {order.currency}
                              <br />
                              Quantity: {info.qty}
                              <hr />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </ListItemText>
              </List>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserHistory;
