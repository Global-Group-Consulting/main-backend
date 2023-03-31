import { AdonisModel } from '../../@types/AdonisModel'
import { ObjectId } from 'mongodb'

export interface CalendarEventCommentReading {
    userId: ObjectId,
    createdAt: string
}

export class CalendarEventComment extends AdonisModel {
    declare authorId: ObjectId
    declare eventId: ObjectId
    declare message: string
    declare readings: CalendarEventCommentReading[]
    
    author (): any;
    
    event (): any;
    
    setAuthorId (value: any): any;
    
    setEventId (value: any): any;
    
    setReadings (value: any): any;
}

//# sourceMappingURL=CalendarEventComment.d.ts.map
