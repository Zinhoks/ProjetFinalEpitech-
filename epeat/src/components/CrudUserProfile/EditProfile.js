import { useState, useEffect } from "react";
import axios from "axios";
import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { TextField, Button } from "@mui/material";
import { Routes, Route, useNavigate, json } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const EditProfile = () => {
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
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
 
  const fetchData = async () => {
    try {
      const data = await axios.get(`http://localhost:3002/profile/user/${id}`);
      setUserData(data.data);
      console.log("fetct data", data.data)
    }
     catch (err) {
      console.error(err);
    }    
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleEditChange = (e) => {
    if (
      !e.target.value ||
      e.target.value === ""
    ) {
      // console.log("NO EVENT");
      setUserData({
        ...userData,
        [e.target.name]: setUserData.value,
      });
    } else {
      // console.log("THERE IS EVENT");
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      });
    }
  };

  async function updateUser(id) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    };
    const response = await fetch(
      `http://localhost:3002/profile/user/edit/${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log("fetch PUT",data);

    console.log("data");

    window.location.reload();
  }

  const handleEditClick = (e) => {
    handleEditChange(e);
    updateUser(id);    
  }

  // const handleChange = (e) => {
  //   setUserData({ ...user, [e.target.name]: e.target.value });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(userData);
    setUserData(userData);
    
  };

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
          marginTop: "10%",
        }}
      >
        <Button
          onClick={navigateToProfile}
          variant="contained"
          style={{ backgroundColor: "#82DEE4" }}
        >
          Back to my profile
        </Button>
        <div style={{ display: "flex", height: "90%", width: "60%" }}>
          <div style={{ flexGrow: 1 }}>
            <ThemeProvider theme={theme}>
              <div
                
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  fontSize: "20px",
                }}
              >                
                <Typography id="outlined-basic" variant="h6" component="h2">
                  <span style={{ fontFamily: "Bukhari Script" }}>Update your profile</span>
                </Typography>
                <Typography id="outlined-basic" variant="h6" component="h2">
                  Username
                </Typography>
                <TextField
                  id="outlined-basic"
                  name="username"
                  variant="outlined"
                  value={userData.username}
                  // defaultValue={user.username}
                  onChange={(e) => handleEditChange(e)}
                />
                <Typography id="outlined-basic" variant="h6" component="h2">
                  Email
                </Typography>
                <TextField               
                  id="outlined-basic"
                  name="email"
                  variant="outlined"
                  defaultValue={userData.email}
                  onChange={(e) => handleEditChange(e)}
                />

                <Button variant="outlined" onClick={handleEditClick}>
                  Submit
                </Button>
              </div>
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
