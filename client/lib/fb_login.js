function statusChangeCallback(response) {
  console.log('statusChangeCallback', response);

  if (response.status === 'connected') {
    //heroku server
    let urlLink = 'https://todolist-dnd.herokuapp.com/fb-signin'

    //local server
    // let urlLink = 'http://localhost:3000/fb-signin'
    axios.post(urlLink, {}, {
      headers: {
        tokenFB: response.authResponse.accessToken
      }
    })
    .then(response => {
      console.log('Logged in', response)
      localStorage.setItem('token', response.data.token)
      // let indexUrl = 'https://taskfan-201211.firebaseapp.com/main.html'
      window.location.href = 'https://todo-list-1174b.firebaseapp.com/' // ini sementara
    })
    .catch(err => {
      console.log('Login FB failed', err)
    })

  } else {
    console.log('Not logged in')
  }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
  FB.init({
    appId      : '373307203150055',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.12'
  });
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
