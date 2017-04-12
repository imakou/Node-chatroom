const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {Users} = require('./utils/users');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
    callback();
  });


  // Ruei-Pu adds that same msg prevent function
  var temp_name = '';
  var temp_text = '';

  socket.on('createMessage', (msg, callback) => {
    var user = users.getUser(socket.id);

    if (user && isRealString(msg.text)) {
      // Ruei-Pu adds that same msg prevent function
      if(temp_name == user.name && temp_text == msg.text){
         socket.emit('sameMessage', true);        
         console.log("Hi");
      }else{
         io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
         temp_name = user.name;
         temp_text = msg.text
        console.log("Bye");
      }
      
      console.log(`${user.name}: ${msg.text}`);
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));  
    }
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

  // Ruei-Pu added UserTyping feature
  socket.on('UserTyping', (params, isTyping)=>{
    var user = users.getUser(socket.id);
    socket.broadcast.to(params.room).emit('UserIsTyping', {from: user.name, isTyping});
  });
  //

});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
