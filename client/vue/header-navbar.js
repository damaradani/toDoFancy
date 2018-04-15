Vue.component('header-navbar', {
  name: 'header-navbar',
  template: `
  <nav class="navbar navbar-inverse">
    <div class="container-fluid">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#" style="font-weight:900;">To Do List</a>
      </div>
      <div class="collapse navbar-collapse" id="myNavbar">
        <ul class="nav navbar-nav">
          <li><a href="#" v-show="isLogin" data-toggle="modal" data-target="#toDoModal">Add New To Do</a></li>
        </ul>
        <ul class="nav navbar-nav navbar-right">
          <li>
            <a href="#" v-if="isLogin" @click="logout()">
              <span class="glyphicon glyphicon-user"></span>Logout
            </a>
            <a href="#" v-else data-toggle="modal" data-target="#loginModal">
              <span class="glyphicon glyphicon-user"></span>Login
            </a>
          </li>
          <li v-if="!isLogin">
            <a href="#" data-toggle="modal" data-target="#signUpModal">
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Modal Login -->
    <div class="modal fade" id="loginModal" role="dialog">
      <div class="modal-dialog" style="width:40%;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Login</h4>
          </div>
          <div class="modal-body form-group">
            <label for="email">Email :</label>
            <input type="text" class="form-control" id="email">
            <label for="password">Password</label>
            <input type="password" class="form-control" id="password">

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" style="width:100%;" @click="login()">Login</button>
            <br><p class="text-center" style="margin-top:10px;">Or Login with Social Media</p>
            <button type="button" class="btn fb" @click="">
              <i class="fa fa-facebook fa-fw"></i> Login with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Sign Up -->
    <div class="modal fade" id="signUpModal" role="dialog">
      <div class="modal-dialog" style="width:40%;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Sign Up</h4>
          </div>
          <div class="modal-body form-group">
            <label for="SUname">Name :</label><small id="SUnameCek"></small>
            <input type="text" v-model="regis_name" class="form-control" id="SUname">

            <label for="SUemail">Email :</label><small id="SUemailCek"></small>
            <input type="text" v-model="new_email" class="form-control" id="SUemail">

            <label for="SUpassword">Password :</label><small id="SUpasswordCek"></small>
            <input type="password" v-model="new_password" class="form-control" id="SUpassword">

            <label for="SUconPass">Confirm Password :</label><small id="SUconPassCek"></small>
            <input type="password" v-model="new_conPass" class="form-control" id="SUconPass">
          </div>
          <div class="modal-footer">
            <button type="button" v-show="isName && isEmail && isPwd && isConPwd" class="btn btn-default" @click="signup()">Sign Up</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Add To Do List -->
    <div class="modal fade" id="toDoModal" role="dialog">
      <div class="modal-dialog" style="width:50%;">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">&times;</button>
            <h4 class="modal-title">Create New To Do</h4>
          </div>
          <div class="modal-body form-group">
            <label for="title">Title :</label>
            <input type="text" class="form-control" id="title">
            <label for="content">Details :</label>
            <textarea class="form-control" rows="4" id="content" style="resize: none;"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" @click="new_todo()">Add</button>
          </div>
        </div>
      </div>
    </div>



  </nav>
  `,
  props: ['is-Login'],
  data: function(){
    return {
      regis_name: '',
      new_email: '',
      new_password: '',
      new_conPass: '',
      //kondisi apakah pengecekan nama, email dan password sudah sukses
      isName: false,
      isEmail: false,
      isPwd: false,
      isConPwd: false,
    }
  },
  methods: {
    login: function() {
      let email = $("#email").val()
      let password = $("#password").val()
      let payload = {
        email,
        password
      }
      this.$emit('login', payload)
    },
    logout: function() {
      this.$emit('logout', false)
    },
    signup: function() {
      let name = $('#SUname').val()
      let email = $('#SUemail').val()
      let password = $('#SUpassword').val()
      let payload = {
        name,
        email,
        password
      }
      this.$emit('signup', payload)
    },
    new_todo: function(){
      let title = $('#title').val()
      let content = $('#content').val()
      let payload = {
        title,
        content
      }
      this.$emit('new_todo', payload)
    }
  },
  watch:{
    regis_name: function(){
      if(this.regis_name.length > 4){
        $('#SUnameCek').text('')
        $('#SUname').css({"border-color": "green", "border-solid": "bold", "border-width": "3px"})
        this.isName = true
      }else {
        $('#SUnameCek').text('Name is Required && minimal 4 character').css("color","red")
        $('#SUname').css({"border-color": "red", "border-solid": "bold", "border-width": "3px"})
        this.isName = false
      }
    },
    new_email: function(){
      let email = this.new_email
      let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      let checkEmail = regEx.test(String(email).toLowerCase())
      console.log(checkEmail)
      if(checkEmail){
        $('#SUemailCek').text('')
        $('#SUemail').css({"border-color": "green", "border-solid": "bold", "border-width": "3px"})
        this.isEmail = true
      }else{
        $('#SUemailCek').text('Email Format is Wrong!').css("color","red")
        $('#SUemail').css({"border-color": "red", "border-solid": "bold", "border-width": "3px"})
        this.isEmail = false
      }

    },
    new_password: function(){
      let pwd = this.new_password
      console.log(pwd)
      if(pwd.length > 6){
        let numInPwd = pwd.match(/[0-9]/g)
        if(numInPwd){
          $('#SUpasswordCek').text('')
          $('#SUpassword').css({"border-color": "green", "border-solid": "bold", "border-width": "3px"})
          this.isPwd = true
        }else{
          $('#SUpasswordCek').text('Password must contained number!').css("color","red")
          $('#SUpassword').css({"border-color": "red", "border-solid": "bold", "border-width": "3px"})
          this.isPwd = false
        }
      }else{
        $('#SUpasswordCek').text('Password minimal 6 digit!').css("color","red")
        $('#SUpassword').css({"border-color": "red", "border-solid": "bold", "border-width": "3px"})
        this.isPwd = false
      }
    },
    new_conPass: function(){
      if(this.new_conPass == this.new_password){
          $('#SUconPassCek').text("")
          $('#SUconPass').css({"border-color": "green", "border-solid": "bold", "border-width": "3px"})
          this.isConPwd = true
      }else{
          $('#SUconPassCek').text("password not match").css("color","red")
          $('#SUconPass').css({"border-color": "red", "border-solid": "bold", "border-width": "3px"})
          this.isConPwd = false;
      }
    }
  }

})

















//
