/**
 * 
 */

var init = function() {
	getDriverSalaryDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Add Driver Salary Detail');
	$('#addModal').modal('show');
}

var calculateTotalAmt = function(){
	if(!isNaN($('#salary').val())&&$('#salary').val()!='' && !isNaN($('#advance').val())&&$('#advance').val()!=''){
			$('#balance').val($('#salary').val()-$('#advance').val());
	}
}

var getDriverSalaryDetails = function(){
	$('#driversalaryDetailsTableBody').html('<tr><td align=\"center\" colspan=\"8\"><div class=\"progress\">'+
'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
'</div></td></tr>');

	var driversalaryDetails = Parse.Object.extend("driversalarydetails");
	var query = new Parse.Query(driversalaryDetails);
	query.descending("date");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawDriverSalaryDetails(json);//[0].objectId);
		},
		error: function(driversalaryDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawDriverSalaryDetails = function(driversalaryDetails){
	var htmlContent="";
	for (var i = 0; i < driversalaryDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td>"+
		"<button onclick=\"editVehicle('"+driversalaryDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button onclick=\"deleteVehicle('"+driversalaryDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(driversalaryDetails[i].date.iso))+
		"</td>"+
		"<td>"+
		driversalaryDetails[i].drivername+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(driversalaryDetails[i].changedate.iso))+
		"</td>"+
		"<td>"+
		driversalaryDetails[i].salary+
		"</td>"+
		"<td>"+
		driversalaryDetails[i].advance+
		"</td>"+
		"<td>"+
		driversalaryDetails[i].balance+
		"</td>";
	}
	$('#driversalaryDetailsTableBody').html(htmlContent);
}

var save = function(objectId){
	
	$('.errorMessage').hide();

	if($('#date').val()===''){
		$('#dateerror').text('Please enter valid date');
		document.getElementById('dateerror').style.display='block';
		return;
	}else if($('#drivername').val()===''){
		$('#drivernameerror').text('Please enter driver name.');
		document.getElementById('drivernameerror').style.display='block';
		return;
	}else if($('#changedate').val()===''){
		$('#changedateerror').text('Please enter valid change date.');
		document.getElementById('changedateerror').style.display='block';
		return;
	}else if($('#salary').val()===''){
		$('#salaryerror').text('Please enter salary.');
		document.getElementById('salaryerror').style.display='block';
		return;
	}else if($('#advance').val()===''){
		$('#advanceerror').text('Please enter advance.');
		document.getElementById('advanceerror').style.display='block';
		return;
	}

	var date = new Date($('#date').val());
	var driverName = $('#drivername').val();
	var changeDate = new Date($('#changedate').val());
	var salary = parseInt($('#salary').val());
	var advance = parseInt($('#advance').val());
	var balance = parseInt($('#balance').val());

	var DriverSalaryDetails = Parse.Object.extend("driversalarydetails");
	var driversalaryDetails = new DriverSalaryDetails();

	if(objectId!=''){
		driversalaryDetails.set("objectId", objectId);
	}
	driversalaryDetails.set("date", date);
	driversalaryDetails.set("drivername", driverName);
	driversalaryDetails.set("changedate", changeDate);
	driversalaryDetails.set("salary", salary);
	driversalaryDetails.set("advance", advance);
	driversalaryDetails.set("balance", balance);
	$('#saveButton').html('Saving...');
	driversalaryDetails.save(null, {
		success: function(driversalaryDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(driversalaryDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editVehicle = function(objectId){
	$('#requestProgressBlue').show();
	var DriverSalaryDetails = Parse.Object.extend("driversalarydetails");
	var query = new Parse.Query(DriverSalaryDetails);
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

var putValuesInModal = function(driversalaryDetails){
	$('#exampleModalLongTitle').html('Edit Driver Salary Detail');
	$('#saveButton').attr('onclick', "save('"+driversalaryDetails[0].id+"')");
	
	$('#drivername').val(driversalaryDetails[0].get('drivername'));
	$('#date').val($.datepicker.formatDate('dd/mm/yy', driversalaryDetails[0].get('date')));
	$('#changedate').val($.datepicker.formatDate('dd/mm/yy', driversalaryDetails[0].get('changedate')));
	$('#salary').val(driversalaryDetails[0].get('salary'));
	$('#advance').val(driversalaryDetails[0].get('advance'));
	$('#balance').val(driversalaryDetails[0].get('balance'));
}

var deleteVehicle = function(objectId){
	$('#requestProgressRed').show();
	var driversalaryDetails = Parse.Object.extend("driversalarydetails");
	var query = new Parse.Query(driversalaryDetails);
	query.get(objectId, {
	  success: function(driversalaryDetails) {
	    // The object was retrieved successfully.
		driversalaryDetails.destroy({
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