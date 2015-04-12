var gcalLoader = require('./../../external/google_calendar/googleCalendarAccess');
var config = require('../../config.json');
var _ = require('lodash');
var moment = require('moment');
var momentRange = require('moment-range');
var stateProvider = require('./applicationStateProvider');
var util = require('./util');




function findNewEvent(group, callback) {
    stateProvider.resetState(group);

    // TODO weekly/daily,...
    var timeFrom = moment();
    var timeTo = moment().add(7, "days");

    var candidates = initCandidates(config[group].dayRules, timeFrom.clone(), timeTo.clone());

    gcalLoader.load(config[group].mainCalendar, timeFrom, timeTo, function (err, res, body) {
        var data = JSON.parse(body);
        subtractAllOccupiedDatesFromCandidates(candidates, data);
        removeAllTooShortRanges(candidates, config[group].minDurationInHours);
        candidates = removeDaysWithoutCandidates(candidates);
        stateProvider.getState(group).candidates = candidates;
        callback();
    });

};

module.exports.findNewEvent = findNewEvent;

function removeDaysWithoutCandidates(candidates) {
    return _.filter(candidates, function (candidate) {
        return candidate.ranges.length > 0;
    });
}

module.exports.selectNextAvailableCandidate = function (group, username) {
    // TODO order by number of votes and pick highest ranked
    var candidates = stateProvider.getState(group).candidates;
    _.forEach(candidates, function (candidate) {
        _.forEach(candidate.ranges, function (range) {
            if (!range.hasOwnProperty(username)) {
                return range;
            }
        });
    });
    return null;
};

function removeAllTooShortRanges(candidates, minDurationInHours) {

    _.forEach(candidates, function (candidate) {
        _.forEach(candidate.ranges.slice(), function (range) {
            if (range.diff('hours') < minDurationInHours) {
                candidate.ranges = _.without(candidates.ranges, range);
            }
        });
    });
}

function findCandidate(candidates, day) {
    return _.find(candidates, function (candidate) {
        return _.isEqual(candidate.day, day);
    });
}
function subtractAllOccupiedDatesFromCandidates(candidates, data) {
    var occupiedDurations = extractDurations(data);
    _.forEach(occupiedDurations, function (occupiedDuration) {
        var startDateString = util.formatAsDateString(occupiedDuration.start);
        var candidate = findCandidate(candidates, startDateString);
        if (!_.isUndefined(candidate)) {
            _.forEach(candidate.ranges, function (range) {
                if (range.overlaps(occupiedDuration)) {
                    subtractRangeFromCandidate(candidate, range, occupiedDuration);
                }
            });

        }
    });
}

function subtractRangeFromCandidate(candidate, range, item) {
    candidate.ranges = _.without(candidate.ranges, range);
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

    var candidates = [];
    for (var currentDay = timeFrom; currentDay.isBefore(timeTo); currentDay.add(1, 'days')) {
        var configuredStartHour = _.find(dayRules, 'on', currentDay.format('dddd'));
        var fromTime = currentDay.clone().startOf('day').hour(configuredStartHour.from);
        var untilTime = currentDay.clone().startOf('day').hour(configuredStartHour.until);
        var range = moment().range(fromTime, untilTime);

        candidates.push({
            "day": util.formatAsDateString(currentDay),
            "ranges": [range],
            "votes": {}
        });
    }
    return candidates;

}