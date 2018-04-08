const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
require('dotenv').config()

mongoose.connect('mongodb://localhost/toDoList_db')

// console.log('env', process.env);
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'))

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected to mongoose');
})

const index = require('./routes/index')
app.use('/', index)

const toDoListIndex = require('./routes/toDoList')
app.use('/toDoList', toDoListIndex)

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Server started on ${port}`);
})
