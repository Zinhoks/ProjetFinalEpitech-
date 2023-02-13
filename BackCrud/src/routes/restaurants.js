const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const { Restaurant } = require("../models/restaurant");

/**
 * @swagger
 * components:
 *    schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the restaurant
 *         name:
 *           type: string
 *           description: Restaurant's name
 *         address:
 *           type: string
 *           description: Restaurant's address
 *         category:
 *           type: string
 *           description: Restaurant's category
 *         image:
 *           type: string
 *           description: Restaurant's image
 *       example:
 *         _id: 63d0fa07e7ad16c611e2b531
 *         name: Pizza House
 *         address: 153 Av. d'Italie, 75013 Paris
 *         category: Pizza
 *         image: image_path
 */

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Manage Restaurants featuring on the application
 * /restaurants:
 *   get:
 *     summary: Lists all the restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: The list of all the restaurants
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 *   post:
 *     summary: Creates a new restaurant
 *     tags: [Restaurants]
 *     parameters:
 *      - in: body
 *        name: name
 *        schema:
 *        type: string
 *        required: true
 *        description: the restaurant's name
 *      - in: body
 *        name: address
 *        schema:
 *        type: string
 *        required: true
 *        description: the restaurant's address
 *      - in: body
 *        name: category
 *        schema:
 *        type: string
 *        required: true
 *        description: the restaurant's category
 *      - in: body
 *        name: image
 *        schema:
 *        type: string
 *        required: false
 *        description: the restaurant's image
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *              address:
 *                  type: string
 *              category:
 *                  type: string
 *              image:
 *                  type: string
 *       example:
 *          name: Pizza Palace
 *          address: 153 Av. d'Italie, 75013 Paris
 *          category: Pizza
 *          image: image_path
 *     responses:
 *       201:
 *         description: Restaurant successfully created
 *       500:
 *         description: Some server error
 * /restaurants/{_id}:
 *   get:
 *     summary: Get a restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *     responses:
 *       200:
 *         description: The restaurant response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: The restaurant was not found
 *   put:
 *     summary: Updates restaurant by the id
 *     tags: [Restaurants]
 *     parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *        type: string
 *        required: true
 *        description: the restaurant id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              name:
 *                  type: string
 *              address:
 *                  type: string
 *              category:
 *                  type: string
 *       example:
 *          name: Pizza Palace
 *          address: 153 Av. d'Italie, 75013 Paris
 *          category: Pizza
 *       schema:
 *         $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant successfully modified
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove the restaurant by id
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The restaurant id
 *
 *     responses:
 *       200:
 *         description: The restaurant was deleted
 *       404:
 *         description: The restaurant was not found
 */

router.get("/restaurants", async (req, res) => {
  const allRestaurants = await Restaurant.find();
  return res.status(200).json(allRestaurants);
});

router.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);
  return res.status(200).json(restaurant);
});

router.post("/restaurants", async (req, res) => {
  const newRestaurant = new Restaurant({ ...req.body });
  const insertedRestaurant = await newRestaurant.save();
  return res.status(201).json(insertedRestaurant);
});

router.put("/restaurants/:_id", async (req, res) => {
  const { _id } = req.params;
  await Restaurant.updateOne({ _id }, req.body);
  const updatedRestaurant = await Restaurant.findById(_id);
  return res.status(200).json(updatedRestaurant);
});

router.delete("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
  return res.status(200).json(deletedRestaurant);
});

module.exports = router;
