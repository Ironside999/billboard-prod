const TrezSmsClient = require('trez-sms-client');

const client = new TrezSmsClient('smssarafraz', '1446629');

const sendVerifySms = async ({ mobile, code }) => {
  client
    .manualSendCode(
      mobile,
      `کد تایید شما برای ثبت نام در بیلبورد ${code} میباشد`
    )
    .then((msgID) => {
      console.log(msgID);
    })
    .catch((err) => {
      console.log(err);
    });
};

const sendResetSms = async ({ mobile, url }) => {
  client
    .manualSendCode(mobile, `رمز موقت شما ${url} میباشد`)
    .then((msgID) => {
      console.log(msgID);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  sendVerifySms,
  sendResetSms,
};
