const route = require('express').Router()
const {getIndex, signIn, signUp, showAllUser, fb_signin} = require('../controllers/index.controller');
const {adminOnly} = require('../middleware/auth')

//nanti di hapus
const users = require('../models/user.model')

route.get('/', getIndex)
     .get('/users', adminOnly, showAllUser)
     .post('/sign-in', signIn)
     .post('/sign-up', signUp)
     .post('/fb-signin', fb_signin)

module.exports = route
