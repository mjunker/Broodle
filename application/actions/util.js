var config = require('../../config.json');
var _ = require('lodash');
var moment = require('moment');
var momentRange = require('moment-range');

var mailUrlFormat = 'YYYY-MM-DD-HH-MM';

module.exports.findUserByUserName = function (group, username) {
    return _.find(config[group].members, function (member) {
        return _.isEqual(member.username, username);
    });
}

module.exports.formatDateForUrl = function (date) {
    return date.format(mailUrlFormat);
}

module.exports.parseDateFromUrl = function (date) {
    return moment(date, mailUrlFormat);
}

module.exports.formatAsDateString = function (date) {
    return date.format('YYYY-MM-DD');
}
