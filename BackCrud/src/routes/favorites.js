const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const { Favorite } = require("../models/favorite");

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorites:
 *       type: object
 *       required:
 *         - Restaurant_ID
 *         - Restaurant_Name
 *         - UserID
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the favorite
 *         Restaurant_ID:
 *           type: string
 *           description: ID of the restaurant
 *         Restaurant_Name:
 *           type: string
 *           description: name of the restaurant
 *         userID:
 *           type: string
 *           description: ID of the user who saved the favorite
 *       example:
 *         _id: 63d0fa07e7ad16c611e2b531
 *         Restaurant_ID: 63db842a7c661e7ce2f01b9f
 *         Restaurant_Name: restaurant name
 *         UserID: 63db88555bc75b510e2ad7cf
 */

/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: Manage favorites saved by users
 * /profile/favorite:
 *   get:
 *     summary: Lists all the favorites of all the users
 *     tags: [Favorites]
 *     responses:
 *       200:
 *         description: The list of all the favorites of all the users
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *   post:
 *     summary: Creates a new favorite
 *     tags: [Favorites]
 *     parameters:
 *      - in: body
 *        name: Restaurant_ID
 *        schema:
 *        type: string
 *        required: true
 *        description: the ID of the restaurant saved as favorite
 *      - in: body
 *        name: Restaurant_Name
 *        schema:
 *        type: string
 *        required: true
 *        description: the name of the restaurant saved as a favorite
 *      - in: body
 *        name: UserID
 *        schema:
 *        type: string
 *        required: true
 *        description: user's ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              Restaurant_ID:
 *                  type: string
 *              Restaurant_Name:
 *                  type: string
 *              UserID:
 *                  type: string
 *       example:
 *          Restaurant_ID: 63db842a7c661e7ce2f01b9f
 *          Restaurant_Name: Restaurant Name
 *          UserID: 63db88555bc75b510e2ad7cf
 *     responses:
 *       201:
 *         description: favorite successfully created
 *       500:
 *         description: Some server error
 * /profile/favorite/{_id}:
 *   get:
 *     summary: Get a favorite by id
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The favorite id
 *     responses:
 *       200:
 *         description: The favorite response by id
 *       404:
 *         description: The favorite was not found
 *   delete:
 *     summary: Remove the favorite by id
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The favorite id
 *
 *     responses:
 *       200:
 *         description: The favorite was deleted
 *       404:
 *         description: The favorite was not found
 */

router.get("/profile/favorite", async (req, res) => {
  const allFavorites = await Favorite.find();
  return res.status(200).json(allFavorites);
});

router.get("/profile/favorite/:id", async (req, res) => {
  const { id } = req.params;
  const favorite = await Favorite.findById(id);
  return res.status(200).json(favorite);
});

router.post("/profile/favorite", async (req, res) => {
  const newFavorite = new Favorite({ ...req.body });
  const insertedFavorite = await newFavorite.save();
  return res.status(201).json(insertedFavorite);
});

router.delete("/profile/favorite/:id", async (req, res) => {
  const { id } = req.params;
  const deletedFavorite = await Favorite.findByIdAndDelete(id);
  return res.status(200).json(deletedFavorite);
});

module.exports = router;
