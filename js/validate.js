$(function() {
	//Parse.$ = jQuery;
	/* window.jQuery = jQuery;
    window.alert(jQuery);*/
	$('.form-signin').on('submit', function(e) {

		// Prevent Default Submit Event
		e.preventDefault();

		// Get data from the form and put them into variables
		var username = $('#inputEmail').val();
		var password = $('#inputPassword').val();

		// Call Parse Login function with those variables
		Parse.User.logIn(username, password, {
			// If the username and password matches
			success: function(user) {
				/*window.alert(JSON.stringify(user));*/
				window.location = "dashboard.html";
			},
			// If there is an error
			error: function(user, error) {
				alert(JSON.stringify(error));
			}
		});
	});
});