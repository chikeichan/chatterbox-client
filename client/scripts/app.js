
/* Constants */
UPDATE_INTERVAL = 5000;


/* Globals */
var roomNames = {};


/* App */

var app = {};

app.server = 'https://api.parse.com/1/classes/chatterbox';

app.init = function() {
  $('#main').on('click','.username',function() {
    app.addFriend($(this).text());
  });
  // $('#send .submit').on('submit', function(e) {
  //   console.log(e);
  //   app.handleSubmit($('#message').val());
  //   e.preventDefault();
  //   return false;
  // });
  $('#main').on('submit','#send',function(e) {
    e.preventDefault();
    app.handleSubmit($(this).find('input#message').val());
  });

  // Query server at regular interval for new messages
  setInterval(app.fetch, UPDATE_INTERVAL);

};

app.send = function(message) {
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox?order=-createdAt',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.clearMessages();
      data.results.forEach(app.addMessage);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive message');
    }
  })
};

app.clearMessages = function() {
  $('#chats').empty();
}

app.addMessage = function(message) {
  var $html = $('<div>');
  $html.addClass('message');
  $html.append($('<span class="username">').text(message.username));
  $html.append($('<span class="text">').text(': ' + message.text));
  $('#chats').prepend($html);
  app.addRoom(message.roomname);
};

app.addRoom = function(roomName) {
  if (roomName && typeof roomNames[roomName] === 'undefined') {
    var $html = $('<option>');
    $html.addClass('room');
    $html.attr('value', roomName);
    $html.text(roomName);
    $('#roomSelect').append($html);
    roomNames[roomName] = roomName;
  }
};

app.addFriend = function(friend) {
  console.log('added friend ' + friend);
  return true;
};

app.handleSubmit = function(messageText) {
  var message = {};
  message.username = window.location.search.replace('?username=', '');
  message.text = messageText;
  message.roomname = $('#roomSelect').val();
  app.send(message);
};




/* DOM Ready */

$('document').ready(function() {
  app.init();
});
