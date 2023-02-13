const express = require('express');
const router = express.Router();

const  { 
    getUsers,
    findUser,
    createUser,
    updateUser,
    deleteUser 
} = require('../controllers/users.js')

router.get('/admin/users', getUsers)

router.get('/admin/users/:id', findUser)

router.post('/admin/users', createUser) 

router.put('/admin/users/:_id', updateUser) 

router.delete('/admin/users/:id', deleteUser)

router.get('/profile/user/:id', findUser)

module.exports = router