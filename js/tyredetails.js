/**
 * 
 */

var init = function() {
	getTyreDetails();
}

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	if(hash==='#add')
		this.openAddModal();
	window.location.hash='';
});

var openAddModal = function (){
	$('#exampleModalLongTitle').html('Tyre Details');
	$('#addModal').modal('show');
}



var getTyreDetails = function(){
	$('#tyreDetailsTableBody').html('<tr><td align=\"center\" colspan=\"11\"><div class=\"progress\">'+
			'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
	'</div></td></tr>');

	var tyreDetails = Parse.Object.extend("tyredetails");
	var query = new Parse.Query(tyreDetails);
	query.descending("date");
	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawTyreDetails(json);//[0].objectId);
		},
		error: function(tyreDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawTyreDetails = function(tyreDetails){
	var htmlContent="";
	for (var i = 0; i < tyreDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td>"+
		"<button onclick=\"editTyre('"+tyreDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		"<button onclick=\"deleteTyre('"+tyreDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td>"+
		$.datepicker.formatDate('dd M yy', new Date(tyreDetails[i].date.iso))+
		"</td>"+
		"</td>"+
		"<td>"+
		tyreDetails[i].tyrenumber+
		"</td>"+
		"<td>"+
		tyreDetails[i].tyremake+
		"</td>"+
		"<td>"+
		tyreDetails[i].vehiclenumber+
		"</td>"+
		"<td>"+
		tyreDetails[i].km+
		"</td>"+
		"<td>"+
		tyreDetails[i].runningkm+
		"</td>"+
		"<td>"+
		tyreDetails[i].fittingtype+
		"</td>"
		
	}
	$('#tyreDetailsTableBody').html(htmlContent);
}

var save = function(objectId){

	$('.errorMessage').hide();

	if($('#datepicker').val()===''){
		$('#datepickererror').text('Please enter date.');
		document.getElementById('datepickererror').style.display='block';
		return;
	}else if($('#tyrenumber').val()===''){
		$('#tyreerror').text('Please enter tyre number.');
		document.getElementById('tyreerror').style.display='block';
		return;
	}else if($('#tyremake').val()===''){
		$('#makeerror').text('Please enter tyre make.');
		document.getElementById('makeerror').style.display='block';
		return;
	}else if($('#vechileno').val()===''){
		$('#vehicleerror').text('Please enter start vechile no.');
		document.getElementById('vehicleerror').style.display='block';
		return;
	}else if($('#km').val()===''){
		$('#kmerror').text('Please enter  km.');
		document.getElementById('kmerror').style.display='block';
		return;
	}else if($('#running').val()<=0){
		$('#runningerror').text('Please enter running.');
		document.getElementById('runningerror').style.display='block';
		return;
	}else if($('#fitting').val()===''){
		$('#fittingerror').text('Please enter Fitting Type.');
		document.getElementById('fittingerror').style.display='block';
		return;
	}
	var tyredate = new Date($('#datepicker').val());
	var tyrenumber = $('#tyrenumber').val()
	var tyremake = $('#tyremake').val();
	var vechileno = $('#vechileno').val();
	var km = parseInt($('#km').val());
	var running = parseInt($('#running').val());
	var fitting = $('#fitting').val();
	


	var TyreDetails = Parse.Object.extend("tyredetails");
	var tyreDetails = new TyreDetails();


	if(objectId!=''){
		tyreDetails.set("objectId", objectId);
	}
	tyreDetails.set("date", tyredate);
	tyreDetails.set("tyrenumber", tyrenumber);
	tyreDetails.set("tyremake", tyremake);
	tyreDetails.set("vehiclenumber", vechileno);
	tyreDetails.set("km", km);
	tyreDetails.set("runningkm", running);
	tyreDetails.set("fittingtype", fitting);
	
	$('#saveButton').html('Saving...');
	tyreDetails.save(null, {
		success: function(tyreDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(tyreDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editTyre = function(objectId){
	$('#requestProgressBlue').show();
	var TyreDetails = Parse.Object.extend("tyredetails");
	var query = new Parse.Query(TyreDetails);
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


var putValuesInModal = function(tyreDetails){
	$('#exampleModalLongTitle').html('Edit Tyre Details');
	$('#saveButton').attr('onclick', "save('"+tyreDetails[0].id+"')");
	$('#datepicker').val($.datepicker.formatDate('mm/dd/yy', tyreDetails[0].get('date')));
	$('#tyrenumber').val(tyreDetails[0].get('tyrenumber'));
	$('#tyremake').val(tyreDetails[0].get('tyremake'));
	$('#vechileno').val(tyreDetails[0].get('vehiclenumber'));
	$('#km').val(tyreDetails[0].get('km'));
	$('#running').val(tyreDetails[0].get('runningkm'));
	$('#fitting').val(tyreDetails[0].get('fittingtype'));

}

var deleteTyre = function(objectId){
	$('#requestProgressRed').show();
	var tyreDetails = Parse.Object.extend("tyredetails");
	var query = new Parse.Query(tyreDetails);
	query.get(objectId, {
		success: function(tyreDetails) {
			// The object was retrieved successfully.
			tyreDetails.destroy({
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