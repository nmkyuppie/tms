/**
 * 
 */
var pages = ["", "#", "#overview", "#tripdetails", "#vehicleinformation", "#dieseldetails", "#tyredetails", "#driversalarydetails", "#vehiclemaintenence"];

$( document ).ready(function() {
	var hash=window.location.hash;
	load(hash);
});

$(window).on('hashchange', function() {
	var hash=window.location.hash;
	load(hash);
});

var load=function(hash){
	if(typeof hash!== "undefined"){
		if(pages.indexOf(hash) > -1){
			if(hash.length>0){
				hash=hash.substring(1,hash.length);
				document.getElementById('mainIFrame').src=hash+'.html';
			}
		}
		else{
			document.getElementById('mainIFrame').src='404.html';
		}
	}
}
