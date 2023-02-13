import React, { useEffect, useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { TextField, Button, Card, Box } from "@mui/material";
import Navbar from "../Navbar/Navbar";
import { useNavigate } from "react-router-dom"
import CardMedia from "@mui/material/CardMedia";
import './card.css'
import { width } from "@mui/system";

import { Helmet } from 'react-helmet';



const CheckoutForm = (props) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");

  const [TotalPrice, setTotalPrice] = useState([]);
  const [Iduser, setIduser] = useState([]);
  const [DishName, setDishName] = useState([]);

  useEffect(() => {
    setTotalPrice(localStorage.getItem("Total"));
    setIduser(localStorage.getItem("id"));
    setDishName(localStorage.getItem("cartItems"));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    if (!error) {
      console.log("Token", paymentMethod);
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:3001/stripe", {
          amount: { TotalPrice: TotalPrice * 100 },
          id: id,
          iduser: Iduser,
          name: name,
          nickname: nickname,
          dishinfo: DishName,
        });
        if (response.data.success) console.log("Payment réussi");
        navigate('/Success')
      } catch (error) {
        console.log("Erreur", error);
      }
    } else {
      console.log(error.message);
    }
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

  const removecartitem = () => {
    localStorage.removeItem('cartItems');
  }

  return (
    <div >

<Helmet>
        <title>Epeat | Payment</title>
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
      <div className="Containertest">
    <Box 
    
      sx={{
        maxWidth: 1500,
        mx: "auto",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        
      }}
    >
      
      <Card

        style={{ 
          maxWidth: '50%', 
        position: 'absolute', 
        right: '25%', 
        top: '50%', 
        transform: 'translate(50%, -50%)',
        backgroundColor: "rgba(255,255,255,0.5)", 
    backdropFilter: "blur(10px)", 
    height: '93%',
    


      }}

        sx={{
          width: '90%',
          p: 2,
          m: 2
          
        }}
        image={require("../../img/backstripe.jpg")}

      >
        <CardMedia
                component="img"
                image={require("../../components/Navbar/LogoSTT.png")}
                alt="logo"
                style={{ marginTop:'10%',height:"75", width:'65%'

              }}
              />
        
        <form
        
        style={{          marginTop:'10%',
}} onSubmit={handleSubmit}>
          <TextField
            sx={{

              width: '80%',
              margin: '25px auto'
            }}
            name="name"
            label="Name of credit card holder
            "
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            sx={{
              width: '80%',
              margin: '25px auto'
            }}
            name="nickname"
            label="First name of credit card holder
            "
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
          />
          <CardElement
            options={{
              hidePostalCode: true,
            }}
          />
          <Button
          onClick={removecartitem}
            sx={{
              width: '80%',
              margin: '25px auto'
            }}
            type="submit"
          >
            Payer {TotalPrice}€
          </Button>
        </form>
      </Card>
    </Box>
    </div>
    </div>
  );
};

export default CheckoutForm;
