/**
 * 
 */

$( document ).ready(function() {
	$(function () {
		  $('#datetimepicker1').datetimepicker();
		});

});

$(this.window).on('hashchange', function() {
	var hash=window.location.hash;
	this.openAddModal();
});

var openAddModal = function (){
	
	$('#addModal').modal('show');
}