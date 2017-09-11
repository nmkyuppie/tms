/**
 * 
 */

var init = function() {
	getDieselDetails();
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

var getDieselDetails = function(){
	$('#dieselDetailsTableBody').html('<tr><td align=\"center\" colspan=\"11\"><div class=\"progress\">'+
			'<div class=\"progress-bar progress-bar-striped progress-bar-animated\" role=\"progressbar\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width: 100%\"></div>'+
	'</div></td></tr>');
	var dieselDetails = Parse.Object.extend("dieseldetails");
	var query = new Parse.Query(dieselDetails);

	query.find({
		success: function(data) {
			var json=JSON.parse(JSON.stringify(data));
			drawDieselDetails(json);//[0].objectId);
		},
		error: function(dieselDetails, error) {
			// The object was not refreshed successfully.
			// error is a Parse.Error with an error code and message.
		}
	});
}

var drawDieselDetails = function(dieselDetails){
	var htmlContent="";
	for (var i = 0; i < dieselDetails.length; i++) {
		htmlContent+="<tr>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"editDiesel('"+dieselDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-primary float-left\" style=\"margin-right: 10px;\">"+
		"<i class=\"material-icons md-18\">mode_edit</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		"<button onclick=\"deleteDiesel('"+dieselDetails[i].objectId+"')\" type=\"button\" class=\"btn btn-sm btn-danger float-left\">"+
		"<i class=\"material-icons md-18\">delete</i>"+
		"</button>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		$.datepicker.formatDate('dd M yy', new Date(dieselDetails[i].filleddate.iso))+
		"</td>"+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].bunkplace+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].startingkm+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].closingkm+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].totalkm+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].passing+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].mileage+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].priceperltr+
		"</td>"+
		"<td class='text-nowrap'>"+
		dieselDetails[i].totalamt+
		"</td>";
	}
	$('#dieselDetailsTableBody').html(htmlContent);
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
	else if($('#totalkm').val()<=0){
		$('#totalerror').text('Please enter valid starting and closing km.');
		document.getElementById('totalerror').style.display='block';
		return;
	}
	else if($('#passing').val()===''){
		$('#passingerror').text('Please enter passing.');
		document.getElementById('passingerror').style.display='block';
		return;
	}
	else if($('#mileageperltr').val()===''){
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

	var DieselDetails = Parse.Object.extend("dieseldetails");
	var dieselDetails = new DieselDetails();
	if(objectId!=''){
		dieselDetails.set("objectId", objectId);
	}
	dieselDetails.set("filleddate", tripdate);
	dieselDetails.set("bunkplace",bunkplace);
	dieselDetails.set("startingkm", startingKM);
	dieselDetails.set("closingkm", closingKM);
	dieselDetails.set("totalkm", totalKM);
	dieselDetails.set("passing", passing);
	dieselDetails.set("mileage",mileageperltr);
	dieselDetails.set("priceperltr", amtPerKM);
	dieselDetails.set("totalamt", totalAmount);
	$('#saveButton').html('Saving...');

	dieselDetails.save(null, {
		success: function(dieselDetails) {
			// Execute any logic that should take place after the object is saved.
			window.location.reload();
		},
		error: function(dieselDetails, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			alert('Failed to create new object, with error code: ' + error.message);
		}
	});
}

var editDiesel = function(objectId){
	$('#requestProgressBlue').show();
	var DieselDetails = Parse.Object.extend("dieseldetails");
	var query = new Parse.Query(DieselDetails);
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

var putValuesInModal = function(dieselDetails){
	$('#exampleModalLongTitle').html('Edit a Fill');
	$('#saveButton').attr('onclick', "save('"+dieselDetails[0].id+"')");
	$('#filleddate').val($.datepicker.formatDate('dd/mm/yy', dieselDetails[0].get('filleddate')));
	$('#bunkplace').val(dieselDetails[0].get('bunkplace'));
	$('#startingkm').val(dieselDetails[0].get('startingkm'));
	$('#closingkm').val(dieselDetails[0].get('closingkm'));
	$('#totalkm').val(dieselDetails[0].get('totalkm'));
	$('#passing').val(dieselDetails[0].get('passing'));
	$('#mileageperltr').val(dieselDetails[0].get('mileage'));
	$('#priceperltr').val(dieselDetails[0].get('priceperltr'));
	$('#totalamt').val(dieselDetails[0].get('totalamt'));
}

var deleteDiesel = function(objectId){
	$('#requestProgressRed').show();
	var dieselDetails = Parse.Object.extend("dieseldetails");
	var query = new Parse.Query(dieselDetails);
	query.get(objectId, {
		success: function(dieselDetails) {
			// The object was retrieved successfully.
			dieselDetails.destroy({
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