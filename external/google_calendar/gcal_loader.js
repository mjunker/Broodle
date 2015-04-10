var google_oauth = require('google-oauth-jwt');

exports.load = function (callback) {
    var request = google_oauth.requestWithJWT();

    request({
        options: {
            url: 'https://www.googleapis.com/calendar/v3/calendars/g1tinvpsncpr740bgjo05r1fho%40group.calendar.google.com/events?singleEvents=true&timeMax=2015-04-10T20%3A00%3A27.135Z&timeMin=2015-04-08T20%3A00%3A27.135Z',
            jwt: {
                email: '151522485589-56s7guvomesr96sf3bojs6h9js8gq34b@developer.gserviceaccount.com',
                keyFile: 'google_calendar_key.pem',
                scopes: ['https://www.googleapis.com/auth/calendar']
            }
        }

    }, callback);
}
