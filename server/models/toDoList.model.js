const mongoose = require('mongoose')
const Schema = mongoose.Schema

let toDoListSchema = new Schema({
  title: String,
  content: String,
  completed: String
},{
  timestamps: true
})

let toDoList = mongoose.model('toDoList', toDoListSchema)

module.exports = toDoList
