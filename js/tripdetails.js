/**
 * 
 */

$( document ).ready(function() {
	$(function () {
		  $('#datetimepicker1').datetimepicker();
		});

});

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#addModal').modal('show');
}

var save = function(){
	var tripdate = new Date($('#datepicker').val());
	var route = $('#src_route').val()+$('#desc_route').val();
	var startingKM = parseInt($('#startingkm').val());
	var closingKM = parseInt($('#closingkm').val());
	var totalKM = parseInt($('#totalkm').val());
	var passing = $('#passing').val();
	var tollCount = $('#tollcount').val();
	var amtPerKM = parseInt($('#amtperkm').val());
	var totalAmount = parseInt($('#totalamt').val());
	
	var TripDetails = Parse.Object.extend("tripdetails");
	var tripDetails = new TripDetails();

	tripDetails.set("tripdate", tripdate);
	tripDetails.set("route", route);
	tripDetails.set("startingkm", startingKM);
	tripDetails.set("closiingkm", closingKM);
	tripDetails.set("totalkm", totalKM);
	tripDetails.set("toll", tollCount);
	tripDetails.set("passing", passing);
	tripDetails.set("amperkm", amtPerKM);
	tripDetails.set("totalamt", totalAmount);

	tripDetails.save(null, {
	  success: function(tripDetails) {
	    // Execute any logic that should take place after the object is saved.
	    alert('New object created with objectId: ' + tripDetails.id);
	  },
	  error: function(tripDetails, error) {
	    // Execute any logic that should take place if the save fails.
	    // error is a Parse.Error with an error code and message.
	    alert('Failed to create new object, with error code: ' + error.message);
	  }
	});
}