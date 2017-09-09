/**
 * 
 */

var init = function() {
	getReminder();
	getTripCount();
	getFCDate();
	getInsuranceDate();
}

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Add Reminder');
	$('#addModal').modal('show');
}

var priorityLevel=function(level){
	$('#priority').val(level);
}

var getTripCount = function(){
	var TripDetails = Parse.Object.extend("tripdetails");
	var query = new Parse.Query(TripDetails);
//	query.equalTo("playerName", "Sean Plott");
	query.count({
	  success: function(count) {
	    // The count request succeeded. Show the count
		  $('#tripcount').html(count);
	  },
	  error: function(error) {
	    // The request failed
	  }
	});
}

var getFCDate = function(){
	var VehicleDetails = Parse.Object.extend("vehicledetails");
	var query = new Parse.Query(VehicleDetails);
	query.descending("fcdate");
	query.limit(1);
	query.find({
	  success: function(vehicledetails) {
	    // The count request succeeded. Show the count
//		  $('#tripcount').html(vehicledetails[0].fcdate);
			$('#fcdate').html($.datepicker.formatDate('dd M yy', vehicledetails[0].get('fcdate')));
	  },
	  error: function(error) {
	    // The request failed
	  }
	});
}

var getInsuranceDate = function(){
	var VehicleDetails = Parse.Object.extend("vehicledetails");
	var query = new Parse.Query(VehicleDetails);
	query.descending("insurancedate");
	query.limit(1);
	query.find({
	  success: function(vehicledetails) {
	    // The count request succeeded. Show the count
//		  $('#tripcount').html(vehicledetails[0].fcdate);
			$('#insurancedate').html($.datepicker.formatDate('dd M yy', vehicledetails[0].get('insurancedate')));
	  },
	  error: function(error) {
	    // The request failed
	  }
	});
}

var getReminder = function(){
	$('#reminderTableBody').html('<tr><td align=\"center\" colspan=\"11\"><div class=\"progress\">'+
			'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
	'</div></td></tr>');

	var reminderClass = Parse.Object.extend("reminder");
	var query = new Parse.Query(reminderClass);
	query.ascending("remindon");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawReminder(json);//[0].objectId);
		},
		error: function(tripDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}


var drawReminder = function(reminder){
	var htmlContent="";
	for (var i = 0; i < reminder.length; i++) {
		var priority=reminder[i].priority;
		if(priority==="Low"){
			priority="table-light";
		}else if(priority==="Normal"){
			priority="table-info";
		}else if(priority==="High"){
			priority="table-danger";
		}else{
			priority="table-light";
		}
		htmlContent+="<tr class=\""+priority+"\">"+
		"<td>"+
		"<button onclick=\"editReminder('"+reminder[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button onclick=\"deleteReminder('"+reminder[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(reminder[i].remindon.iso))+
		"</td>"+
		"</td>"+
		"<td>"+
		reminder[i].reminder+
		"</td>";
	}
	$('#reminderTableBody').html(htmlContent);
}


var save = function(objectId){

	$('.errorMessage').hide();

	if($('#remindon').val()===''){
		$('#remindonerror').text('Please enter reminder date.');
		document.getElementById('datepickererror').style.display='block';
		return;
	}else if($('#reminder').val()===''){
		$('#remindererror').text('Please enter reminder.');
		document.getElementById('srcrouteerror').style.display='block';
		return;
	}
	
	var remindon = new Date($('#remindon').val());
	var reminder = $('#reminder').val()
	var priority = $('#priority').val();

	var ReminderClass = Parse.Object.extend("reminder");
	var reminderClass = new ReminderClass();


	if(objectId!=''){
		reminderClass.set("objectId", objectId);
	}
	reminderClass.set("remindon", remindon);
	reminderClass.set("reminder", reminder);
	reminderClass.set("priority", priority);
	$('#saveButton').html('Saving...');
	reminderClass.save(null, {
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


var editReminder = function(objectId){
	$('#requestProgressBlue').show();
	var reminderClass = Parse.Object.extend("reminder");
	var query = new Parse.Query(reminderClass);
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

var putValuesInModal = function(reminder){
	$('#exampleModalLongTitle').html('Edit Reminder');
	$('#saveButton').attr('onclick', "save('"+reminder[0].id+"')");
	$('#remindon').val($.datepicker.formatDate('mm/dd/yy', reminder[0].get('remindon')));
	$('#reminder').val(reminder[0].get('reminder'));
	$('#priority').val(reminder[0].get('priority'));
}

var deleteReminder = function(objectId){
	var reminderClass = Parse.Object.extend("reminder");
	var query = new Parse.Query(reminderClass);
	query.get(objectId, {
		success: function(reminder) {
			// The object was retrieved successfully.
			reminder.destroy({
				success: function(myObject) {
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