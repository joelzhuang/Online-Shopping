$(document).ready(function(e) {

	//var loginPass = $('#p1').val();
	//var loginPass2 = document.getElementById("p1");

	
	

	$(('#Submit')).on('click', function(){
		var loginName = $('#t1').val();
		var loginPass = $('#p1').val();

		var request = $.ajax({
			method:'POST',
			url: 'http://localhost:8080/post',
			data: JSON.stringify({name : loginName, pass: loginPass}),
			contentType: "application/json",
			dataType: "json"
		}).then(function(data){
			if(data.outcome == 'correct'){
				console.log("success");
				window.location = 'index.html';
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