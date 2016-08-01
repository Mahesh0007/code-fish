(function(exports) {

var socket = io();


var currentUser;
var user2;

$('#page-layout').html($('#homepage-template').html());
socket.on('current user', function(data) {
  currentUser = data.user;
  $('#help-button').click(function() {
    if (currentUser) {
      $('#page-layout').html($('#new-help-request-template').html());

    $('#help-request-form').submit(function(e) {
      e.preventDefault();
      socket.emit('host room', { requestDescription: $('#request-description').val() });
      $('#page-layout').html($('#loading-template').html());
    });
  } else {
  console.log('Please sign in');
   }
  });
  $('body').on('click', '.join-button', function() {
    if (data.user) {
      socket.emit('join room', {roomID: $(this).text()});
      $('#page-layout').html($('#chat-template').html());
    } else {
      console.log('Please sign in to join room');
    }

  });
});


socket.on('update available rooms', function(data) {
  $('#join-rooms').empty();
  if (data.rooms.length > 0) {
    for (var i = 0 ; i < data.rooms.length ; i++) {
      $('#join-rooms').append('<button class="join-button">' + data.rooms[i] + '</button>');
    }
  }
  else {
    $('#join-rooms').html('<h4>There are currently no live requests</h4>');
  }
});

socket.on('new room', function(){
  $('#page-layout').html($('#loading-template').html());
});



socket.on('person joined', function(data){
  $('#page-layout').html($('#chat-template').html());
  $('#chatbox').submit(function(e){
    e.preventDefault();
    socket.emit('chat message', { roomID: data.roomID, message: $('#m').val(), username: currentUser.username});
    $('#m').val('');
  });

  socket.on('chat message', function(data){
    if (data.username === currentUser.username) {
      $('#messages').append($('<li class="current-user-message">').html( '<span class="username">' + data.username + '</span>: ' + data.message));
    } else {
      $('#messages').append($('<li class="responding-user-message">').html( '<span class="username">' + data.username + '</span>: ' + data.message));
    }
  });
});

exports.socket = socket;
})(this);
