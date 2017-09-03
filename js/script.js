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
				removeActiveCSS();
				$('#'+hash).addClass('active');
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
	$('#vehicleinformation').removeClass('active');
	$('#dieseldetails').removeClass('active');
	$('#tyredetails').removeClass('active');
	$('#driversalarydetails').removeClass('active');
	$('#vehiclemaintenence').removeClass('active');
}

