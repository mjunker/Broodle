var google_oauth = require('google-oauth-jwt');
var _ = require('lodash');

module.exports.load = function (calendarConfig, dateFrom, dateTo, callback) {
    var request = google_oauth.requestWithJWT();
    request({
        options: {
            url: 'https://www.googleapis.com/calendar/v3/calendars/'
            + encodeURIComponent(calendarConfig.id) + '/events?singleEvents=true'
            + '&timeMax=' + encodeURIComponent(dateTo.toISOString())
            + '&timeMin=' + encodeURIComponent(dateFrom.toISOString()),
            jwt: {
                email: calendarConfig.email,
                keyFile: calendarConfig.keyfile,
                scopes: ['https://www.googleapis.com/auth/calendar']
            }
        }
    }, function (err, res, data) {
        callback(err, res, JSON.parse(data));
    });
}


function createAtendees(recipients) {
    var atendees = [];
    _.forEach(recipients, function (recipient) {
        atendees.push({"email": recipient.email})
    })
    return atendees;

}
function createDateObject(date) {
    return {"dateTime": date.toISOString()};

}
module.exports.addEvent = function (recipients, calendarConfig, start, end, callback) {
    var request = google_oauth.requestWithJWT();
    var body = {
        "summary": calendarConfig.eventName,
        "atendees": createAtendees(recipients),
        "start": createDateObject(start),
        "end": createDateObject(end),
        "comment": "Brought to you by Broodle"
    };

    var options = {
        options: {
            headers: {'content-type': 'application/json'},
            url: 'https://www.googleapis.com/calendar/v3/calendars/'
            + encodeURIComponent(calendarConfig.id) + '/events',
            method: 'post',
            json: true,
            body: body,
            jwt: {
                email: calendarConfig.email,
                keyFile: calendarConfig.keyfile,
                scopes: ['https://www.googleapis.com/auth/calendar']
            }
        }
    };
    request(options, function (err, res, data) {
        callback(err, res, data);
    });
}
