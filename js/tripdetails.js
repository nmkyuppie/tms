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
		htmlContent+="<tr>";
		htmlContent+="<td>";
		htmlContent+="<button type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
					 "<i class=\"material-icons md-18\">mode_edit</i>"+
					 "</button>";
		htmlContent+="</td>";
		htmlContent+="<td>";
		htmlContent+="<button type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
					 "<i class=\"material-icons md-18\">delete</i>"+
					 "</button>";
		htmlContent+="</td>";
		htmlContent+="<td>"+
						$.datepicker.formatDate('dd M yy', new Date(tripDetails[i].tripdate.iso))
		htmlContent+="</td>";
		htmlContent+="</td>";
		htmlContent+="<td>"+
		tripDetails[i].route;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].startingkm;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].closingkm;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].totalkm;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].passing;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].toll;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].amtperkm;
htmlContent+="</td>";
htmlContent+="<td>"+
tripDetails[i].totalamt;
htmlContent+="</td>";
	}
	$('#tripDetailsTableBody').html(htmlContent);
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