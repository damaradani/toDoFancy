const jwt = require('jsonwebtoken')
const users = require('../models/user.model')
const pwdtoken = process.env.pwdtoken

module.exports = {
  loginAuth: function(req, res, next){
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    // console.log(decoded.id);

    if(token){
      users.findOne({_id:decoded.id})
           .then(users => {
             // console.log(users);
             if(!users){
                res.status(401).json({
                  message: "U need to Login"
                })
             }else{
                next()
             }
           })
           .catch(err =>{
              res.status(500).json({
                message: err
              })
           })
    }else{
      res.status(403).json({
        message: "U need to Login"
      })
    }
  },
  adminOnly: function(req, res, next){
    let token = req.headers.token
    let decoded = jwt.verify(token, pwdtoken)
    // console.log(decoded.id);

    if(token){
      users.findOne({_id:decoded.id})
           .then(users => {
             // console.log(users);
             if(!users){
                res.status(403).json({
                  message: "U need to Login"
                })
             }else{
                if(users.role === "admin"){
                  next()
                }else{
                  res.status(401).json({
                    message: "Only Admin can acces this Page"
                  })
                }

             }
           })
           .catch(err =>{
              res.status(500).json({
                message: err
              })
           })
    }else{
      res.status(403).json({
        message: "U need to Login"
      })
    }
  }
}
