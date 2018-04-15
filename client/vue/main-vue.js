let token = localStorage.getItem('token')

let vue = new Vue({
  el: '#app',
  data: {
    isLogin: false,
    toDoLists:[],
    editToDo:{}
  },
  methods: {
    //nanti tambah login facebook
    login: function(payload){
      let email = payload.email
      let password = payload.password

      console.log(email)
      console.log(password)
      axios.post('http://localhost:3000/sign-in', {password, email})
      .then(function(response){
          console.log(response.data);
          if(response.data.message != 'User Login Succesfully'){
            swal({
            type: 'error',
            title: 'Oops...',
            text: 'something wrong!',
            })
          }else{
            localStorage.setItem('token', response.data.token);
            swal(
                'Good job!',
                'You log in successfully!',
                'success'
              ).then(res =>{
                window.location.href = 'index.html'
              })

          }

      })
      .catch(function(err){
        swal({
         icon: 'error',
         title: 'Oops...',
         text: 'Email/password wrong!',
         })
      })
    },
    logout: function(){
      swal({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      buttons: true,
      confirmButtonText: 'Yes, Log out!'
      }).then(result => {
        console.log(result);
      if (result) {
          swal(
          'Log out!',
          'You have been log out.',
          'success'
          )
          localStorage.removeItem('token')
          window.location.href="index.html"
      }
      })
    },
    signup: function(payload){
      let name = payload.name
      let email = payload.email
      let password = payload.password
      let urlLink = 'http://localhost:3000/sign-up'

      console.log('Name :', name)
      console.log('Email :', email)
      console.log('Password :', password)

      axios.post(urlLink, {name, email, password})
           .then(function(res){
             swal(
               'Sign Up!',
               'You sign up successfully!',
               'success'
             ).then((value) => {
               window.location.href="index.html"
             })
           })
           .catch(function(err){
             console.log(err)
             swal({
                 icon: 'error',
                 title: 'Oops...',
                 text: 'Email is not available!',
                 })
           })
    },
    getToDoList: function(){
      let urlLink = 'http://localhost:3000/toDoList'
      axios.get(urlLink, {
        headers: {
          token
        }
      }).then(res =>{
        console.log(JSON.stringify(res.data, null, 2))
        this.toDoLists = res.data.toDoList
        // this
      }).catch(err => {
        console.log(err)
      })
    },
    new_todo: function(payload){
      let title = payload.title
      let content = payload.content
      let urlLink = 'http://localhost:3000/toDoList'
      console.log(payload);
      console.log('Judul To DO',title)
      console.log('Isi Content', content)

      axios.post(urlLink, { title, content }, {headers: {token}}
      ).then(res => {
          swal(
            'New To Do!',
            'To Do has been added',
            'success'
          ).then((value) => {
            window.location.href="index.html"
          })

      }).catch(err => {
        swal({
           icon: 'error',
           title: 'Oops...',
           text: err
        })
      })

    },
    setToDo: function(payload){
      this.editToDo = payload
      console.log(payload)
    },
    updateToDo: function(payload){
      let toDo_id = payload.toDo_id
      let title = payload.title
      let content = payload.content
      let urlLink = `http://localhost:3000/toDoList/${toDo_id}`
      console.log(payload)
      console.log(title)
      console.log(content)

      axios.put(urlLink, {title, content}, {headers: {token} } )
           .then(res => {
             console.log(res)
             swal(
               'Edit To Do!',
               'To Do has successfully edited',
               'success'
             ).then((value) => {
               window.location.href="index.html"
             })
           })
           .catch(err => {
             swal({
                type: 'error',
                title: 'Oops...',
                text: err,
             })
           })

    },
    updateToDoStatus: function(payload){
      let toDo_id = payload._id
      let toDo_status = payload.toDo_status
      let index = payload.index
      let urlLink = `http://localhost:3000/toDoList/${toDo_id}/status`
      // console.log(toDo_id)
      // console.log(toDo_status)

      axios.put(urlLink, {completed:toDo_status}, {headers: {token} } )
           .then(res =>{
             console.log(res)
             console.log(this.toDoLists)
             this.toDoLists[index].completed = toDo_status
             // window.location.href="index.html"
           })
           .catch(err => {
             console.log(err)
             // swal({
             //    icon: 'error',
             //    title: 'Oops...',
             //    text: err,
             // })
           })
    },
    deleteToDo: function(payload){
      let toDo_id = payload._id
      let toDo_title = payload.title
      console.log(toDo_id)
      swal({
        title: 'Are you sure?',
        text: `Do you really gonna delete "${toDo_title}"`,
        icon: 'warning'
      }).then(result => {

        if (result) {
            let urlLink = `http://localhost:3000/toDoList/${toDo_id}`
            axios.delete(urlLink, { headers: {token} } )
                 .then(res => {
                     console.log(res)
                     swal(
                     'Deleted!',
                     `${toDo_title} have been deleted.`,
                     'success'
                     ).then((value) => {
                       window.location.href="index.html"
                     })
                 })
                 .catch(err => {
                     swal({
                      type: 'error',
                      title: 'Oops...',
                      text: err,
                      })
                 })

        }
      })

    }

  },
  // mounted: function () {
  //   this.$nextTick(function () {
  //     this.getToDoList()
  //   })
  // },
  created: function() {
    // console.log('Ini Aapaaan',this.isLogin);
    if(token){
      this.getToDoList()
    }

  }

})

//bagusny token di cek dulu ke server valid ga ?
if(token){
  vue.isLogin = true
}else{
  vue.isLogin = false
}
