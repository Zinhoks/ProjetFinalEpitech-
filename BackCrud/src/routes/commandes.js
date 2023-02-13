const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const { Commandes} = require("../models/commandes")

/**
 * @swagger
 * components:
 *    schemas:
 *     Commandes:
 *       type: object
 *       required:
 *         - amount
 *         - currency
 *         - payment_method
 *         - description
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the restaurant
 *         amount:
 *           type: string
 *           description: Commandes's total amount of orders
 *         currency:
 *           type: string
 *           description: Commandes's price currency
 *         payment_method:
 *           type: string
 *           description: Commandes's payment method
 *         description:
 *           type: string
 *           description: Commandes's description
 *         dishinfo:
 *           type: array
 *           description: Commandes's name, price,quantity, restaurant id
 *       example:
 *         _id: 63dbe282a074555f8a151d97
 *         amount: 1004
 *         payment-method: pm_1MX5VDBAbxORSEclJGNqorOd
 *         idUser: 63dce0ab3cc3115bba38e207
 *         dishinfo: image_path
 *         description: Company
 */

/**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Manage Commandes featuring on the application
 * /orders:
 *   get:
 *     summary: Lists all the commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: The list of all the orders
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 * /profile/user/history/{_id}:
 *   get:
 *     summary: Get an order by id
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The order id
 *     responses:
 *       200:
 *         description: The order response by id
 *       404:
 *         description: The order was not found 
 */


router.get("/orders", async (req, res) => {
  const allCommandes = await Commandes.find();
  return res.status(200).json(allCommandes);
});

router.get("/profile/user/history/:_id", async (req, res) => {
  const { _id } = req.params;
  const commande = await Commandes.findById(_id);
  return res.status(200).json(commande);
});

module.exports = router;