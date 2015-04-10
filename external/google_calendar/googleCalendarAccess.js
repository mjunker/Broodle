var google_oauth = require('google-oauth-jwt');

module.exports.load = function (calendarId, dateFrom, dateTo, callback) {
    var request = google_oauth.requestWithJWT();
    request({
        options: {
            url: 'https://www.googleapis.com/calendar/v3/calendars/'
            + encodeURIComponent(calendarId) + '/events?singleEvents=true'
            + '&timeMax=' + encodeURIComponent(dateTo)
            + '&timeMin=' + encodeURIComponent(dateFrom),
            jwt: {
                email: '151522485589-56s7guvomesr96sf3bojs6h9js8gq34b@developer.gserviceaccount.com',
                keyFile: 'google_calendar_key.pem',
                scopes: ['https://www.googleapis.com/auth/calendar']
            }
        }
    }, callback);
}
