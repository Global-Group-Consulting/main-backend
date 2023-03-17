"use strict";
const { castToObjectId } = require('../Helpers/ModelFormatters');
const Model = use('Model');
class CalendarEventComment extends Model {
    author() {
        return this.belongsTo('App/Models/User', 'authorId', '_id').select(['_id', 'firstName', 'lastName']);
    }
    event() {
        return this.belongsTo('App/Models/CalendarEvent', 'eventId', '_id');
    }
    setAuthorId(value) {
        return castToObjectId(value);
    }
    setEventId(value) {
        return castToObjectId(value);
    }
    setReadings(value) {
        return value.map((reading) => (Object.assign(Object.assign({}, reading), { userId: castToObjectId(reading.userId) })));
    }
}
module.exports = CalendarEventComment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2FsZW5kYXJFdmVudENvbW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJDYWxlbmRhckV2ZW50Q29tbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxFQUFFLGNBQWMsRUFBRSxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFBO0FBRWhFLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQTtBQU8xQixNQUFNLG9CQUFxQixTQUFRLEtBQUs7SUFNdEMsTUFBTTtRQUNKLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBQ3RHLENBQUM7SUFFRCxLQUFLO1FBQ0gsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLDBCQUEwQixFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUNyRSxDQUFDO0lBRUQsV0FBVyxDQUFFLEtBQWE7UUFDeEIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDOUIsQ0FBQztJQUVELFVBQVUsQ0FBRSxLQUFhO1FBQ3ZCLE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFRCxXQUFXLENBQUUsS0FBb0M7UUFDL0MsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxpQ0FDdkIsT0FBTyxLQUNWLE1BQU0sRUFBRSxjQUFjLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUN0QyxDQUNILENBQUE7SUFFSCxDQUFDO0NBQ0Y7QUFFRCxpQkFBUyxvQkFBb0IsQ0FBQSJ9