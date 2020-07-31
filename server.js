const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(express.json()); // посредник, парсит json-данные express-приложения

const rooms = new Map(); // вместо базы данных

app.get('/rooms/:id', (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId) 
  ? {
      users: [...rooms.get(roomId).get('users').values()],
      messages: [...rooms.get(roomId).get('messages').values()],
    } 
  : { users: [], messages: [] };
  res.json(obj);
});

app.post('/rooms', (req, res) => {
  const { roomId, userName } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId, 
      new Map([
        ['users', new Map()],
        ['messages', []],
      ]),
    );
  }
  res.json([...rooms.keys()]);
});

io.on('connection', (socket) => {
  socket.on('ROOM:JOIN', ({ roomId }) => {
    socket.join(roomId);
    rooms.get(roomId).get('users').set(socket.id, userName);
    const users = [...rooms.get(roomId).get('users').values()];
    socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
  });

  socket.on('ROOM:NEW_MESSAGE', ({ roomId, userName, text }) => {
    const messageBody = {
      userName,
      text
    };
    rooms.get(roomId).get('messages').push(messageBody);
    socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGE', messageBody);
  });

  socket.on('disconnect', () => {
    rooms.forEach((value, roomId) => {
      if (value.get('users').delete(socket.id)) {
        const users = [...value.get('users').values()];
        socket.to(roomId).broadcast.emit('ROOM:SET_USERS', users);
      }
    });
  });

  console.log('user connected', socket.id);
})

server.listen(3000, (err) => {
  if (err) {
    throw Error(err);
  }
  console.log('Сервер запущен!');
});