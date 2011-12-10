function init() {
  /*===== GLOBALS =====*/

  var total_no_instruments = 8;

  var visual_aid      = $('#metronome .visual_aid');
  var metro_toggle    = $('#metronome .state');
  var metronome       = new Metronome(visual_aid, tempo);
  var tempo           = parseInt($('#metronome .bpm').val());
  var menu_items      = document.getElementById('options').children;
  var instruments     = new Array(total_no_instruments);


  /*===== SOCKETS =====*/


  var socket = io.connect('http://localhost:8080');
  var current_username;

  // on connection to server, ask for user's name with an anonymous callback
  socket.on('connect', function() {
    // set the username
    current_username = prompt("What's your name?");
    $('#user .username').append(current_username)
  	// call the server-side function 'adduser' and send one parameter (value of prompt)
  	socket.emit('adduser', current_username);
  });

  // listener, whenever the server emits 'updatechat', this updates the chat body
  socket.on('updatechat', function(username, data) {
  	$('#conversation ul#stream').append('<li><b>' + username + ':</b> ' + data + '</li>');
  });

  // listener, whenever the server emits 'updateusers', this updates the username list
  socket.on('updateusers', function(data) {
  	$('#connected_users ul').empty();
  	$.each(data, function(key, value) {
  		$('#connected_users ul').append('<li>' + key + '</li>');
  	});
  });


  // listener, whenever the server emits 'sendcreateinstrument', this clicks the instrument
  socket.on('sendcreateinstrument', function(username, instrument_type) {
    var instrument = new Instrument(socket, instrument_type);
    instruments.push(instrument);
  });



  /*===== INTERFACE =====*/

  // on load of page
  $(function() {
  	// when the client clicks SEND
  	$('#datasend').click( function() {
  		var message = $('#data').val();
  		$('#data').val('');
  		// tell server to execute 'sendchat' and send along one parameter
  		socket.emit('sendchat', message);
  	});

  	// when the client hits ENTER on their keyboard
  	$('#data').keypress(function(e) {
  		if(e.which == 13) {
  			$(this).blur();
  			$('#datasend').focus().click();
  		}
  	});

  	// when the client clicks an option
  	$(menu_items).click( function() {
  		socket.emit('createinstrument', this.innerHTML);
  	});
  });


  /*===== METRONOME =====*/

  var metronome = new Metronome(visual_aid, tempo);

  visual_aid.hide();
  metro_toggle.click(function() {
      if (metro_toggle.hasClass('off')) {
           metronome.startClick();
           metro_toggle.addClass('on');
           metro_toggle.removeClass('off');

      } else if (metro_toggle.hasClass('on')) {
          metronome.stopClick();
          metro_toggle.addClass('off');
          metro_toggle.removeClass('on');
      }
  });
}

$(document).ready( function() {
  init();
});