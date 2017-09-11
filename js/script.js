/**
 * 
 */
var pages = ["", "#", "#overview", "#tripdetails", "#vehicledetails", "#dieseldetails", "#tyredetails", "#driversalarydetails", "#vehiclemaintenance"];

$( document ).ready(function() {

	var hash=window.location.hash;
	load(hash);
});

$(window).on('hashchange', function() {
	var hash=window.location.hash;
	load(hash);
});

var load=function(hash){
//	$('#addAction').hide();
	if(typeof hash!== "undefined"){
		if(pages.indexOf(hash) > -1){
			if(hash.length>0){
				hash=hash.substring(1,hash.length);
				document.getElementById('mainIFrame').src=hash+'.html';
				removeActiveCSS();
				$('#'+hash).addClass('active');
				if(hash==='overview'){
					$('#addAction').hide();
				}else if(hash==='tripdetails'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Trip</span>');
				}else if(hash==='dieseldetails'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Diesel Detail</span>');
				}else if(hash==='tyredetails'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Tyre Detail</span>');
				}else if(hash==='vehicledetails'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Vehicle Detail</span>');
				}else if(hash==='driversalarydetails'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Driver Salary Detail</span>');
				}else if(hash==='vehiclemaintenance'){
					$('#addAction').show();
					$('#addAction').html('<i class="material-icons md-18 d-sm-none">add_box</i><span class="d-none d-sm-block"> Add Vehicle Maintenance Detail</span>');
				}
			}
		}
		else{
			document.getElementById('mainIFrame').src='404.html';
		}
	}
}

var openAddModal = function(){
	var iframeSrc=document.getElementById('mainIFrame').src;
	if(iframeSrc.indexOf('#')!=-1){
		iframeSrc=iframeSrc.substring(0,iframeSrc.indexOf('#'));	
		document.getElementById('mainIFrame').src= iframeSrc+'#add';
	}else{
		document.getElementById('mainIFrame').src= iframeSrc+'#add';
	}
}

var removeActiveCSS = function(){
	$('#overview').removeClass('active');
	$('#tripdetails').removeClass('active');
	$('#vehicledetails').removeClass('active');
	$('#dieseldetails').removeClass('active');
	$('#tyredetails').removeClass('active');
	$('#driversalarydetails').removeClass('active');
	$('#vehiclemaintenance').removeClass('active');
}

function validateSession(){
	var currentUser = Parse.User.current();
	if (currentUser) {
		console.log("sucesss user session exists");
		console.log(JSON.stringify(currentUser));
	} else {
		console.log("session (logged out/please login) redirecting to login page");
		window.location = "index.html";
	}
}

function invalidateSession(){
	console.log("invalidating session");
	Parse.User.logOut().then(() => {
		var currentUser = Parse.User.current(); 
		if(currentUser)
		{ // this will now be null
			console.log("some error in invalidating session");
		}
		else
		{
			console.log("session logged out redirecting to login page");
			window.location = "index.html";
		}
	});
}