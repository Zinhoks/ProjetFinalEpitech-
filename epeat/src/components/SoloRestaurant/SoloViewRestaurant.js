import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AddFavorite from "../favorite/addFavorite";
import Review from "../Review/review";
import { idID } from "@mui/material/locale";

import { Helmet } from "react-helmet";

import "./SoloViewRestaurant.css";

const SoloViewRestaurant = () => {
  const [statut, setStatut] = useState([]);
  const [idUser, setIdUser] = useState([]);

  useEffect(() => {
    setStatut(localStorage.getItem("statut"));
    setIdUser(localStorage.getItem("id"));
  }, [statut, idUser]);

  const queryParameters = new URLSearchParams(window.location.search);
  const id = queryParameters.get("id");

  const [dishesRestaurants, setDishesRestaurants] = useState([]);

  const [coordinates, setCoordinates] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const GetInfoAndDishes = async () => {
      const restaurantResponse = await fetch(
        `http://localhost:3002/restaurants/${id}`
      );
      const restaurantData = await restaurantResponse.json();

      const dishesResponse = await fetch(`http://localhost:3002/dishes`);
      const dishesData = await dishesResponse.json();

      const dishesOfCurrentRestaurant = dishesData.filter(
        (dish) =>
          dish.Restaurant_ID === id ||
          (dish.Restaurant_List && dish.Restaurant_List.includes(id))
      );

      const restaurantAndDishes = {
        ...restaurantData,
        dishes: dishesOfCurrentRestaurant,
      };
      setDishesRestaurants(restaurantAndDishes);
    };

    GetInfoAndDishes();
  }, []);

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
    console.log(cartItems);
  }, []);

  //Price

  const itemsPrice = cartItems.reduce((a, c) => a + c.qty * c.Dish_Price, 0);
  const taxPrice = itemsPrice * 0.14;
  const shippingPrice = 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;
  // console.log(totalPrice);

  let address = dishesRestaurants.address;
  useEffect(() => {
    const fetchCoordinatesA = async () => {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${address}&key=${process.env.REACT_APP_API_KEY_GEOCODE}`
      );
      const data = await response.json();
      const geometry = data.results[0].geometry;
      console.log("DATA =>", geometry);
      setCoordinates(geometry);
    };
    if (address !== undefined) {
      fetchCoordinatesA();
    }
  }, [dishesRestaurants]);

  const mapContainer = useRef(null);
  useEffect(() => {
    console.log(coordinates);

    const map = new window.google.maps.Map(mapContainer.current, {
      zoom: 17,
      center: coordinates,
    });

    const marker = new window.google.maps.Marker({
      position: coordinates,
      map: map,
    });
  }, [coordinates]);

  const [averages, setAverages] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3002/restaurant/note")
      .then((response) => response.json())
      .then((data) => {
        let restaurantAverages = [];
        data.forEach((note) => {
          if (note.restaurant_id === dishesRestaurants._id) {
            if (restaurantAverages[note.restaurant_id]) {
              restaurantAverages[note.restaurant_id].sum += note.note;
              restaurantAverages[note.restaurant_id].count++;
            } else {
              restaurantAverages[note.restaurant_id] = {
                sum: note.note,
                count: 1,
              };
            }
          }
        });

        for (let restaurantId in restaurantAverages) {
          restaurantAverages[restaurantId] =
            restaurantAverages[restaurantId].sum /
            restaurantAverages[restaurantId].count;
        }
        setAverages(restaurantAverages);
      })
      .catch((error) => console.error(error));
  }, [dishesRestaurants._id]);

  return (
    <div>

      <Helmet>
        <title>Epeat | SoloViewRestaurant</title>
      </Helmet>

      <Navbar
        restaurant={dishesRestaurants}
        countCartItems={countCartItems}
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        taxPrice={taxPrice}
        totalPrice={totalPrice}
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
      />
      <div className="BackgroundSoloView">
        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Card
            sx={{
              width: "100%",
              p: 0,
              m: 2,
            }}
          >
            <CardActionArea style={{ cursor: "auto" }}>
              <CardMedia
                style={{ marginTop: "5%" }}
                component="img"
                height="400"
                image={`http://localhost:3002/${dishesRestaurants.image}`}
                alt="restaurant"
              />
              <Typography
                style={{ fontFamily: "Bukhari Script" }}
                gutterBottom
                variant="h5"
                component="div"
              >
                {dishesRestaurants.name}
                <div
                  style={{
                    float: "right",
                    display: "flex",
                    marginTop: "5%",
                    marginRight: "5%",
                  }}
                >
                  {idUser && (
                    <AddFavorite
                      style={{ cursor: "pointer" }}
                      user_id={localStorage.getItem("id")}
                      id={id}
                      restname={dishesRestaurants.name}
                    />
                  )}{" "}
                  {""}
                  {idUser && (
                    <Review
                      user_id={localStorage.getItem("id")}
                      id={id}
                      restname={dishesRestaurants.name}
                    />
                  )}{" "}
                  {""}
                </div>
              </Typography>

              <Typography
                gutterBottom
                variant="h5"
                component="div"
                style={{
                  fontFamily: "Fredoka One",
                  marginLeft: "auto",
                  marginTop: "5",
                }}
              >
                {dishesRestaurants.address}{" "}
              </Typography>

              <Typography variant="h6" color="text.secondary">
                Notes :{" "}
                {Math.round(averages[dishesRestaurants._id] * 100) / 100}
                /10 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {dishesRestaurants.category}
              </Typography>

              <CardContent>
                <Typography variant="body2" color="text.secondary"></Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>

        <Box
          sx={{
            maxWidth: 1400,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <Card
            sx={{
              width: "50%",
              p: 0,
              m: 2,
            }}
          >
            {dishesRestaurants &&
              dishesRestaurants.dishes &&
              dishesRestaurants.dishes.map((dish) => (
                <Card
                  sx={{
                    width: "100%",
                    p: 0,
                    m: 0,
                  }}
                  key={dish._id}
                >
                  <CardActionArea>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="div"
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {dish.Dish_Name}&nbsp;&nbsp;{dish.Dish_Price}€{" "}
                      <AddShoppingCartIcon
                        style={{ marginLeft: "auto", marginTop: "5" }}
                        onClick={() =>
                          onAdd({
                            id: dish._id,
                            Dish_Name: dish.Dish_Name,
                            Dish_Price: dish.Dish_Price,
                            Restaurant_ID: dish.Restaurant_ID,
                          })
                        }
                      ></AddShoppingCartIcon>
                    </Typography>
                  </CardActionArea>
                </Card>
              ))}
          </Card>
          <Card
            sx={{
              width: "50%",
              p: 0,
              m: 1,
            }}
            ref={mapContainer}
            style={{ width: "40%", height: "500px" }}
          ></Card>
        </Box>
      </div>
    </div>
  );
};

export default SoloViewRestaurant;
