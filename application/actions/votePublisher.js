var mailSender = require('./../../external/mail/mailSender');
var config = require('../../config.json');
var _ = require('lodash');
var util = require('./util');

module.exports.initVote = function (group, username, dateToVoteFor) {

    var receiverEmail = util.findUserByUserName(group, username).email;
    var subject = username + " Bandprobe!!!!";
    var message = createMailMessage(group, username, dateToVoteFor);
    mailSender.sendMail(receiverEmail, subject, message);
}


function createMailMessage(group, username, dateToVoteFor) {
    return createVoteUrl(group, username, dateToVoteFor, "yes");
}

function createVoteUrl(group, username, dateToVoteFor, vote) {
    return config.baseUrl + 'vote/' + group + "/" + username + "/" + dateToVoteFor.start.format('YYYY-MM-DD-HH-MM') + "/" + vote;
}