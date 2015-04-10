var nodemailer = require("nodemailer");
var mailConfig = require('../../emailConfig.json');

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: mailConfig.user,
        pass: mailConfig.password
    }
});

module.exports.sendMail = function (receiver, subject, message) {
    smtpTransport.sendMail({
        from: "Broodle <" + mailConfig.user + ">",
        to: receiver,
        subject: subject,
        text: message
    }, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
}
