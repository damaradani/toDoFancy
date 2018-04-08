const route = require('express').Router()
const {getAllToDoList, getToDoListByUserId, createToDoList, updateToDoList, updateToDoListStatus, deleteToDoList} = require('../controllers/toDoList.controller');
const {loginAuth} = require('../middleware/auth');

route.get('/', loginAuth, getToDoListByUserId)
     .post('/', loginAuth, createToDoList)
     .put('/:ToDoId', loginAuth, updateToDoList)
     .put('/:ToDoId/status', loginAuth, updateToDoListStatus)
     .delete('/:ToDoId', loginAuth, deleteToDoList)

module.exports = route
