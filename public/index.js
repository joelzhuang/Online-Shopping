$(document).ready(function(e) {

  	$.ajax({
    	method: 'GET',
    	url: "https://quiet-bastion-96093.herokuapp.com/checkLogin"
    }).then(function(data){
      console.log(data);

      // Logged in (Logout)
      if(data=='found'){
        $('#Leaf_bottom').prepend()
      	$('#Leaf_bottom').prepend('<a class="log-out" href id = "log-out" >LOG OUT</a> ')

      }
      // Not logged in (Register, Log In)
      else{

      	$('#Leaf_bottom').prepend('<a class="registration" href="register.html">REGISTRATION</a> <a class="log-in" href="login.html">LOG IN</a> ')

      }
  	});

  	$('#Leaf_bottom').on('click', 'a', function(){

  		$.ajax({
    		method: 'GET',
    		url: "https://quiet-bastion-96093.herokuapp.com/logout",
    		data: 'loggingout',
        cache: true,
      }).then(function(){
        console.log('yoza')
      });

  	});

    var lat ="";
    var long = "";

    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude
      var long = position.coords.longitude;
   

    //var query = 'SELECT * FROM geo.places WHERE text="{'+lat+'}, {'+long+'}" AND placeTypeName.code = 7';
    var query = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="nome, ak")';
    $.ajax({
      method: 'GET',
      url: 'http://query.yahooapis.com/v1/public/yql?q=' + query + '&format=json&diagnostics=true&callback='

      }).then(function(data){
        console.log(data)
        $('#weather').prepend(data.query.results.channel.item.condition.temp);
        $('#weather').prepend(data.query.results.channel.item.condition.text+ " ");
      })

      });
});
