const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const { Dish } = require("../models/dishes");

/**
 * @swagger
 * components:
 *   schemas:
 *     Dishes:
 *       type: object
 *       required:
 *         - Dish_Name
 *         - Dish_Price
 *         - Restaurant_ID
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the dish
 *         Dish_Name:
 *           type: string
 *           description: dish's name
 *         Dish_Price:
 *           type: number
 *           description: dish's price
 *         Restaurant_ID:
 *           type: string
 *           description: ID of the restaurants that propose this dish
 *       example:
 *         _id: 63d0fa07e7ad16c611e2b531
 *         Dish_Name: Pizza Regina
 *         Dish_Price: 12
 *         Restaurant_ID: 63db842a7c661e7ce2f01b9f
 */

/**
 * @swagger
 * tags:
 *   name: Dishes
 *   description: Manage dishes featuring on the application
 * /dishes:
 *   get:
 *     summary: Lists all the dishes
 *     tags: [Dishes]
 *     responses:
 *       200:
 *         description: The list of all the dishes
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   post:
 *     summary: Creates a new dish
 *     tags: [Dishes]
 *     parameters:
 *      - in: body
 *        name: Dish_name
 *        schema:
 *        type: string
 *        required: true
 *        description: the dish's name
 *      - in: body
 *        name: Dish_Price
 *        schema:
 *        type: number
 *        required: true
 *        description: the dish's price
 *      - in: body
 *        name: Restaurant_ID
 *        schema:
 *        type: string
 *        required: true
 *        description: the restaurant's ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              Dish_Name:
 *                  type: string
 *              Dish_Price:
 *                  type: number
 *              Restaurant_ID:
 *                  type: string
 *       example:
 *          Dish_name: Pizza Royale
 *          Dish_Price: 15
 *          Restaurant_ID: 63db842a7c661e7ce2f01b9f
 *     responses:
 *       201:
 *         description: Dish successfully created
 *       500:
 *         description: Some server error
 * /dishes/{_id}:
 *   get:
 *     summary: Get a dish by id
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dish id
 *     responses:
 *       200:
 *         description: The dish response by id
 *       404:
 *         description: The dish was not found
 *   put:
 *     summary: Updates dish by the id
 *     tags: [Dishes]
 *     parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *        type: string
 *        required: true
 *        description: the dish id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              Dish_Name:
 *                  type: string
 *              Dish_Price:
 *                  type: string
 *              Restaurant_ID:
 *                  type: string
 *     responses:
 *       200:
 *         description: Dish successfully modified
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove the dish by id
 *     tags: [Dishes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The dish id
 *
 *     responses:
 *       200:
 *         description: The dish was deleted
 *       404:
 *         description: The dish was not found
 */

router.get("/dishes", async (req, res) => {
  const allDishes = await Dish.find();
  return res.status(200).json(allDishes);
});

router.get("/dishes/:id", async (req, res) => {
  const { id } = req.params;
  const dish = await Dish.findById(id);
  return res.status(200).json(dish);
});

router.post("/dishes", async (req, res) => {
  const newDish = new Dish({ ...req.body });
  const insertedDish = await newDish.save();
  return res.status(201).json(insertedDish);
});

router.put("/dishes/:_id", async (req, res) => {
  const { _id } = req.params;
  await Dish.updateOne({ _id }, req.body);
  const updatedDish = await Dish.findById(_id);
  return res.status(200).json(updatedDish);
});

router.delete("/dishes/:id", async (req, res) => {
  const { id } = req.params;
  const deletedDish = await Dish.findByIdAndDelete(id);
  return res.status(200).json(deletedDish);
});

module.exports = router;
