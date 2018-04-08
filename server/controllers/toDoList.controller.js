const jwt = require('jsonwebtoken');
const toDoList = require('../models/toDoList.model.js')
const users = require('../models/user.model')
const ObjectID = require('mongodb').ObjectID
const pwdtoken = process.env.pwdtoken;

module.exports = {
  getAllToDoList: function(req, res){

    toDoList.find()
            .exec()
            .then(toDoList_data =>{
              res.status(200).json({
                message: "show All toDoList",
                toDoList: toDoList_data
              })
            })
            .catch(err =>{
              res.status(500).json({
                message: err
              })
            })
  },
  getToDoListByUserId: function(req, res){

    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    let userId = decoded.id

    users.findOne({_id:ObjectID(userId)})
         .populate('toDoList')
         .exec()
         .then(user =>{
            res.status(200).json({
              message: "show All toDoList",
              toDoList: user.toDoList
            })
         })
         .catch(err =>{
            res.status(500).json({
              message: err
            })
         })
  },
  createToDoList: function(req, res) {
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    let userId = decoded.id

    let newToDo = new toDoList({
      title: req.body.title,
      content: req.body.content,
      completed: "false"
    })

    newToDo.save((err, toDoList) =>{
      if(err){
        res.status(500).json({
          message: err
        })
      }else{
        // console.log('To Do List',toDoList);
        users.update({_id:ObjectID(userId)}, {$addToSet:{toDoList:toDoList._id}})
             .then(user =>{
                 res.status(201).json({
                   message: "new ToDoList has been added",
                   user,
                   toDoList
                 })

             })
             .catch(err => {
                res.status(500).json({
                  message: err
                })
             })

      }

    })

  },
  updateToDoListStatus: function(req, res) {
    let toDoListId = req.params.ToDoId
    let completed = req.body.completed

    toDoList.update({_id:ObjectID(toDoListId)}, {$set:{completed}})
            .then(result =>{
              res.status(200).json({
                message: "Update Status ToDoList Success",
                result
              })
            })
            .catch(err => {
              res.status(500).json({
                message: err
              })
            })
  },
  updateToDoList: function(req, res){
    let toDoListId = req.params.ToDoId
    let title = req.body.title
    let content = req.body.content
    // console.log('Id-',toDoListId);
    // console.log('title-', title);
    // console.log('content', content);

    toDoList.update(
      {_id:ObjectID(toDoListId)},
      {$set:{title, content}}
    )
            .then(result =>{
              res.status(200).json({
                message: "update ToDoList Success",
                result
              })
            })
            .catch(err => {
              res.status(500).json({
                message: err
              })
            })

  },
  deleteToDoList: function(req, res) {
    //nanti id toDoList di user di hapus juga
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    let userId = decoded.id
    let toDoListId = req.params.ToDoId

    toDoList.remove({_id:ObjectID(toDoListId)})
            .then(result => {
                console.log(result);
                users.update(
                  {_id:ObjectID(userId)},
                  {$pull:{toDoList:ObjectID(toDoListId)}}
                )
                .then(result =>{
                  res.status(200).json({
                    message: `toDoList id ${toDoListId} has been deleted`,
                    result
                  })
                })
                .catch(err => {
                  res.status(500).json({
                    message: 'cant delete toDoList Id in user',
                    err
                  })
                })
            })
            .catch(err => {
              res.status(500).json({
                message: err
              })
            })


  }
}
