var gcalLoader = require('./../../external/google_calendar/googleCalendarAccess');
var config = require('../../config.json');
var _ = require('lodash');
var moment = require('moment');
var momentRange = require('moment-range');
var state = require('./applicationState');
var util = require('./util');

var candidates;

function selectInitialCandidate() {
    var candidate = _.find(candidates, function (candidate) {
        return candidate.ranges.length > 0;
    });
    return candidate.ranges[Object.keys(candidate.ranges)[0]];
}

function findNewEvent(group, callback) {
    state.resetState(group);
    candidates = state.getState(group).candidates;

    var timeFrom = moment();
    var timeTo = moment().add(7, "days");

    initCandidates(config[group].dayRules, timeFrom.clone(), timeTo.clone());

    gcalLoader.load(config[group].mainCalendar, timeFrom, timeTo, function (err, res, body) {
        var data = JSON.parse(body);
        subtractAllOccupiedDatesFromCandidates(data);
        removeAllTooShortRanges(config[group].minDurationInHours);
        callback(selectInitialCandidate());

    });

};

module.exports.findNewEvent = findNewEvent;


module.exports.selectNextAvailableCandidate = function (group, username) {
    candidates = state.getState(group).candidates;
    _.forEach(candidates, function (candidate) {
        _.forEach(candidate.ranges, function (range) {
            if (!range.hasOwnProperty(username)) {
                return range;
            }
        });
    });
    return null;
};

function removeAllTooShortRanges(minDurationInHours) {

    _.forEach(candidates, function (candidate) {
        _.forEach(candidate.ranges.slice(), function (range) {
            if (range.diff('hours') < minDurationInHours) {
                candidate.ranges = _.without(candidates.ranges, range);
            }
        });
    });
}

function subtractAllOccupiedDatesFromCandidates(data) {
    var occupiedDurations = extractDurations(data);
    _.forEach(occupiedDurations, function (occupiedDuration) {
        var startDateString = util.formatAsDateString(occupiedDuration.start);
        if (candidates.hasOwnProperty(startDateString)) {
            var candidate = candidates[startDateString];
            _.forEach(candidate.ranges, function (range) {
                if (range.overlaps(occupiedDuration)) {
                    subtractRangeFromCandidate(candidate, range, occupiedDuration);
                }
            });

        }
    });
}

function subtractRangeFromCandidate(candidate, range, item) {
    candidate.ranges = _.without(candidates.ranges, range);
    _.forEach(range.subtract(item), function (newRange) {
        candidate.ranges.push(newRange);
    });
}

function extractDurations(data) {
    return _.map(data.items, function (item) {
        return moment().range(moment(item.start.dateTime), moment(item.end.dateTime));
    });
}


function initCandidates(dayRules, timeFrom, timeTo) {

    for (var currentDay = timeFrom; currentDay.isBefore(timeTo); currentDay.add(1, 'days')) {
        var configuredStartHour = _.find(dayRules, 'on', currentDay.format('dddd'));
        var fromTime = currentDay.clone().startOf('day').hour(configuredStartHour.from);
        var untilTime = currentDay.clone().startOf('day').hour(configuredStartHour.until);
        var range = moment().range(fromTime, untilTime);

        candidates[util.formatAsDateString(currentDay)] = {
            "ranges": [range],
            "rating": 4
        };
    }

}