var mockery = require('mockery');
var stateProvider = require('../application/actions/applicationStateProvider');

describe("A suite", function () {
    it("contains spec with an expectation", function () {

        var googleCalendarAccessMock = {
            load: function (calendarConfig, dateFrom, dateTo, callback) {
                callback({"items": []});
            }
        };


        mockery.registerMock('./../../external/google_calendar/googleCalendarAccess', googleCalendarAccessMock);


        var state = stateProvider.getState('testGroup');
        var voteState = state.voteState;
        voteState.onFindNewEvent('testGroup', 'member1');

        expect(state.candidates.length).toBe(7);

    });
});


var singleEvent =
{
    "items": [
        {
            "id": "qemhm88he563logh2mm68f64b4_20150415T160000Z",
            "status": "confirmed",
            "summary": "testGroup",
            "start": {
                "dateTime": "2015-04-15T18:00:00+02:00",
                "timeZone": "Europe/Zurich"
            },
            "end": {
                "dateTime": "2015-04-15T23:00:00+02:00",
                "timeZone": "Europe/Zurich"
            },
            "recurringEventId": "qemhm88he563logh2mm68f64b4"
        }]
}
