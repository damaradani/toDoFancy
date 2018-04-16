const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const users = require('../models/user.model')
const ObjectID = require('mongodb').ObjectID
const saltRounds = 10
const pwdtoken = process.env.pwdtoken
const FB = require('fb');

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
             if(!user){
               res.status(406).json({
                 message: "Email / Password is Wrong"
               })
             }else{

             bcrypt.compare(password, user.password, function(err, result){
               if(err){
                 res.status(500).json({
                   message: "Something went Wrong"
                 })
               }else{
                  if(result){
                    let token = jwt.sign({id:user._id, email:user.email, role:user.role}, pwdtoken)
                    res.status(200).json({
                      message: "User Login Succesfully",
                      user,
                      token
                    })
                  }else{
                    res.status(406).json({
                      message: "Password is Wrong"
                    })
                  }

                }

             })
           }
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
               }else if(plainPassword.length < 5){
                 res.status(406).json({
                   message: "password minimal 5"
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
  },
  fb_signin: function(req, res){
    let token = req.headers.tokenfb
    console.log(token)
    FB.setAccessToken(token)
    FB.api('/me', {
      fields: ['email', 'name']
    },
    function (response) {
      console.log(response)
      users.findOne({
        email: response.email
      })
      .then(user => {
        console.log(user)
        if (user) {
          console.log('found')
          let token = jwt.sign({id:user._id, email:user.email, role:user.role}, pwdtoken)

          res.status(200).send({
            message: 'Account already registered, continue to login...',
            token: token
          })
        } else {
          bcrypt.hash(response.email, saltRounds, function(err, hash){
            //console.log(hash);

            let newUser = {
              name: response.name,
              email: response.email,
              password: hash
            }

            saveUser(newUser, req, res)

          })

        }
      })
      .catch(err => {
        console.log(err)
        // let newUser = new User({
        //   name: response.name,
        //   email: response.email,
        //   birthday: response.birthday,
        //   gender: response.gender
        // })
        //
        // newUser.save()
        // .then(user => {
        //   console.log('save')
        //   let token = jwt.sign({
        //     token: user
        //   }, secret)
        //
        //   res.status(201).send({
        //     message: 'Register new account success, continue to login...',
        //     token: token
        //   })
        // })
        // .catch(error => {
        //   console.log('error login failed')
        //   res.status(400).send({
        //     message: 'Login failed!',
        //     error: error.message
        //   })
        // })
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
      let token = jwt.sign({id:user._id, email:user.email, role:user.role}, pwdtoken)
      res.status(201).json({
        message: `User has Succesfully added`,
        user: user,
        token
      })
    }
  })
}


// {_id: "docId", items: [1, 2]}
// db.items.update({_id:"docId"}, {$addToSet:{items: 2}}); // This won't update the document as it already contains 2
// db.items.update({_id:"docId"}, {$push: {item:2}}); // this will update the document. new document {_id: "docId", items:[1,2,2]}

//db.collection.update(  { _id:...} , { $set: someObjectWithNewData }







//
