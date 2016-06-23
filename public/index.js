$(document).ready(function(e) {

  	$.ajax({
    	method: 'GET',
    	url: "https://quiet-bastion-96093.herokuapp.com/checkLogin"
 	}).then(function(data){
      console.log(data);

      // Logged in (Logout)
      if(data=='found'){
      	$('#Leaf_bottom').prepend('<a class="log-out" href id = "log-out" >LOG OUT</a> ')

      }
      // Not logged in (Register, Log In)
      else{

      	$('#Leaf_bottom').prepend('<a class="registration" href="register.html">REGISTRATION</a> <a class="log-in" href="login.html">LOG IN</a> ')

      }
  	})

  	$('#Leaf_bottom').on('click', 'a', function(){

  		$.ajax({
    		method: 'GET',
    		url: "https://quiet-bastion-96093.herokuapp.com/logout",
    		data: 'loggingout',
			cache: true,
 		}).then(function(){
 			console.log('yoza')
 		})

  	});



});
