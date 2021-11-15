const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
  {
    userTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notificationType: {
      type: Number,
      required: true,
      // 1 follow, 2 unfollow, 3 postComment, 4 postLike, 5 message, 6 commentLike
    },
    opened: { type: Boolean, default: false },
    entityId: {
      type: String,
    },
    notificationCategory: {
      type: String,
      required: true,
      enum: ['sql', 'noSql'],
    },
  },
  { timestamps: true }
);

NotificationSchema.statics.insertNotification = async (
  userTo,
  userFrom,
  notificationType,
  notificationCategory,
  id
) => {
  let data = {
    userTo,
    userFrom,
    notificationType,
    notificationCategory,
    entityId: id,
  };
  await Notification.deleteOne(data).catch((error) => console.log(error));
  return Notification.create(data).catch((error) => console.log(error));
};

const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = Notification;
