$(document).ready(function(e) {



  $(('#kart')).on('click', function(){


  	$.ajax({
    	method: 'GET',
    	url: "https://quiet-bastion-96093.herokuapp.com/checkLogin"
 	}).then(function(data){
      console.log(data);
  	})

  });



});