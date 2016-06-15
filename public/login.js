$(document).ready(function(e) {

	//var loginPass = $('#p1').val();
	//var loginPass2 = document.getElementById("p1");

	$(('#Submit')).on('click', function(){
		var loginName = $('#t1').val();
		var loginPass = $('#p1').val();

		$.ajax({
			method:'POST',
			url: 'https://quiet-bastion-96093.herokuapp.com/login/',
			data: JSON.stringify({name : loginName, pass: loginPass}),
			contentType: "application/json",
			cache: true,
			dataType: "json"
		}).then(function(data){
			if(data.outcome == 'correct'){
				console.log("success");
				window.location.replace('index.html');
			}
			else if(data.outcome == 'badpw'){
				alert('Incorrect Password');

			}
			else if(data.outcome == 'incorrect'){
				console.log("failed");
				alert('Incorrect Username');
			}
		});
	});


});