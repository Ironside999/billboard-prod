// const nodemailer = require("nodemailer");
// const AppError = require("../appError/appError");

var SibApiV3Sdk = require('sib-api-v3-sdk');

var defaultClient = SibApiV3Sdk.ApiClient.instance;

var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey =
  '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';

var partnerKey = defaultClient.authentications['partner-key'];
partnerKey.apiKey =
  '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';

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

async function sendShit({ code, username, email }) {
  sendSmtpEmail.subject = 'کد تایید برای بیلبورد';
  sendSmtpEmail.htmlContent = `<html><body><h1>کد تایید شما:  ${code}</h1></body></html>`;
  sendSmtpEmail.sender = { name: 'Billboard', email: 'info@iranchemi.com' };
  sendSmtpEmail.to = [{ email: email, name: username }];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        'API called successfully. Returned data: ' + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
}

async function sendResetPassword({ email, username, url }) {
  sendSmtpEmail.subject = 'بازیابی کلمه عبور';
  sendSmtpEmail.htmlContent = `<html><body>
  <p>رمز موقت شما ${url} میباشد</p>
  </body></html>`;
  sendSmtpEmail.sender = { name: 'Billboard', email: 'info@iranchemi.com' };
  sendSmtpEmail.to = [{ email: email, name: username }];

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        'API called successfully. Returned data: ' + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
}

module.exports = {
  sendShit,
  sendResetPassword,
};
