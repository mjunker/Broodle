var gcalLoader = require('./../../external/google_calendar/googleCalendarAccess');
var config = require('../../config.json');
var _ = require('lodash');
var moment = require('moment');

module.exports.cancelCurrentWeekEvent = function () {

    var timeFrom = '2015-04-08T20:00:27.135Z';
    var timeTo = '2015-04-10T20:00:27.135Z';

    var timeFrom = moment();
    var timeTo = moment().add(7, 'days');

    gcalLoader.load(config.deanwake.mainCalendar, timeFrom, timeTo, function (err, res, body) {
        var data = JSON.parse(body);
    });

};