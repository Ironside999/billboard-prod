const jwt = require('jsonwebtoken');
const User = require('../model/user/user');

const socketAuth = (socket, next) => {
  const { jWt } = socket.request.cookies;
  if (!jWt) {
    return next(new Error('no token'));
  }

  jwt.verify(jWt, process.env.USER_SECRET, async (err, decode) => {
    if (err) {
      return next(new Error('invalid token'));
    }
    try {
      const user = await User.findOne({
        where: { id: decode.id, active: 1 },
      });
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.mainUser = user;
      next();
    } catch (err) {
      return next(new Error('server error'));
    }
  });
};

module.exports = { socketAuth };
