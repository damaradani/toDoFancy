const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = require('../models/user.model')
const ObjectID = require('mongodb').ObjectID
const saltRounds = 10
const pwdtoken = process.env.pwdtoken


module.exports = {
  getIndex: function(req, res){
    res.status(200).json({
      message: "Masuk Halaman Index"
    })
  },
  showAllUser: function(req, res){

    users.find()
         .exec()
         .then(user => {
           res.status(200).json({
             message: "Show all users",
             user
           })
         })
         .catch(err => {
           res.status(500).json({
             message: err
           })
         })
  },
  signIn: function(req, res){
    let email = req.body.email
    let password = req.body.password

    if(email == "" || password == ""){
      res.status(400).json({
        message: "email / Password must be filled"
      })
    }else {
      users.findOne({email})
           .then(user =>{
             bcrypt.compare(password, user.password, function(err, result){
               if(err){
                 res.status(406).json({
                   message: "Password is Wrong"
                 })
               }else{
                 let token = jwt.sign({id:user._id, email:user.email, role:user.role}, pwdtoken)
                 res.status(200).json({
                   message: "User Login Succesfully",
                   user,
                   token
                 })
               }
             })
           })
           .catch(err =>{
             console.log(err);
             res.status(500).json({
               message: "email / Password is wrong, Email is case Sensitive",
               err
             })
           })
    }

  },
  signUp: function(req, res){
    console.log(req.body);
    let plainPassword = req.body.password
    let cekPass = plainPassword.match(/[0-9]/g)
    let cekFormatEmail = validateEmail(req.body.email)

    users.findOne({email:req.body.email})
         .exec()
         .then(users => {
             // console.log('Users ',users);
             if(users){
               res.status(406).json({
                 message: "email sudah dipakai"
               })
             }else {
               if(!cekFormatEmail){
                 res.status(406).json({
                   message: "Email Format is wrong"
                 })
               }else if(plainPassword.length < 6){
                 res.status(406).json({
                   message: "password minimal 6"
                 })
               }else if (cekPass === null) {
                 res.status(406).json({
                   message: "Password must contained number"
                 })
               }else{
                 bcrypt.hash(plainPassword, saltRounds, function(err, hash){
                   //console.log(hash);

                   let newUser = {
                     name: req.body.name,
                     email: req.body.email,
                     password: hash
                   }

                   saveUser(newUser, req, res)

                 })

               }
             }
         })
         .catch(err =>{
           res.status(500).json({
             message: err
           })
         })
  }

}

validateEmail = function(email) {
  // console.log('Masuk Kesini');
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

saveUser = function(objUser, req, res){
  // console.log(objUser);
  let newUser = new users ({
    name: objUser.name,
    email: objUser.email,
    password: objUser.password,
    role: "user" //nanti ganti jadi user
  })

  //nanti masukin token jwt
  newUser.save((err, user) => {
    if(err){
      res.status(500).json({
        message: err
      })
    }else{
      res.status(201).json({
        message: `User has Succesfully added`,
        input: user
      })
    }
  })
}


// {_id: "docId", items: [1, 2]}
// db.items.update({_id:"docId"}, {$addToSet:{items: 2}}); // This won't update the document as it already contains 2
// db.items.update({_id:"docId"}, {$push: {item:2}}); // this will update the document. new document {_id: "docId", items:[1,2,2]}

//db.collection.update(  { _id:...} , { $set: someObjectWithNewData }







//
