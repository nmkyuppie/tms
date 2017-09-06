/**
 * 
 */

var init = function() {
	getTripDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#addModal').modal('show');
}

var calculateTotalKM = function(){ debugger;
	var closingKM=0;
	var startingKM=0;
	if(!isNaN($('#startingkm').val())&&$('#startingkm').val()!=''){
		startingKM=parseInt($('#startingkm').val());
	}
	if(!isNaN($('#closingkm').val())&&$('#closingkm').val()!=''){
		closingKM=parseInt($('#closingkm').val());
	}

	var totalKM=0;
	totalKM=closingKM-startingKM;
	if($('#startingkm').val()!=''&&$('#closingkm').val()!='')
		$('#totalkm').val(totalKM);
}

var calculateTotalAmt = function(){

	if($('#totalkm').val()!=''){
		if(!isNaN($('#amtperkm').val())&&$('#amtperkm').val()!=''){
			$('#totalamt').val($('#totalkm').val()*$('#amtperkm').val());
		}
	}
}

var getTripDetails = function(){
	var tripDetails = Parse.Object.extend("tripdetails");
	var query = new Parse.Query(tripDetails);

	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawTripDetails(json);//[0].objectId);
		},
		error: function(tripDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawTripDetails = function(tripDetails){
	var htmlContent="";
	for (var i = 0; i < tripDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td>"+
		"<button type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(tripDetails[i].tripdate.iso))+
		"</td>"+
		"</td>"+
		"<td>"+
		tripDetails[i].route+
		"</td>"+
		"<td>"+
		tripDetails[i].startingkm+
		"</td>"+
		"<td>"+
		tripDetails[i].closingkm+
		"</td>"+
		"<td>"+
		tripDetails[i].totalkm+
		"</td>"+
		"<td>"+
		tripDetails[i].passing+
		"</td>"+
		"<td>"+
		tripDetails[i].toll+
		"</td>"+
		"<td>"+
		tripDetails[i].amtperkm+
		"</td>"+
		"<td>"+
		tripDetails[i].totalamt+
		"</td>";
	}
	$('#tripDetailsTableBody').html(htmlContent);
}

var save = function(){
	var tripdate = new Date($('#datepicker').val());
	var route = $('#srcroute').val()+' to '+$('#destroute').val();
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
	tripDetails.set("closingkm", closingKM);
	tripDetails.set("totalkm", totalKM);
	tripDetails.set("toll", tollCount);
	tripDetails.set("passing", passing);
	tripDetails.set("amtperkm", amtPerKM);
	tripDetails.set("totalamt", totalAmount);

	tripDetails.save(null, {
		success: function(tripDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(tripDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}