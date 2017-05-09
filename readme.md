### Node Chatrooms
----
This project is a practice for [Socket.io](https://socket.io) base on [NodeJS](https://nodejs.org/en/).

- A realtime chatroom
- Supports separate room

```
npm install

nodemon server/server.js
```

Basically, I followed the tutorial on "[Get Started: Chat application](https://socket.io/get-started/chat/)" by Socket.io.
I learned how to launch a NodeJs server, listen the port and emit events by using its API.

I also followed a tutorial "[The Complete Node.js Developer Course](https://www.udemy.com/the-complete-nodejs-developer-course-2/learn/v4/overview)" by Andrew Mead and Rob Percival in udemy.
Most of the nice features are from this tutorials as well.
1) Users' list / separate rooms
2) The structure of HTML and CSS
3) Validation -- function isRealString()
4) Time format -- moment
5) Listen and get the users' typing text by jQuery

Base on above tutorials, I create two functions which are not in the tutorials.
1)  A function can listen if client side is typing message. If so, the server side can emit the event to the client.
2)  A function can prevent that a user types the same sentences in the recent 2 times typing.

The app was deployed to Heroku.

Demo: [https://tranquil-thicket-77425.herokuapp.com/](https://tranquil-thicket-77425.herokuapp.com)
