/**
 * 
 */

var init = function() {
	getVehicleMaintenanceDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Add Vehicle Maintenance Detail');
	$('#addModal').modal('show');
}

var getVehicleMaintenanceDetails = function(){
	$('#vehicleMaintenanceDetailsTableBody').html('<tr><td align=\"center\" colspan=\"7\"><div class=\"progress\">'+
'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
'</div></td></tr>');

	var vehicleMaintenanceDetails = Parse.Object.extend("vehiclemaintenance");
	var query = new Parse.Query(vehicleMaintenanceDetails);
	query.descending("date");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawVehicleMaintenanceDetails(json);//[0].objectId);
		},
		error: function(vehicleMaintenanceDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawVehicleMaintenanceDetails = function(vehicleMaintenanceDetails){
	var htmlContent="";
	for (var i = 0; i < vehicleMaintenanceDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"editVehicleMaintenance('"+vehicleMaintenanceDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"deleteVehicleMaintenance('"+vehicleMaintenanceDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		$.datepicker.formatDate('dd M yy', new Date(vehicleMaintenanceDetails[i].date.iso))+
		"</td>"+
		"<td class='text-nowrap'>"+
		vehicleMaintenanceDetails[i].vehiclenumber+
		"</td>"+
		"<td class='text-nowrap'>"+
		vehicleMaintenanceDetails[i].servicetype+
		"</td>"+
		"<td class='text-nowrap'>"+
		vehicleMaintenanceDetails[i].servicefor+
		"</td>"+
		"<td class='text-nowrap'>"+
		vehicleMaintenanceDetails[i].amount+
		"</td></tr>";
	}
	$('#vehicleMaintenanceDetailsTableBody').html(htmlContent);
}

var save = function(objectId){
	
	$('.errorMessage').hide();

	if($('#date').val()===''){
		$('#dateerror').text('Please enter date.');
		document.getElementById('dateerror').style.display='block';
		return;
	}else if($('#vehiclenumber').val()===''){
		$('#vehiclenumbererror').text('Please enter vehicle number.');
		document.getElementById('vehiclenumbererror').style.display='block';
		return;
	}else if($('#servicetype').val()===''){
		$('#servicetypeerror').text('Please enter service type.');
		document.getElementById('servicetypeerror').style.display='block';
		return;
	}else if($('#servicefor').val()===''){
		$('#serviceforerror').text('Please enter service for.');
		document.getElementById('serviceforerror').style.display='block';
		return;
	}else if($('#amount').val()<=0){
		$('#amounterror').text('Please enter valid amount.');
		document.getElementById('amounterror').style.display='block';
		return;
	}

	var date = new Date($('#date').val());
	var vehicleNumber = $('#vehiclenumber').val();
	var serviceType = $('#servicetype').val();
	var serviceFor = $('#servicefor').val();
	var amount = $('#amount').val();

	var VehicleMaintenanceDetails = Parse.Object.extend("vehiclemaintenance");
	var vehicleMaintenanceDetails = new VehicleMaintenanceDetails();

	if(objectId!=''){
		vehicleMaintenanceDetails.set("objectId", objectId);
	}
	vehicleMaintenanceDetails.set("vehiclenumber", vehicleNumber);
	vehicleMaintenanceDetails.set("date", date);
	vehicleMaintenanceDetails.set("servicetype", serviceType);
	vehicleMaintenanceDetails.set("servicefor", serviceFor);
	vehicleMaintenanceDetails.set("amount", amount);
	$('#saveButton').html('Saving...');
	vehicleMaintenanceDetails.save(null, {
		success: function(vehicleMaintenanceDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(vehicleMaintenanceDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editVehicleMaintenance = function(objectId){
	$('#requestProgressBlue').show();
	var VehicleMaintenanceDetails = Parse.Object.extend("vehiclemaintenance");
	var query = new Parse.Query(VehicleMaintenanceDetails);
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

var putValuesInModal = function(vehicleMaintenanceDetails){
	$('#exampleModalLongTitle').html('Edit Vehicle Maintenance Detail');
	$('#saveButton').attr('onclick', "save('"+vehicleMaintenanceDetails[0].id+"')");
	
	$('#vehiclenumber').val(vehicleMaintenanceDetails[0].get('vehiclenumber'));
	$('#date').val($.datepicker.formatDate('mm/dd/yy', vehicleMaintenanceDetails[0].get('date')));
	$('#servicetype').val(vehicleMaintenanceDetails[0].get('servicetype'));
	$('#servicefor').val(vehicleMaintenanceDetails[0].get('servicefor'));
	$('#amount').val(vehicleMaintenanceDetails[0].get('amount'));
}

var deleteVehicleMaintenance = function(objectId){
	$('#requestProgressRed').show();
	var vehicleMaintenanceDetails = Parse.Object.extend("vehiclemaintenance");
	var query = new Parse.Query(vehicleMaintenanceDetails);
	query.get(objectId, {
	  success: function(vehicleMaintenanceDetails) {
	    // The object was retrieved successfully.
		vehicleMaintenanceDetails.destroy({
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