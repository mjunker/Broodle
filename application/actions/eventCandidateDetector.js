var gcalLoader = require('./../../external/google_calendar/googleCalendarAccess');
var config = require('../../config.json');
var _ = require('lodash');

module.exports.cancelCurrentWeekEvent = function () {

    var timeFrom = '2015-04-08T20:00:27.135Z';
    var timeTo = '2015-04-10T20:00:27.135Z';

    var currentDate = _.now();

    gcalLoader.load(config.deanwake.mainCalendar, timeFrom, timeTo, function (err, res, body) {
        console.log(JSON.parse(body));
    });

};