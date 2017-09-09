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
	$('#exampleModalLongTitle').html('Add a Trip');
	$('#addModal').modal('show');
}

var calculateTotalKM = function(){ 
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
	$('#tripDetailsTableBody').html('<tr><td align=\"center\" colspan=\"11\"><div class=\"progress\">'+
			'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
	'</div></td></tr>');

	var tripDetails = Parse.Object.extend("tripdetails");
	var query = new Parse.Query(tripDetails);
	query.descending("tripdate");
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
		"<button onclick=\"editTrip('"+tripDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button onclick=\"deleteTrip('"+tripDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(tripDetails[i].tripdate.iso))+
		"</td>"+
		"</td>"+
		"<td>"+
		tripDetails[i].srcroute+' to '+tripDetails[i].destroute+
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

var save = function(objectId){

	$('.errorMessage').hide();

	if($('#datepicker').val()===''){
		$('#datepickererror').text('Please enter date.');
		document.getElementById('datepickererror').style.display='block';
		return;
	}else if($('#srcroute').val()===''){
		$('#srcrouteerror').text('Please enter source.');
		document.getElementById('srcrouteerror').style.display='block';
		return;
	}else if($('#destroute').val()===''){
		$('#destrouteerror').text('Please enter destination.');
		document.getElementById('destrouteerror').style.display='block';
		return;
	}else if($('#startingkm').val()===''){
		$('#startingkmerror').text('Please enter start km.');
		document.getElementById('startingkmerror').style.display='block';
		return;
	}else if($('#closingkm').val()===''){
		$('#closingkmerror').text('Please enter close km.');
		document.getElementById('closingkmerror').style.display='block';
		return;
	}else if($('#totalkm').val()<=0){
		$('#totalkmerror').text('Invalid start or end km.');
		document.getElementById('totalkmerror').style.display='block';
		return;
	}else if($('#passing').val()===''){
		$('#passingerror').text('Please enter passing.');
		document.getElementById('passingerror').style.display='block';
		return;
	}else if($('#tollcount').val()===''){
		$('#tollcounterror').text('Please enter toll.');
		document.getElementById('tollcounterror').style.display='block';
		return;
	}else if($('#amtperkm').val()===''){
		$('#amtperkmerror').text('Please enter amount per km.');
		document.getElementById('amtperkmerror').style.display='block';
		return;
	}else if($('#totalamt').val()<=0){
		$('#totalamterror').text('Invalid amount.');
		document.getElementById('totalamterror').style.display='block';
		return;
	}
	var tripdate = new Date($('#datepicker').val());
	var srcRoute = $('#srcroute').val()
	var destRoute = $('#destroute').val();
	var startingKM = parseInt($('#startingkm').val());
	var closingKM = parseInt($('#closingkm').val());
	var totalKM = parseInt($('#totalkm').val());
	var passing = $('#passing').val();
	var tollCount = $('#tollcount').val();
	var amtPerKM = parseInt($('#amtperkm').val());
	var totalAmount = parseInt($('#totalamt').val());


	var TripDetails = Parse.Object.extend("tripdetails");
	var tripDetails = new TripDetails();


	if(objectId!=''){
		tripDetails.set("objectId", objectId);
	}
	tripDetails.set("tripdate", tripdate);
	tripDetails.set("srcroute", srcRoute);
	tripDetails.set("destroute", destRoute);
	tripDetails.set("startingkm", startingKM);
	tripDetails.set("closingkm", closingKM);
	tripDetails.set("totalkm", totalKM);
	tripDetails.set("toll", tollCount);
	tripDetails.set("passing", passing);
	tripDetails.set("amtperkm", amtPerKM);
	tripDetails.set("totalamt", totalAmount);
	$('#saveButton').html('Saving...');
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

var editTrip = function(objectId){
	$('#requestProgressBlue').show();
	var TripDetails = Parse.Object.extend("tripdetails");
	var query = new Parse.Query(TripDetails);
	query.equalTo("objectId", objectId);
	query.find({
		success: function(results) {
			if(results.length>0){	
				$('#requestProgressBlue').hide();
				openAddModal();
				putValuesInModal(results);
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
}

var putValuesInModal = function(tripDetails){
	$('#exampleModalLongTitle').html('Edit a Trip');
	$('#saveButton').attr('onclick', "save('"+tripDetails[0].id+"')");
	$('#datepicker').val($.datepicker.formatDate('mm/dd/yy', tripDetails[0].get('tripdate')));
	$('#srcroute').val(tripDetails[0].get('srcroute'));
	$('#destroute').val(tripDetails[0].get('destroute'));
	$('#startingkm').val(tripDetails[0].get('startingkm'));
	$('#closingkm').val(tripDetails[0].get('closingkm'));
	$('#totalkm').val(tripDetails[0].get('totalkm'));
	$('#passing').val(tripDetails[0].get('passing'));
	$('#tollcount').val(tripDetails[0].get('toll'));
	$('#amtperkm').val(tripDetails[0].get('amtperkm'));
	$('#totalamt').val(tripDetails[0].get('totalamt'));
}

var deleteTrip = function(objectId){
	$('#requestProgressRed').show();
	var tripDetails = Parse.Object.extend("tripdetails");
	var query = new Parse.Query(tripDetails);
	query.get(objectId, {
		success: function(tripDetails) {
			// The object was retrieved successfully.
			tripDetails.destroy({
				success: function(myObject) {
					$('#requestProgressRed').hide();
					window.location.reload();
					// The object was deleted from the Parse Cloud.
				},
				error: function(myObject, error) {
					// The delete failed.
					// error is a Parse.Error with an error code and message.
				}
			});
		},
		error: function(object, error) {
			// The object was not retrieved successfully.
			// error is a Parse.Error with an error code and description.
		}
	}); 
}