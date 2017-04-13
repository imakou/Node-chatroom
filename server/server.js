const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const {Users} = require('./utils/users');
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// this funcion follows 
// The original tutorial 
// "The Complete Node.js Developer Course" by Andrew Mead and Rob Percival.
io.on('connection', (socket) => {
  console.log('A new user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    console.log(`${params.name} joins room - ${params.room}`);
    users.addUser(socket.id, params.name, params.room);
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
      }else{
         io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
         temp_name = user.name;
         temp_text = msg.text
      }
      
      console.log(`${user.name}: ${msg.text}`);
    }
    callback();
  });


  socket.on('disconnect', () => {
    console.log("GooD Bye!");
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