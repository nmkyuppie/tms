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
	$('#exampleModalLongTitle').html('Add a Fill');
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
		if(!isNaN($('#priceperltr').val())&&$('#priceperltr').val()!=''){
			$('#totalamt').val($('#totalkm').val()*$('#priceperltr').val());
		}
	}
}

var getTripDetails = function(){
	var tripDetails = Parse.Object.extend("dieseldetails");
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
		$.datepicker.formatDate('dd M yy', new Date(tripDetails[i].filleddate.iso))+
		"</td>"+
		"</td>"+
		"<td>"+
		tripDetails[i].bunkplace+
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
		tripDetails[i].mileage+
		"</td>"+
		"<td>"+
		tripDetails[i].priceperltr+
		"</td>"+
		"<td>"+
		tripDetails[i].totalamt+
		"</td>";
	}
	$('#tripDetailsTableBody').html(htmlContent);
}

var save = function(objectId){
	$('.errorMessage').hide();
	if($('#filleddate').val()===''){
		$('#datepickererror').text('Please enter filled date.');
		document.getElementById('datepickererror').style.display='block';
		return;
	}
	else if($('#bunkplace').val()===''){
		$('#bunkplaceerror').text('Please enter bunk place.');
		document.getElementById('bunkplaceerror').style.display='block';
		return;
	}
	else if($('#startingkm').val()===''){
		$('#startingerror').text('Please enter starting km.');
		document.getElementById('startingerror').style.display='block';
		return;
	}
	else if($('#closingkm').val()===''){
		$('#closingerror').text('Please enter closing km.');
		document.getElementById('closingerror').style.display='block';
		return;
	}
	else if($('#totalkm').val()===''){
		$('#totalerror').text('Please enter starting and closing km.');
		document.getElementById('totalerror').style.display='block';
		return;
	}
	else if($('#passing').val()===''){
		$('#passingerror').text('Please enter passing.');
		document.getElementById('passingerror').style.display='block';
		return;
	}
	else if($('#mileage').val()===''){
		$('#mileageerror').text('Please enter mileage.');
		document.getElementById('mileageerror').style.display='block';
		return;
	}
	else if($('#priceperltr').val()===''){
		$('#priceerror').text('Please enter price per litre.');
		document.getElementById('priceerror').style.display='block';
		return;
	}
	else if($('#totalamt').val()<=0){
		$('#totalamterror').text('Invalid amount.');
		document.getElementById('totalamterror').style.display='block';
		return;
	}
	
	var tripdate = new Date($('#filleddate').val());
	 var bunkplace=$("#bunkplace").val();
	var startingKM = parseInt($('#startingkm').val());
	var closingKM = parseInt($('#closingkm').val());
	var totalKM = parseInt($('#totalkm').val());
	var passing = $('#passing').val();
	var mileageperltr=parseInt($("#mileageperltr").val());
	var amtPerKM = parseInt($('#priceperltr').val());
	var totalAmount = parseInt($('#totalamt').val());

	var TripDetails = Parse.Object.extend("dieseldetails");
	var tripDetails = new TripDetails();
	if(objectId!=''){
		window.alert(objectId);
		tripDetails.set("objectId", objectId);
	}
	tripDetails.set("filleddate", tripdate);
	tripDetails.set("bunkplace",bunkplace);
	tripDetails.set("startingkm", startingKM);
	tripDetails.set("closingkm", closingKM);
	tripDetails.set("totalkm", totalKM);
	tripDetails.set("passing", passing);
	tripDetails.set("mileage",mileageperltr);
	tripDetails.set("priceperltr", amtPerKM);
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

var editTrip = function(objectId){
	$('#requestProgressBlue').show();
	//window.alert('test');
	var TripDetails = Parse.Object.extend("dieseldetails");
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
	$('#exampleModalLongTitle').html('Edit a Fill');
	$('#saveButton').attr('onclick', "save('"+tripDetails[0].id+"')");
	$('#filleddate').val($.datepicker.formatDate('dd/mm/yy', tripDetails[0].get('filleddate')));
	$('#bunkplace').val(tripDetails[0].get('bunkplace'));
	$('#startingkm').val(tripDetails[0].get('startingkm'));
	$('#closingkm').val(tripDetails[0].get('closingkm'));
	$('#totalkm').val(tripDetails[0].get('totalkm'));
	$('#passing').val(tripDetails[0].get('passing'));
	$('#mileageperltr').val(tripDetails[0].get('mileage'));
	$('#priceperltr').val(tripDetails[0].get('priceperltr'));
	$('#totalamt').val(tripDetails[0].get('totalamt'));
}

var deleteTrip = function(objectId){
	$('#requestProgressRed').show();
	var tripDetails = Parse.Object.extend("dieseldetails");
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