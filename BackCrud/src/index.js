const express = require("express"),
  bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
const mongoose = require("mongoose");
const cors = require("cors");

const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest:'images' });
app.use('/images', express.static('images'));

app.use(cors());
app.use(bodyParser.json());
app.use("/restaurants", require("./routes/restaurants"));

// app.use(express.json());
app.use(express.json({ limit: "100mb", extended: true }));
app.use(express.urlencoded({ limit: "100mb", extended: true, parameterLimit:50000 }));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ep'Eat API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3002/",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
  })
);

//CRUD restaurants

const { Restaurant } = require("./models/restaurant");

app.get("/restaurants", async (req, res) => {
  const allRestaurants = await Restaurant.find();
  return res.status(200).json(allRestaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  return res.status(200).json(restaurant);
});

app.post("/restaurants", async (req, res) => {
  const newRestaurant = new Restaurant({ ...req.body });
  const insertedRestaurant = await newRestaurant.save();
  return res.status(201).json(insertedRestaurant);
});

app.put("/restaurants/:_id", async (req, res) => {
  const { _id } = req.params;
  await Restaurant.updateOne({ _id }, req.body);
  const updatedRestaurant = await Restaurant.findById(_id);
  return res.status(200).json(updatedRestaurant);
});

app.delete("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
  return res.status(200).json(deletedRestaurant);
});

app.post('/restaurants/images', upload.single('image'), (req, res) => {
  const imageName = req.file.filename;
  const imagePath = req.file.path
  console.log(req.file)
  console.log("imagePath", imagePath)
  res.send({ imagePath })
})

app.put('/restaurants/images', upload.single('image'), (req, res) => {
  const imageName = req.file.filename;
  const imagePath = req.file.path
  console.log("PUT",req.file)
  console.log("imagePath", imagePath)
  res.send({ imagePath })
})

//CRUD Users Admin

const { Users } = require("./models/users");
// app.use('/admin/users', routes)

app.get("/admin/users", async (req, res) => {
  const allUsers = await Users.find();
  return res.status(200).json(allUsers);
});

app.get("/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  return res.status(200).json(user);
});

app.post("/admin/users", async (req, res) => {
  const data = new Users({ ...req.body });
  try {
    const createUser = await data.save();
    res.status(201).json(createUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put("/admin/users/:_id", async (req, res) => {
  const { _id } = req.params;
  await Users.updateOne({ _id }, req.body);
  const updateUser = await Users.findById(_id);
  return res.status(200).json(updateUser);
});

app.delete("/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const deleteUser = await Users.findByIdAndDelete(id);
  return res.status(200).json(deleteUser);
});

//CRUD User Profile

app.get("/profile/user/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id)
  const user = await Users.findById(id);
  return res.status(200).json(user);
});

app.put("/profile/user/edit/:id", async (req, res) => {
  const { id } = req.params;
  await Users.updateOne({ _id: id }, {...req.body});
  const updateUser = await Users.findById(id);
  return res.status(200).json(updateUser);
});

//CRUD Order history
const { Commandes } = require("./models/commandes");

app.get("/orders", async (req, res) => {
  const allCommandes = await Commandes.find();
  return res.status(200).json(allCommandes);
});

app.get("/profile/user/history/:_id", async (req, res) => {
  const { _id } = req.params;
  const commande = await Commandes.findById(_id);
  return res.status(200).json(commande);
});

// CRUD Dishes

const { Dish } = require("./models/dishes");

app.get("/dishes", async (req, res) => {
  const allDishes = await Dish.find();
  return res.status(200).json(allDishes);
});

app.get("/dishes/:id", async (req, res) => {
  const { id } = req.params;
  const dish = await Dish.findById(id);
  return res.status(200).json(dish);
});

app.post("/dishes", async (req, res) => {
  const newDish = new Dish({ ...req.body });
  const insertedDish = await newDish.save();
  return res.status(201).json(insertedDish);
});

app.put("/dishes/:_id", async (req, res) => {
  const { _id } = req.params;
  await Dish.updateOne({ _id }, req.body);
  const updatedDish = await Dish.findById(_id);
  return res.status(200).json(updatedDish);
});

app.delete("/dishes/:id", async (req, res) => {
  const { id } = req.params;
  const deletedDish = await Dish.findByIdAndDelete(id);
  return res.status(200).json(deletedDish);
});

const { Favorite } = require("./models/favorite");

app.get("/profile/favorite", async (req, res) => {
  const allFavorites = await Favorite.find();
  return res.status(200).json(allFavorites);
});

app.get("/profile/favorite/:id", async (req, res) => {
  const { id } = req.params;
  const favorite = await Favorite.findById(id);
  return res.status(200).json(favorite);
});

app.post("/profile/favorite", async (req, res) => {
  const newFavorite = new Favorite({ ...req.body });
  const insertedFavorite = await newFavorite.save();
  return res.status(201).json(insertedFavorite);
});

app.delete("/profile/favorite/:id", async (req, res) => {
  const { id } = req.params;
  const deletedFavorite = await Favorite.findByIdAndDelete(id);
  return res.status(200).json(deletedFavorite);
});

const { Note } = require("./models/note");

app.get("/restaurant/note", async (req, res) => {
  const allNotes = await Note.find();
  return res.status(200).json(allNotes);
});

app.get("/restaurant/note/:id", async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);
  return res.status(200).json(note);
});

app.post("/restaurant/note", async (req, res) => {
  const newNote = new Note({ ...req.body });
  const insertedNote = await newNote.save();
  return res.status(201).json(insertedNote);
});

app.put("/restaurant/note/:_id", async (req, res) => {
  const { _id } = req.params;
  await Note.updateOne({ _id }, req.body);
  const updatedNote = await Note.findById(_id);
  return res.status(200).json(updatedNote);
});

app.delete("/restaurant/note/:id", async (req, res) => {
  const { id } = req.params;
  const deletedNote = await Note.findByIdAndDelete(id);
  return res.status(200).json(deletedNote);
});

app.post("/coordinate", async (req, res) => {
  if (req.body === []) {
    return res.status(404).send("no data");
  }
  const coordinateA = req.body.coordinatesA;
  const coordinatesB = req.body.coordinatesB;
  const API_KEY = process.env.API_KEY_GOOGLE;

  try {
    const newDistances = [];
    for (let i = 0; i < coordinatesB.length; i++) {
      const coordinateB = coordinatesB[i];
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${coordinateA.lat},${coordinateA.lng}&destinations=${coordinateB.coordinates.lat},${coordinateB.coordinates.lng}&key=${API_KEY}`
      );
      const data = await response.json();
      newDistances.push(data);
      // console.log(newDistances)
    }
    res.send(newDistances);
  } catch (error) {
    console.log(error);
  }
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://admin:admin@clusterilyes.teutkqo.mongodb.net/Epeat?retryWrites=true&w=majority"
    );
    app.listen(3002, () => console.log("Server started on port 3002"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

module.exports = app;
