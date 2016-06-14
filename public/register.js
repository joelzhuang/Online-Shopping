$(document).ready(function(e) {
	var ERROR_LOG = console.error.bind(console);
	//adding two buttons to the dialog box
	// $('#sub').on('click',function({
	//
	// 	console.log(title);

	// });



	//	$('input[type=submit]#sub').click(function(){
	$(('#account')).on('click', function(){
		var namReg=/^[a-zA-Z]{4,15}$/;
   		var emailReg=/^[a-zA-Z0-9-_\.]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;
	    var passReg=/^[a-zA-Z0-9-_]{6,16}$/;
		var phnReg=/^[0-9]{6,14}$/;
		var addReg=/^[a-zA-Z0-9 ]{10,150}$/;
		var cityReg=/^[a-zA-Z]{5,30}$/;

		var title = $('#sel1').val();
		var fname = $('#t1').val();
		var lname = $('#t2').val();
		var email = $('#t3').val();
		var password = $('#p1').val();
		var phone = $('#t5').val();
		var address = $('#t6').val();
		var city = $('#t7').val();
		var country = $('#t8').val();
		var gender = $('#gender').val();
		var day = $('#day').val();
		var month = $('#month').val();
		var year = $('#year').val();
		console.log(gender);
		// if (!fname.match(namReg)) {
		// 	alert("Please enter your first name" + gender);
		// 	return false;
		// } else if (!lname.match(namReg)) {
		// 	alert("Please enter your last name");
		// 	return false;
		// } else if (!email.match(emailReg)) {
		// 	alert("Please enter a valid email address");
		// 	return false;
		// } else if (password === '') {
		// 	alert("Please enter a password");
		// 	return false;
		// } else if (!phone.match(phnReg)) {
		// 	alert("Please enter a valid phone number");
		// 	return false;
		// } else if (!address.match(addReg)) {
		// 	alert("Please enter your address");
		// 	return false;
		// } else if (!country.match(addReg)) {
		// 	alert("Please enter your country");
		// 	return false;
		// }

		var r_data={title,gender,fname,lname,email,password,phone,address,city,country,day,month,year};

		alert("well done. Account created");

		console.log(r_data);


		//alert("well done. Account created");

		$.ajax({
			method: 'POST',
			url: 'http://localhost:8080/register/',
			data: JSON.stringify({
				register_data : r_data,
			}),

			contentType: "application/json",
			dataType: "json"
		}).then(
				success_func(),ERROR_LOG
			);

		function success_func (){
			window.location = 'index.html';
			console.log('posted data.');
		}

	});

	function onSignIn(googleUser){
		var profile = googleUser.getBasicProfile();
		console.log("Name: " + profile.getName());
	}
}); // end ready
