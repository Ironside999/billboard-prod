const { DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../../db/db');
const AppError = require('../../appError/appError');
const validator = require('validator');
const generateRandomCode = require('../../util/randomCode');
const Score = require('../score/score');
const Balance = require('../balance/balance');
const Note = require('../note/note');
const Favorite = require('../favorite/favorite');
const UserNetwork = require('../userNetwork/userNetwork');
const Transaction = require('../transaction/transaction');
const Ad = require('../ads/ad');
const BillboardFinder = require('../billboardFinder/billboardFinder');
const VirtualBbdCalender = require('../virtualBillboard/virtualBillboardCalendar');
const Violation = require('../violation/violation');
const Comment = require('../comment/comment');
const Invite = require('./../Invite/Invite');
const Ticket = require('../ticket/ticket');
const VirtualBillboardReq = require('../virtualBillboard/VirtualBillboardRequest');
const BbdFinderComment = require('../billboardFinder/bbdFinderComment');
const InformationBank = require('../informationBank/informationBank');
const InfoBankExperience = require('../../model/informationBank/infoBankUserExperience');
const InfoBankComment = require('../../model/informationBank/infoBankComment');
const QAInfoBank = require('../../model/informationBank/infoBankQ&A');


class User extends Model {
  static async findByCredentials(username, password) {
    const user = await User.findOne({ where: { username, active: 1 } });
    if (!user) throw new AppError('USER NOT FOUND', 404);
    const checkPw = await bcrypt.compare(password, user.password);
    if (!checkPw) throw new AppError('WRONG PASSWORD', 400);

    return user;
  }

  static async findByEmail(email, password) {
    const user = await User.findOne({ where: { email, active: 1 } });
    if (!user) throw new AppError('USER NOT FOUND', 404);
    const checkPw = await bcrypt.compare(password, user.password);
    if (!checkPw) throw new AppError('WRONG PASSWORD', 400);

    return user;
  }

  static async findByMobile(mobile, password) {
    const user = await User.findOne({ where: { mobile, active: 1 } });
    if (!user) throw new AppError('USER NOT FOUND', 404);
    const checkPw = await bcrypt.compare(password, user.password);
    if (!checkPw) throw new AppError('WRONG PASSWORD', 400);

    return user;
  }

  toJSON() {
    const user = { ...this.dataValues };

    delete user.password;
    delete user.mobileGeneratedCode;
    delete user.emailGeneratedCode;
    delete user.passwordResetToken;

    return user;
  }

  async generateAuthToken() {
    const token = await jwt.sign({ id: this.id }, process.env.USER_SECRET, {
      expiresIn: '1 days',
    });

    return token;
  }

  isEmailCodeMatch(any) {
    const code = this.emailGeneratedCode === any;
    const exp = this.emailExpireTime > Date.now();

    return code && exp ? true : false;
  }

  isMobileCodeMatch(any) {
    const code = this.mobileGeneratedCode === any;
    const exp = this.mobileExpireTime > Date.now();

    return code && exp ? true : false;
  }

  async createPasswordResetToken() {
    const resetToken = await generateRandomCode(3);

    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.passwordResetExp = Date.now() + 900000;

    return resetToken;
  }
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: 'username',
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        async checkUnique(val) {
          const usr = await User.findOne({
            where: { email: val, active: 1 },
          });
          if (usr) throw new AppError('Email Should Be Unique', 400);
        },
      },
    },
    mobile: {
      type: DataTypes.STRING,
      validate: {
        checkMobileNum(val) {
          if (!validator.isMobilePhone(val, ['fa-IR'])) {
            throw new AppError('Wrong Mobile Number', 400);
          }
        },
        async checkUnique(val) {
          const usr = await User.findOne({
            where: { mobile: val, active: 1 },
          });
          if (usr) throw new AppError('Mobile Should Be Unique', 400);
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if (val.length >= 8 && !val.toLowerCase().includes('password')) {
          const hashedPw = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPw);
        } else {
          throw new AppError('BAD PASSWORD', 400);
        }
      },
    },
    active: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      // deleted user 0 ,,, available user 1
    },
    isRestricted: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      // restricted user 0 ,,, free user 1
    },
    userType: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      allowNull: false,
      // 1 normal, 2 vip, 3 super vip
    },
    image: {
      type: DataTypes.STRING,
    },
    emailVerified: {
      type: DataTypes.TINYINT,
    },
    emailGeneratedCode: {
      type: DataTypes.STRING,
    },
    emailExpireTime: {
      type: DataTypes.DATE,
    },
    mobileVerified: {
      type: DataTypes.TINYINT,
    },
    mobileGeneratedCode: {
      type: DataTypes.STRING,
    },
    mobileExpireTime: {
      type: DataTypes.DATE,
    },
    passwordResetToken: {
      type: DataTypes.STRING,
    },
    passwordResetExp: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

User.hasOne(Balance, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
});

Balance.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
});

User.hasMany(Score, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Score.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(Note, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Note.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(Favorite, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Favorite.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasOne(UserNetwork, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
});

UserNetwork.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
    unique: true,
  },
});

User.hasMany(Transaction, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Transaction.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(Ad, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ad.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(Comment, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Comment.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(BillboardFinder, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

BillboardFinder.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(VirtualBbdCalender, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

VirtualBbdCalender.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(Violation, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Violation.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

//RESUME

User.hasOne(Invite, {
  foreignKey: {
    name: 'frkUser',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});
Invite.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    type: DataTypes.BIGINT,
    allowNull: false,
  },
});

User.hasMany(VirtualBillboardReq, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

VirtualBillboardReq.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(BbdFinderComment, {
  foreignKey: {
    type: DataTypes.BIGINT,
    allowNull: false,
    name: 'frkUser',
  },
});

BbdFinderComment.belongsTo(User, {
  foreignKey: {
    type: DataTypes.BIGINT,
    allowNull: false,
    name: 'frkUser',
  },
});

User.hasMany(Ticket, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

Ticket.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(InformationBank, {
  foreignKey: {
    name: 'frkUser',
    type: DataTypes.BIGINT,
  },
});

InformationBank.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    type: DataTypes.BIGINT,
  },
});

User.hasMany(InfoBankExperience, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

InfoBankExperience.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(InfoBankComment, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

InfoBankComment.belongsTo(User, {
  foreignKey: {
    name: 'frkUser',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

User.hasMany(QAInfoBank, {
  foreignKey: {
    name: 'frkUserQ',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

QAInfoBank.belongsTo(User, {
  foreignKey: {
    name: 'frkUserQ',
    allowNull: false,
    type: DataTypes.BIGINT,
  },
});

module.exports = User;
