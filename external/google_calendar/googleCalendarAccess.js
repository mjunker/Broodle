var google_oauth = require('google-oauth-jwt');

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
    }, callback);
}
