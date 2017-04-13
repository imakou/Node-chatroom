var socket = io();


// this funcion follows 
// The original tutorial 
// "The Complete Node.js Developer Course" by Andrew Mead and Rob Percival.

function scrollToBottom () {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

// this funcion follows 
// The original tutorial 
// "The Complete Node.js Developer Course" by Andrew Mead and Rob Percival.
socket.on('connect', function () {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});

// this funcion follows 
// The original tutorial 
// "The Complete Node.js Developer Course" by Andrew Mead and Rob Percival.

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

// this funcion follows 
// The original tutorial 
// "The Complete Node.js Developer Course" by Andrew Mead and Rob Percival.

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var params = jQuery.deparam(window.location.search);

  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });

});

// Ruei-Pu adds User Typing function

jQuery('[name=message]').on('keypress', function (e) {
  var params = jQuery.deparam(window.location.search);
  socket.emit('UserTyping', params, true);

  if(e.which == 13){ // 13 = Enter
    socket.emit('UserTyping', params, false);
  }
});

// Ruei-Pu adds User Typing function
socket.on('UserIsTyping', function (message) {
  var template = jQuery('#message-template__typing').html();
  var html = Mustache.render(template, {
    text: "is typing...",
    from: message.from
  });

  if(message.isTyping){
    jQuery('.typing__list').html(html);
  }else{
    jQuery('.typing__list').html('');
  }

  scrollToBottom();
});

// Ruei-Pu adds that the same message prevent function
socket.on('sameMessage', function () {
  var template = jQuery('#message-template__same_msg').html();
  var html = Mustache.render(template);
  jQuery('#messages').append(html);
  scrollToBottom();
});