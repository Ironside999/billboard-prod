const express = require('express');
const Chat = require('../../mongooseSchema/chat/ChatSchema');
const Message = require('../../mongooseSchema/message/MessageSchema');
const User = require('../../mongooseSchema/user/UserSchema');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const mongoose = require('mongoose');

const router = new express.Router();

router.post(
  '/api/new/chat',
  userAuth,
  catchAsync(async (req, res, next) => {
    if (!Array.isArray(req.body.users) || !req.body.users?.length) {
      return next(
        new AppError('There should be atleast two user to create a chat', 400)
      );
    }

    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const checkBlockUsers = await User.find({
      _id: {
        $in: req.body.users,
      },
      blockList: { $elemMatch: { $eq: user._id } },
    });

    if (checkBlockUsers.length) {
      return next(new AppError('You are blocked by this user', 404));
    }

    req.body.users.push(user);

    let chatData = {
      users: req.body.users,
      isGroupChat: req.body.users.length > 2 ? true : false,
      chatName: req.body.chatName,
    };

    const chat = await Chat.create(chatData);

    res.status(201).send(chat);
  })
);

router.get(
  '/api/my/chats',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    let chats = await Chat.find({
      users: {
        $elemMatch: {
          $eq: user,
        },
      },
      removers: {
        $nin: [user._id],
      },
      latestMessage: {
        $exists: true,
      },
    })
      .populate('users')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, { path: 'latestMessage.sender' });

    res.status(200).send(chats);
  })
);

router.get(
  '/api/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const chat = await Chat.findOne({
      _id: req.params.id,
      users: { $elemMatch: { $eq: user._id } },
    }).populate('users');

    res.status(200).send(chat);
  })
);

router.patch(
  '/api/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    if (!req.body.chatName)
      return next(new AppError('No chat name to update', 400));

    const chat = await Chat.findByIdAndUpdate(req.params.chatId, {
      chatName: req.body.chatName,
    });
    res.status(200).send();
  })
);

router.get(
  '/api/messages/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const chat = await Chat.findOne({
      _id: req.params.id,
      users: { $elemMatch: { $eq: user._id } },
    })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
        },
      })
      .exec();

    res.send(chat);
  })
);

router.get(
  '/api/mark/chat/as/read/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    await Message.updateMany(
      { chat: req.params.id },
      { $addToSet: { readBy: user._id } }
    );
    res.send();
  })
);

router.delete(
  '/api/remove/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    await Chat.findByIdAndUpdate(req.params.id, {
      $push: {
        removers: user._id,
      },
    });

    res.send();
  })
);

router.get(
  '/api/enter/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('account not found', 404));

    const otherUser = await User.findOne({
      sqlId: req.params.id,
      blockList: { $nin: [user._id] },
    });

    if (!otherUser) return next(new AppError('User not found', 404));

    const chat = await getChatByUserId(user._id, otherUser._id);

    res.send(chat);
  })
);

function getChatByUserId(userLoggedInId, otherUserId) {
  return Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(userLoggedInId),
            },
          },
          {
            $elemMatch: {
              $eq: mongoose.Types.ObjectId(otherUserId),
            },
          },
        ],
      },
    },
    {
      $setOnInsert: {
        users: [userLoggedInId, otherUserId],
      },
    },
    {
      new: true,
      upsert: true,
    }
  ).populate('users');
}

router.get(
  '/api/user/block/list',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const blockedUsers = await User.populate(user, { path: 'blockList' });

    res.send(blockedUsers);
  })
);

router.patch(
  '/api/block/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        users: { $elemMatch: { $eq: user._id } },
        blockedBy: {
          $exists: false,
        },
      },
      { blockedBy: user }
    );

    if (!chat) return next(new AppError('Chat not found', 404));

    const otherUser = chat.users.find(
      (itm) => itm.toString() != user._id.toString()
    );
    user.blockList.push(otherUser);
    await user.save();
    res.send({});
  })
);

router.patch(
  '/api/unblock/chat/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({
      sqlId: req.user.id,
    });

    if (!user) return next(new AppError('User not found', 404));

    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        users: { $elemMatch: { $eq: user._id } },
        blockedBy: user._id,
      },
      {
        $unset: {
          blockedBy: '',
        },
      }
    );

    if (!chat) return next(new AppError('Chat not found', 404));

    const otherUser = chat.users.find(
      (itm) => itm.toString() != user._id.toString()
    );
    user.blockList.pull(otherUser);
    await user.save();

    res.send({});
  })
);

module.exports = router;
