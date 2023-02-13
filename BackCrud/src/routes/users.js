const express = require("express");
const cors = require("cors");
const router = express.Router();
router.use(cors());

const { Users } = require("../models/users");

/**
 * @swagger
 * components:
 *    schemas:
 *     Users:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         password:
 *           type: string
 *           description: User's password
 *         token:
 *           type: string
 *           description: User's token*
 *         status:
 *            type: string
 *            description: User's status user or administrator
 *         address:
 *            type: string
 *            description: User's address 
 *         createdAt:
 *             type: date
 *             description: User's creation date
 *         updatedAt:
 *             type: date
 *             description: User's update date
 *       example:
 *         _id: 63db88555bc75b510e2ad7cf
 *         username: ilyes
 *         email: ilyes@ilyes.fr
 *         password: $2b$10$kb1.lO7l3ZqxErqjn2h7luWiqw4ZtqOjYqtZSDzs7QBTVZ.t4TMIS
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlseWVzQGlseWVzLmZyI
 *         status : admin
 *         address: 14 rue pasteur 94400 vitry sur seine
 *         createdAt: 2023-02-02T09:54:29.447+00:00
 *         updatedAt: 2023-02-02T09:54:29.525+00:00
 *
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manage Users featuring on the application
 * /admin/users:
 *   get:
 *     summary: Lists all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of all users
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 $ref: '#/components/schemas/Users'
 * /admin/users/{_id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: The user was not found
 *   put:
 *     summary: Updates user by the id
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *        type: string
 *        required: true
 *        description: the user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              status:
 *                  type: string
 *       example:
 *          username: user
 *          email: user@user.fr
 *          status: user
 *       schema:
 *         $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: User successfully modified
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 * /profile/user/{_id}:
 *   get:
 *     summary: Get a user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: _id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: The user was not found
 *   put:
 *     summary: Updates user by the id
 *     tags: [Users]
 *     parameters:
 *      - in: path
 *        name: _id
 *        schema:
 *        type: string
 *        required: true
 *        description: the user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              username:
 *                  type: string
 *              email:
 *                  type: string
 *              password:
 *                  type: string
 *       example:
 *          username: user
 *          email: user@user.fr
 *          password: 123456789
 *       schema:
 *         $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: User successfully modified
 *       400:
 *         description: Bad request
 *       500:
 *         description: Some server error
 */


router.get("/admin/users", async (req, res) => {
  const allUsers = await Users.find();
  return res.status(200).json(allUsers);
});

router.get("/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  return res.status(200).json(user);
});

router.post("/admin/users", async (req, res) => {
  const data = new Users({ ...req.body });
  try {
    const createUser = await data.save();
    res.status(201).json(createUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/admin/users/:_id", async (req, res) => {
  const { _id } = req.params;
  await Users.updateOne({ _id }, req.body);
  const updateUser = await Users.findById(_id);
  return res.status(200).json(updateUser);
});

router.delete("/admin/users/:id", async (req, res) => {
  const { id } = req.params;
  const deleteUser = await Users.findByIdAndDelete(id);
  return res.status(200).json(deleteUser);
});


router.get("/profile/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  return res.status(200).json(user);
});

router.put("/profile/user/edit/:id", async (req, res) => {
  const { id } = req.params;
  await Users.updateOne({ id }, req.body);
  const updateUser = await Users.findById(id);
  return res.status(200).json(updateUser);
});

module.exports = router;
