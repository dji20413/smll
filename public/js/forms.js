// forms.js

$(function() {

	// variable to hold request
	var request;

	$(".connection-remove").click(function(e) {
		e.preventDefault();

		// remove this row after success	
		var div = $(this).parentsUntil('.right').parent();
	
		var request = $.ajax({
			url: $(this).attr('href'),
			type: "delete"
		});

		// callback handler that will be called on success
		request.done(function (response, textStatus, jqXHR) {
			// log a message to the console
			console.log("Hooray, it worked!");
			div.html("<a href='/shop'> Package Shop </a>");
		});

		// callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown){
			// log the error to the console
			console.error("The following error occured: "+ textStatus, errorThrown);
		});

		// callback handler that will be called regardless
		// if the request failed or succeeded
		request.always(function () {
			// reenable the inputs
			//$inputs.prop("disabled", false);
		});

	});

	$("button.device-remove").click(function(ev) {
	
		// remove this row after success	
		var row = $(this).parentsUntil('tr').parent();
	
		var request = $.ajax({
			url: "/device/" + $(this).attr('device_id'),
			type: "delete"
		});

		// callback handler that will be called on success
		request.done(function (response, textStatus, jqXHR) {
			// log a message to the console
			console.log("Hooray, it worked!");
			row.remove();
		});

		// callback handler that will be called on failure
		request.fail(function (jqXHR, textStatus, errorThrown){
			// log the error to the console
			console.error("The following error occured: "+ textStatus, errorThrown);
		});

		// callback handler that will be called regardless
		// if the request failed or succeeded
		request.always(function () {
			// reenable the inputs
			//$inputs.prop("disabled", false);
		});

	});


	var formPackageUpdate = $("form#package-update");
	formPackageUpdate.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formPackageUpdate.find('.errmsg').html(xhr.responseText).show();
		}
	});

	var formDeviceNew = $("form#device-new");
	formDeviceNew.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formDeviceNew.find('.errmsg').html(xhr.responseText).show();
		}
	});

	var formUserUpdate = $("form#user-update");
	formUserUpdate.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formUserUpdate.find('.errmsg').html(xhr.responseText).show();
		}
	});

	
	// create new package
	var formPackageNew = $("form#package-new");
	formPackageNew.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formPackageNew.find('.errmsg').html(xhr.responseText).show();
		}
	});

	// login
	var formSessionNew = $("form#session-new");
	formSessionNew.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formSessionNew.find('.errmsg').html(xhr.responseText).show();
		}
	});

	var formSpeechNew = $("form#speech-new");
	formSpeechNew.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formSpeechNew.find('.errmsg').html(xhr.responseText).show();
		}
	});


	var formSpeechUpdate = $("form#speech-update");
	formSpeechUpdate.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			formSpeechUpdate.find('.errmsg').hide();
			formSpeechUpdate.find('.msg').html(xhr.responseText).show();
		}, 
		"error"   : function(xhr, err) {
			formSpeechUpdate.find('.errmsg').html(xhr.responseText).show();
			formSpeechUpdate.find('.msg').hide();
		}
	});

	var formConnectionNew = $("form#connection-new");
	formConnectionNew.ajaxForm({
		"success" : function(respText, statusText, xhr) {
			window.location.replace( xhr.getResponseHeader('Location') );
		}, 
		"error"   : function(xhr, err) {
			formConnectionNew.find('.errmsg').html(xhr.responseText).show();
		}
	});


	// box

	$(".package-remove").unbind().click( function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		$('#modal-from-dom').unbind().bind('show', function() {
			// fill message
			$(this).find('.modal-body p').text('Do you want to remove this package?');

			// bind button
			var removeBtn = $(this).find('.btn-danger');
			removeBtn.unbind().click( function(e) {
				e.preventDefault();
				$.ajax({type : "delete",url  : url}).done( function(resp, status, xhr) {
					$('#modal-from-dom').modal('hide');
					window.location.replace('/vendor/package');
				});
			});
		}).modal({ backdrop: true });
	});
		

	$(".speech-remove").unbind().click( function(e) {
		e.preventDefault();
		var url = $(this).attr("href");
		$('#modal-from-dom').unbind().bind('show', function() {
			// fill message
			$(this).find('.modal-body p').text('Do you want to remove this speech?');

			// bind button
			var removeBtn = $(this).find('.btn-danger');
			removeBtn.unbind().click( function(e) {
				e.preventDefault();
				$.ajax({type : "delete",url : url}).done( function(resp, status, xhr) {
					$('#modal-from-dom').modal('hide');
					window.location.replace(xhr.getResponseHeader('Location'));
				});
			});
		}).modal({ backdrop: true });
	});

});
