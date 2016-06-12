$(document).ready(function(e) {



  $(('#kart')).on('click', function(){


  	$.ajax({
    	method: 'GET',
    	url: "http://localhost:8080/checkLogin"
 	}).then(function(data){
      console.log(data);
  	})

  });



});