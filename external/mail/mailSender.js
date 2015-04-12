var nodemailer = require("nodemailer");
var config = require('config');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: config.get('mailAccount.user'),
        pass: config.get('mailAccount.password')
    }
});

module.exports.sendMail = function (receiver, subject, message) {

    if (config.get('mailAccount.sendMailEnabled')) {
        smtpTransport.sendMail({
            from: "Broodle",
            to: receiver,
            subject: subject,
            html: message
        }, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    }

}
