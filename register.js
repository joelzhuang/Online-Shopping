$(document).ready(function(e) {
	var ERROR_LOG = console.error.bind(console);
	//adding two buttons to the dialog box
	// $('#sub').on('click',function({
	// 	
	// 	console.log(title);
		
	// });

	$('input[type=submit]#sub').click(function(){
		var namReg=/^[a-zA-Z]{4,15}$/;
   		var emailReg=/^[a-zA-Z0-9-_\.]+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/;
	    var passReg=/^[a-zA-Z0-9-_]{6,16}$/;
		var phnReg=/^[0-9]{9,14}$/;
		var addReg=/^[a-zA-Z0-9 ]{10,150}$/;
		var cityReg=/^[a-zA-Z]{5,30}$/;

		var title = $('#sel1').val();
		var fname = $('#t1').val();
		var lname = $('#t2').val();
		var gender = $('#r1').val();
		var email = $('#t3').val();
		var password = $('#p1').val();
		var phone = $('#t5').val();
		var address = $('#t6').val();
		var country = $('#t8').val();
		var birth = $('#t9').val();
		if (!fname.match(namReg)) { 
			alert("Please enter your first name");
			return false; 
		} else if (!lname.match(namReg)) { 
			alert("Please enter your last name");
			return false; 
		} else if (gender === '') { 
			alert("Please select gender type");
			return false; 
		} else if (!email.match(emailReg)) { 
			alert("Please enter a valid email address");
			return false; 
		} else if (password === '') { 
			alert("Please enter a password");
			return false; 
		} else if (!phone.match(phnReg)) { 
			alert("Please enter a valid phone number");
			return false; 
		} else if (!address.match(addReg)) { 
			alert("Please enter your address");
			return false; 
		} else if (!country.match(addReg)) { 
			alert("Please enter your country");
			return false; 
		} else if (!birth === '') { 
			alert("Please enter your date of birth");
			return false; 
		} 

		alert("well done. Account created");
	});

	// $("#RightPart").click(function(){
	// 	var title = $('#sel1').val();
	// 	var fname = $('#t1').val();
	// 	var lname = $('#t2').val();
	// 	var gender = $('#r1').val();
	// 	var email = $('#t3').val();
	// 	var password = $('#p1').val();
	// 	var phone = $('#t5').val();
	// 	var address = $('#t6').val();
	// 	var country = $('#t8').val();
	// 	var birth = $('#t9').val();
	// 	if (fname === '') { 
	// 		alert("Please enter your first name");
	// 		return false; 
	// 	} else if (lname === '') { 
	// 		alert("Please enter your last name");
	// 		return false; 
	// 	} else if (gender === '') { 
	// 		alert("Please select gender type");
	// 		return false; 
	// 	} else if (email === '') { 
	// 		alert("Please enter a valid email address");
	// 		return false; 
	// 	} else if (password === '') { 
	// 		alert("Please enter a password");
	// 		return false; 
	// 	} else if (phone === '') { 
	// 		alert("Please enter a valid phone number");
	// 		return false; 
	// 	} else if (address === '') { 
	// 		alert("Please enter your address");
	// 		return false; 
	// 	} else if (country === '') { 
	// 		alert("Please enter your country");
	// 		return false; 
	// 	} else if (birth === '') { 
	// 		alert("Please enter your date of birth");
	// 		return false; 
	// 	} 
 //        console.log(title);
 //    }); 


			// 	if (taskName === '') { return false; }
			// 	var taskHTML = '<li><span class="done">%</span>';
			// 	taskHTML += '<span class="delete">x</span>';
			// 	taskHTML += '<span class="task"></span></li>';
			// 	console.log('hello');
			// 	/**
			// 	The get request must always have a then call back function. Because this is the only way it can get the data sent from the server.
			// 	nextfunction(data)
			// 	*/

			// 	//???
			// 	var $newTask = $(taskHTML);
			// 	$newTask.find('.task').text(taskName);

 
			// 	$.ajax({
			// 		method: 'POST',
			// 		url: 'http://localhost:8080/add/' + taskName,
			// 		data: JSON.stringify({
			// 			task: $newTask.find('.task').html()
			// 		}),

			// 		contentType: "application/json",
			// 		dataType: "json"
			// 	}).then(
			// 		success_func(),ERROR_LOG
			// 	);

			// 	function success_func (){
			// 			console.log('posted data.');
			// 	}

			// 	//close dialog box once a new task is added
			// 	$newTask.hide();
			// 	$('#todo-list').prepend($newTask);
			// 	$newTask.show('clip',250).effect('highlight',1000);
			// 	$(this).dialog('close');

			// 	//resets the value in the input box to be ''
			// 	$('#task').val('');
			// },

			// "Cancel":function(){
			// 	$(this).dialog('close');
			// 	$('#task').val('');
			// }
		
}); // end ready
 
