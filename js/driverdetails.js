/**
 * 
 */

var init = function() {
	getDriverDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Add Driver Detail');
	$('#addModal').modal('show');
}

var getDriverDetails = function(){
	$('#driverDetailsTableBody').html('<tr><td align=\"center\" colspan=\"7\"><div class=\"progress\">'+
'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
'</div></td></tr>');

	var driverDetails = Parse.Object.extend("driverdetails");
	var query = new Parse.Query(driverDetails);
	query.ascending("drivername");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawDriverDetails(json);//[0].objectId);
		},
		error: function(driverDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawDriverDetails = function(driverDetails){
	var htmlContent="";
	for (var i = 0; i < driverDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"editDriver('"+driverDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"deleteDriver('"+driverDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		driverDetails[i].drivername+
		"</td>";
	}
	$('#driverDetailsTableBody').html(htmlContent);
}

var save = function(objectId){
	
	$('.errorMessage').hide();

	if($('#drivernname').val()===''){
		$('#drivernameerror').text('Please enter driver name.');
		document.getElementById('drivernameerror').style.display='block';
		return;
	}

	var driverName = $('#drivername').val().trim();

	var DriverDetails = Parse.Object.extend("driverdetails");
	var driverDetails = new DriverDetails();

	if(objectId!=''){
		driverDetails.set("objectId", objectId);
	}
	driverDetails.set("drivername", driverName);
	$('#saveButton').html('Saving...');

	var DriverDetails = Parse.Object.extend("driverdetails");
	var query = new Parse.Query(DriverDetails);
	query.equalTo("drivername", driverName);
	query.find({
		success: function(results) {
			if(results.length>0){	
				$('#saveButton').html('Save Details');
				$('#drivernameerror').text('Driver name already exists.');
				document.getElementById('drivernameerror').style.display='block';
			}
			else{
				executeSave(driverDetails);
			}
		},
		error: function(error) {
			alert("Error: " + error.code + " " + error.message);
		}
	});
	
}

var executeSave = function(driverDetails){
	driverDetails.save(null, {
		success: function(driverDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(driverDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editDriver = function(objectId){
	$('#requestProgressBlue').show();
	var DriverDetails = Parse.Object.extend("driverdetails");
	var query = new Parse.Query(DriverDetails);
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

var putValuesInModal = function(driverDetails){
	$('#exampleModalLongTitle').html('Edit Driver Detail');
	$('#saveButton').attr('onclick', "save('"+driverDetails[0].id+"')");
	var driverName = $('#drivername').val();
	
	$('#drivername').val(driverDetails[0].get('drivername'));
}

var deleteDriver = function(objectId){
	$('#requestProgressRed').show();
	var driverDetails = Parse.Object.extend("driverdetails");
	var query = new Parse.Query(driverDetails);
	query.get(objectId, {
	  success: function(driverDetails) {
	    // The object was retrieved successfully.
		driverDetails.destroy({
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