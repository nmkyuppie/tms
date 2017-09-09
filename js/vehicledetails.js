/**
 * 
 */

var init = function() {
	getVehicleDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Add Vehicle Detail');
	$('#addModal').modal('show');
}

var getVehicleDetails = function(){
	$('#vehicleDetailsTableBody').html('<tr><td align=\"center\" colspan=\"7\"><div class=\"progress\">'+
'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
'</div></td></tr>');

	var vehicleDetails = Parse.Object.extend("vehicledetails");
	var query = new Parse.Query(vehicleDetails);
	query.ascending("insurancedate");
	query.ascending("fcdate");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawVehicleDetails(json);//[0].objectId);
		},
		error: function(vehicleDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawVehicleDetails = function(vehicleDetails){
	var htmlContent="";
	for (var i = 0; i < vehicleDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td>"+
		"<button onclick=\"editVehicle('"+vehicleDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button onclick=\"deleteVehicle('"+vehicleDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		vehicleDetails[i].vehiclenumber+
		"</td>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(vehicleDetails[i].fcdate.iso))+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(vehicleDetails[i].insurancedate.iso))+
		"</td>"+
		"<td>"+
		vehicleDetails[i].quartertax+
		"</td>"+
		"<td>"+
		vehicleDetails[i].nptax+
		"</td>";
	}
	$('#vehicleDetailsTableBody').html(htmlContent);
}

var save = function(objectId){
	
	$('.errorMessage').hide();

	if($('#vehiclenumber').val()===''){
		$('#vehiclenumbererror').text('Please enter vehicle number.');
		document.getElementById('vehiclenumbererror').style.display='block';
		return;
	}else if($('#fcdate').val()===''){
		$('#fcdateerror').text('Please enter valid fc date.');
		document.getElementById('fcdateerror').style.display='block';
		return;
	}else if($('#insurancedate').val()===''){
		$('#insurancedateerror').text('Please enter valid insurance date.');
		document.getElementById('insurancedateerror').style.display='block';
		return;
	}else if($('#quartertax').val()===''){
		$('#quartertaxerror').text('Please enter Quarter tax.');
		document.getElementById('quartertaxerror').style.display='block';
		return;
	}else if($('#nptax').val()===''){
		$('#nptaxerror').text('Please enter NP tax.');
		document.getElementById('nptaxerror').style.display='block';
		return;
	}

	var vehicleNumber = $('#vehiclenumber').val();
	var fcdate = new Date($('#fcdate').val());
	var insuranceDate = new Date($('#insurancedate').val());
	var quarterTax = $('#quartertax').val();
	var npTax = $('#nptax').val();

	var VehicleDetails = Parse.Object.extend("vehicledetails");
	var vehicleDetails = new VehicleDetails();

	if(objectId!=''){
		vehicleDetails.set("objectId", objectId);
	}
	vehicleDetails.set("vehiclenumber", vehicleNumber);
	vehicleDetails.set("fcdate", fcdate);
	vehicleDetails.set("insurancedate", insuranceDate);
	vehicleDetails.set("quartertax", quarterTax);
	vehicleDetails.set("nptax", npTax);
	$('#saveButton').html('Saving...');
	vehicleDetails.save(null, {
		success: function(vehicleDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(vehicleDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editVehicle = function(objectId){
	$('#requestProgressBlue').show();
	var VehicleDetails = Parse.Object.extend("vehicledetails");
	var query = new Parse.Query(VehicleDetails);
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

var putValuesInModal = function(vehicleDetails){
	$('#exampleModalLongTitle').html('Edit Vehicle Detail');
	$('#saveButton').attr('onclick', "save('"+vehicleDetails[0].id+"')");
	var vehicleNumber = $('#vehiclenumber').val();
	var fcdate = new Date($('#fcdate').val());
	var insuranceDate = new Date($('#insurancedate').val());
	var quarterTax = $('#quartertax').val();
	var npTax = parseInt($('#nptax').val());
	
	$('#vehiclenumber').val(vehicleDetails[0].get('vehiclenumber'));
	$('#fcdate').val($.datepicker.formatDate('mm/dd/yy', vehicleDetails[0].get('fcdate')));
	$('#insurancedate').val($.datepicker.formatDate('mm/dd/yy', vehicleDetails[0].get('insurancedate')));
	$('#quartertax').val(vehicleDetails[0].get('quartertax'));
	$('#nptax').val(vehicleDetails[0].get('nptax'));
}

var deleteVehicle = function(objectId){
	$('#requestProgressRed').show();
	var vehicleDetails = Parse.Object.extend("vehicledetails");
	var query = new Parse.Query(vehicleDetails);
	query.get(objectId, {
	  success: function(vehicleDetails) {
	    // The object was retrieved successfully.
		vehicleDetails.destroy({
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