import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

import DeleteFavorite from "../favorite/deleteFavorite";

import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { ListItem } from "@mui/material";

import { Helmet } from 'react-helmet';


const UserProfile = () => {
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
    navigate(`/profile/user/edit?id=${id}`);
  };
  const navigateToHistory = () => {
    navigate(`/profile/user/history?id=${id}`);
  };
  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");
  const [userData, setUserData] = useState([]);
  const [favorite, setFavorite] = useState([]);


  const fetchData = async () => {
    const config = {
      method: "GET",
      url: `http://localhost:3002/profile/user/${id}`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        setUserData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchData();
    async function getFavoriteList() {
      try {
        const res = await axios.get("http://localhost:3002/profile/favorite");
        setFavorite(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    getFavoriteList();
    console.log(favorite);
  }, []);
  const [cartItems, setCartItems] = useState([]);

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.Dish_Price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  let countCartItems = cartItems.length;

  useEffect(() => {
    setCartItems(
      localStorage.getItem("cartItems")
        ? JSON.parse(localStorage.getItem("cartItems"))
        : []
    );
    console.log(cartItems);
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
      />
<Helmet>
        <title>Epeat | My Profile</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          height: "800px",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 150,
        }}
      >
        <div
          style={{
            display: "flex",
            height: "90%",
            width: "auto",
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
                  height: "50vh",
                }}
              >
                <ListSubheader
                  style={{
                    fontSize: "70px",
                    fontFamily: "Bukhari Script",
                    textAlign: "center",
                    marginBottom: 45,
                    marginTop: "15%"
                  }}
                >
                  User Profile
                </ListSubheader>
                <div
                  style={{
                    backgroundColor: "#f2f2f2",
                    borderRadius: 5,

                  }}
                >
                  <ListItem
                    style={{
                      marginTop: "20px",
                      fontSize: "30px",
                      
                    }}
                  >
                    <span style={{ fontFamily: "Bukhari Script" }}>Username &nbsp;</span> :&nbsp; {userData.username}
                  </ListItem>
                  <ListItem><span style={{ fontFamily: "Bukhari Script" }}>Email &nbsp;</span> : &nbsp; {userData.email}</ListItem>
                  <ListItem>
                    <span style={{ fontFamily: "Bukhari Script" }}>Registered addresses &nbsp;</span>: &nbsp; {userData.address}
                  </ListItem>
                  <ListItem>
                  <span style={{ fontFamily: "Bukhari Script" }}>My favorites &nbsp;</span>: &nbsp;
                    <div className={favorite.Restaurant_Name}>
                      {favorite.filter((favorite) => favorite.userID === id)
                        .length
                        ? favorite
                            .filter((favorite) => favorite.userID === id)
                            .map((fav) => (
                              <div key={fav._id}>
                                <nav>
                                  <ul style={{ display: "inline-flex" }}>
                                    <li>{fav.Restaurant_Name}</li>
                                    <DeleteFavorite favID={fav} /> {""}
                                  </ul>
                                </nav>
                              </div>
                            ))
                        : "You have no favorite restaurants yet"}
                    </div>
                  </ListItem>
                  <Button
                    onClick={navigateToHistory}
                    variant="contained"
                    style={{
                      backgroundColor: "#82DEE4",
                      width: "50%",
                      display: "flex",
                      margin: "5% auto",
                      
                    }}
                  >
                    Order History
                  </Button>
                  <Button
                    onClick={navigateToProfile}
                    variant="contained"
                    style={{
                      backgroundColor: "#82DEE4",
                      width: "50%",
                      display: "flex",
                      margin: "5% auto",
                    }}
                  >
                    Modify my profile
                  </Button>
                </div>
              </List>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
