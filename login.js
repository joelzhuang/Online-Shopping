$(document).ready(function(e) {

	//var loginPass = $('#p1').val();
	//var loginPass2 = document.getElementById("p1");

	
	

	$(('#Submit')).on('click', function(){
		var loginName = $('#t1').val();
		var loginPass = $('#p1').val();

		//$.post('http://localhost:8080/post',jQuery.param({ field1: "hello", field2 : "hello2"}) );


		$.ajax({
			method:'POST',
			url: 'http://localhost:8080/post',
			data: JSON.stringify({name : loginName, pass: loginPass}),
			contentType: "application/json",
			dataType: "json"
		}).then(doThis);

		console.log(loginName);
		console.log(loginPass);

	});

	function doThis(){
		console.log("HERE")
	}
	

});