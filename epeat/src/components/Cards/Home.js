import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Divider from "@mui/material/Divider";

import { Helmet } from 'react-helmet';


import "./Home.css";
import LazyLoad from "react-lazyload";
import { convertLength } from "@mui/material/styles/cssUtils";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [coordinatesA, setCoordinatesA] = useState([]);
  const [coordinatesB, setCoordinatesB] = useState([]);

  // Get Coordinate For Départ Position
  const Position = "24 Rue Pasteur, 94270 Le Kremlin-Bicêtre";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3002/restaurants");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCoordinatesA = async () => {
      console.log(process.env.REACT_APP_API_KEY_GEOCODE)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${Position}&key=${process.env.REACT_APP_API_KEY_GEOCODE}`
      );
      const data = await response.json();
      // console.log("A", data)
      const geometry = data.results[0].geometry;
      // console.log(geometry)
      setCoordinatesA(geometry);
    };
    fetchCoordinatesA();
  }, []);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const newCoordinates = await Promise.all(
        restaurants.map(async (restaurant) => {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${restaurant.address}&key=${process.env.REACT_APP_API_KEY_GEOCODE}`
          );
          const data = await response.json();
          // console.log("B", data.results[0].geometry)
          const geometry = data.results[0].geometry;
          // console.log(geometry)
          return { coordinates: geometry };
        })
      );
      setCoordinatesB(newCoordinates);
    };
    fetchCoordinates();
  }, [coordinatesA]);

  useEffect(() => {
    async function fetchData() {
      console.log("A", coordinatesA);
      console.log("B", coordinatesB);

      await fetch("http://localhost:3002/coordinate", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ coordinatesA, coordinatesB }),
      })
        .then((response) => response.json())
        .then((data) => {
          setRestaurants(
            restaurants.map((restaurant, index) => {
              return {
                ...restaurant,
                distance: data[index].rows[0].elements[0].distance.text,
              };
            })
          );
        });
    }
    if (coordinatesA.length !== 0 && coordinatesB.length !== 0) {
      fetchData();
    }
  }, [coordinatesA, coordinatesB]);

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
  const [noResults, setNoResults] = useState(false);

  return (
    <div className="Background">

<Helmet>
        <title>Epeat | Home</title>
      </Helmet>

      <Navbar
        countCartItems={countCartItems}
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        taxPrice={taxPrice}
        totalPrice={totalPrice}
        cartItems={cartItems}
        func={setRestaurants}
        state={setNoResults}
        onAdd={onAdd}
        onRemove={onRemove}
      />
      <div className="Scroll" >
        <Box
          sx={{
            maxWidth: 1500,
            mx: "auto",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div
            className="animation"
            style={{ marginTop: 100, display: "flex" }}
          >
            <div>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("")}
                    component="img"
                    height="75"
                    image={require("../../img/mathieu.png")}
                    alt="Clear Filter"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Clear
                  </Typography>
                </CardActionArea>
              </Card>

              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("Pizza")}
                    component="img"
                    height="75"
                    image={require("../../img/pizza.jpg")}
                    alt="Pizza"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Pizza
                  </Typography>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("")}
                    component="img"
                    height="75"
                    image={require("../../img/mathieu.png")}
                    alt="Clear Filter"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Clear
                  </Typography>
                </CardActionArea>
              </Card>

              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("Kebab")}
                    component="img"
                    height="75"
                    image={require("../../img/kebab.jpg")}
                    alt="Kebab"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Kebab
                  </Typography>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("")}
                    component="img"
                    height="75"
                    image={require("../../img/mathieu.png")}
                    alt="Clear Filter"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Clear
                  </Typography>
                </CardActionArea>
              </Card>

              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("Pâte")}
                    component="img"
                    height="75"
                    image={require("../../img/pate.jpg")}
                    alt="Pâte"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Pâte
                  </Typography>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("")}
                    component="img"
                    height="75"
                    image={require("../../img/mathieu.png")}
                    alt="Clear Filter"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Clear
                  </Typography>
                </CardActionArea>
              </Card>

              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("Sushi")}
                    component="img"
                    height="75"
                    image={require("../../img/sushi.jpg")}
                    alt="Sushi"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Sushi
                  </Typography>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("")}
                    component="img"
                    height="75"
                    image={require("../../img/mathieu.png")}
                    alt="Clear Filter"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Clear
                  </Typography>
                </CardActionArea>
              </Card>
              <Card
                sx={{
                  width: 100,
                  p: 1,
                  m: 2,
                }}
              >
                <CardActionArea>
                  <CardMedia
                    onClick={() => setSearchCategory("Burger")}
                    component="img"
                    height="75"
                    image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8XwC4XGPiZvBB6pXjr-vB6Avq5ipr3HxJKQ&usqp=CAU"
                    alt="Burger"
                  />
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    Burger
                  </Typography>
                </CardActionArea>
              </Card>
            </div>
          </div>
        </Box>
        <Divider />
        {noResults ? (

          <div className="GOD">
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
                  width: 300,
                  p: 1,
                  m: 2,
                  marginLeft:'40%'
                          }}
              >
                <CardActionArea>
                  <Typography
                    style={{ fontFamily: "Bukhari Script" }}
                    gutterBottom
                    variant="h5"
                    component="div"
                  ></Typography>
                  <CardMedia
                    component="img"
                    height="250"
                    image={require("../../img/mathieu.png")}
                    loading="lazy"
                  />

                  <CardContent>
                    <Typography
                      style={{ fontFamily: "Bukhari Script" }}
                      variant="body2"
                      color="text.secondary"
                    >
                      No result found !
                    </Typography>

                    <Typography
                      style={{ fontFamily: "Fredoka One" }}
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    ></Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          </div>

        ) : (
          <Box
            sx={{
              maxWidth: 1400,
              mx: "auto",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {restaurants
              .filter(
                (restaurant) =>
                  !searchCategory || restaurant.category === searchCategory
              )
              .map((restaurant, index) => (

                <div className="Card">
                  <Card
                    key={index}
                    sx={{
                      width: 300,
                      p: 1,
                      m: 2,
                    }}
                  >
                    <div className="restaurant-list">
                      <CardActionArea>
                        <Typography
                          style={{ fontFamily: "Bukhari Script" }}
                          gutterBottom
                          variant="h5"
                          component="div"
                        >
                          {restaurant.name}
                        </Typography>
                        <Link to={"/restaurant/?id=" + restaurant._id}>
                          {/* <CardMedia
                        component="img"
                        height="250"
                        image={restaurant.image}
                        alt={restaurant.name}
                        loading="lazy"
                      /> */}
                          {/* <LazyLoad> */}
                          <img
                            src={`http://localhost:3002/${restaurant.image}`}
                            alt={restaurant.name}
                            width={300}
                            height={250}
                            style={{ objectFit: "cover" }}
                          />
                          {/* <img src={restaurant.image} alt={restaurant.name} height={250} width={300} /> */}
                          {/* </LazyLoad> */}
                        </Link>
                        <CardContent>
                          <Typography
                            style={{ fontFamily: "Bukhari Script" }}
                            variant="body2"
                            color="text.secondary"
                          >
                            {restaurant.category} {restaurant.distance}
                          </Typography>

                          <Typography
                            style={{ fontFamily: "Fredoka One" }}
                            variant="body2"
                            color="text.secondary"
                          >
                            {restaurant.address}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          ></Typography>
                        </CardContent>
                      </CardActionArea>
                    </div>
                  </Card>
                </div>
              ))}
          </Box>
        )}
      </div>
    </div>
  );
}
