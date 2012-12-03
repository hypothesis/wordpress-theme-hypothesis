$(function() {
  $('.error').hide();
  $('input.text-input').css({backgroundColor:"#FFFFFF"});
  $('.text-input').focus(function(){
    $(this).css({backgroundColor:"#F2F0E3"});
  });
  $('.text-input').blur(function(){
    $(this).css({backgroundColor:"#FFFFFF"});
  });

  $("#contact_form .button").click(function() {
		// validate and process form
		// first hide any error messages
    $('.error').hide();
		
	  var name = $("input#name").val();
		if (name == "") {
      $("label#name_error").show();
      $("input#name").focus();
      return false;
    }
		var contact_email = $("input#contact_email").val();
		if (contact_email == "") {
      $("label#contact_email_error").show();
      $("input#contact_email").focus();
      return false;
    }
		var message = $("textarea#message").val();
		if (message == "") {
      $("label#message_error").show();
      $("textarea#message").focus();
      return false;
    }
		
		var dataString = 'contact=join&name='+ name + '&contact_email=' + contact_email + '&message=' + message;
		//alert (dataString);return false;
		
		$.ajax({
      type: "POST",
      url: "bin/process.php",
      data: dataString,
      success: function(response) {
        $('#contact_form').html("<div id='response'></div>");
        $('#response').html("<h2>Thank you!</h2>")
        .append("<p>We will be in touch soon.</p>")
        .hide()
        .fadeIn(1500);
      }
     });
    return false;
	});

  $("#note_form .button").click(function() {
		// validate and process form
		// first hide any error messages
    $('.error').hide();
		
	  var name = $("input#note_name").val();
		if (name == "") {
      $("label#note_name_error").show();
      $("input#note_name").focus();
      return false;
    }
		var contact_email = $("input#note_email").val();
		if (contact_email == "") {
      $("label#note_email_error").show();
      $("input#note_email").focus();
      return false;
    }
		var message = $("textarea#note_message").val();
		if (message == "") {
      $("label#note_message_error").show();
      $("textarea#note_message").focus();
      return false;
    }
		
		var dataString = 'contact=note&name='+ name + '&contact_email=' + contact_email + '&message=' + message;
		//alert (dataString);return false;
		
		$.ajax({
      type: "POST",
      url: "bin/process.php",
      data: dataString,
      success: function(response) {
        $('#note_form').html("<div id='response'></div>");
        $('#response').html("<h2>Thank you!</h2>")
        .hide()
        .fadeIn(1500);
      }
     });
    return false;
	});
});
runOnLoad(function(){
  //$("input#name").select().focus();
});
