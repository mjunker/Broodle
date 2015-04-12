var config = require('config');
var _ = require('lodash');
var moment = require('moment');
require('moment-range');

var dateFormat = 'YYYY-MM-DD';
var dateTimeFormat = 'YYYY-MM-DD-HH-mm';

module.exports.findUserByUserName = function (group, username) {
    return _.find(config.get(group).members, function (member) {
        return _.isEqual(member.username, username);
    });
}

module.exports.formatDateForUrl = function (date) {
    return date.format(dateFormat);
}

module.exports.parseDateFromUrl = function (date) {
    return moment(date, dateFormat);
}

module.exports.formatAsDateString = function (date) {
    return date.format(dateFormat);
}

module.exports.parseDateTimeFromUrl = function (date) {
    return moment(date, dateTimeFormat);
}

module.exports.formatAsDateTimeString = function (date) {
    return date.format(dateTimeFormat);
}

module.exports.findNextUserWithoutVote = function (candidate, members) {
    return _.find(members, function (member) {
        return !_.has(candidate.votes, member.username);
    });
}