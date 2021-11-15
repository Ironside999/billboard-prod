const { io } = require('../app');
const Score = require('../model/score/score');
const { socketAuth } = require('./socketMiddleware');
const cookieParser = require('cookie-parser');

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

const chatNsp = io.of('/chat');
const onlineNsp = io.of('/online');

onlineNsp.use(wrap(cookieParser()));
onlineNsp.use(socketAuth);

onlineNsp.use(async (socket, next) => {
  try {
    const newScore = await Score.create({
      score: 0,
      scoreType: 1,
      scoreTitle: 10,
      frkUser: socket.mainUser.id,
    });

    socket.score = newScore;

    next();
  } catch (err) {
    return next(new Error('creation error'));
  }
});

chatNsp.on('connection', (socket) => {
  socket.on('setup', (userId) => {
    if (userId) {
      socket.join(userId);
    } else return;
  });

  socket.on('join room', (room) => {
    socket.join(room);
    socket.in(room).emit('join room');
  });
  socket.on('leave room', (room) => {
    socket.leave(room);
    socket.in(room).emit('leave room');
  });

  socket.on('hi there', (userId) => {
    socket.in(userId).emit('hi there');
  });
  socket.on('bye there', (userId) => {
    socket.in(userId).emit('bye there');
  });

  socket.on('typing', (room) => {
    socket.in(room).emit('typing');
  });

  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing');
  });

  socket.on('shut room', (room) => {
    socket.leave(room);
    socket.in(room).emit('shut room');
  });

  socket.on('turn on', (userId) => {
    socket.in(userId).emit('turn on');
  });

  socket.on('new message', (newMessage) => {
    let chat = newMessage && newMessage.chat;
    // if (!Array.isArray(chat?.users) || !chat?.users.length) return;
    if (!chat) return;

    socket.in(chat._id).emit('message received', newMessage);

    // chat.users.forEach((user) => {
    //   if (user?._id == newMessage?.sender?._id) return;
    //   socket.in(user._id).emit('message received', newMessage);
    // });
  });
});

onlineNsp.on('connection', (socket) => {
  let intervalScore;

  socket.once('start', () => {
    intervalScore = setTimeout(async function tick() {
      await socket.score.increment('score');

      intervalScore = setTimeout(tick, 900000);
    }, 900000);
  });

  socket.on('disconnect', async () => {
    if (socket.score.score == 0) {
      await socket.score.destroy();
    }
    clearTimeout(intervalScore);
  });
});
