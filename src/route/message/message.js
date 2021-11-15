const express = require('express');
const Chat = require('../../mongooseSchema/chat/ChatSchema');
const Message = require('../../mongooseSchema/message/MessageSchema');
const User = require('../../mongooseSchema/user/UserSchema');
const Notification = require('../../mongooseSchema/notification/NotificationSchema');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');

const router = new express.Router();

router.post(
  '/api/message/new',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const checkChat = await Chat.findOne({
      _id: req.body.chatId,
      users: { $elemMatch: { $eq: user._id } },
      blockedBy: {
        $exists: true,
      },
    });

    if (checkChat) return next(new AppError('Messages are not allowed', 403));

    let newMessage = {
      sender: user._id,
      content: req.body.content,
      chat: req.body.chatId,
      messageType: req.body.messageType || 'text',
      readBy: [user],
    };

    let message = await Message.create(newMessage);

    const chat = await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });

    message = await message.populate('sender').execPopulate();
    message = await message.populate('chat').execPopulate();
    message = await User.populate(message, { path: 'chat.users' });

    await insertNotifications(chat, message);

    res.status(201).send(message);
  })
);

router.get(
  '/api/unread/message/count',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));
    // let countUnreadChats = await Chat.aggregate([
    //   {
    //     $match: {
    //       users: {
    //         $eq: user._id,
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: Message.collection.name,
    //       pipeline: [
    //         {
    //           $match: {
    //             readBy: {
    //               $ne: user._id,
    //             },
    //           },
    //         },
    //         {
    //           $count: 'total',
    //         },
    //       ],
    //       as: 'messages',
    //     },
    //   },
    //   {
    //     $unwind: '$messages',
    //   },
    //   {
    //     $group: {
    //       _id: '$messages',
    //     },
    //   },
    // ]);

    let chats = await Chat.find({
      users: {
        $in: [user._id],
      },
    }).populate('messages');

    let y = 0;

    for (let i = 0; i < chats.length; i++) {
      for (let j = 0; j < chats[i].messages.length; j++) {
        if (!chats[i].messages[j].readBy.includes(user._id.toString())) {
          y++;
        }
      }
    }

    res.send({ unreadMessagesCount: y });
  })
);

async function insertNotifications(chat, message) {
  await Promise.all(
    chat.users.map((userId) => {
      if (userId == message.sender._id.toString()) return;

      Notification.insertNotification(
        userId,
        message.sender._id,
        5,
        'noSql',
        message.chat._id
      );
    })
  );
}

module.exports = router;
