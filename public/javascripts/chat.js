function Chat() {
  var element     = document.getElementById('chat');
  var stream      = $("<ul id=\"stream\"></ul>");
  var message_box = $("<input id=\"message\" />");
	var send_button = $("<input type=\"button\" id=\"send_button\" value=\"send\" />");
	
	$(element).append(user_input, send_button, stream);
}