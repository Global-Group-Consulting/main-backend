import { Attachment } from './Attachment';
import { ObjectId } from 'mongodb';

export interface News {
  title: string;
  text: string;
  newsImg: Attachment;
  newsAttachments: Attachment[];
  active: boolean; // Allow to manually hide a news even if must be shown
  createdBy: ObjectId;
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  _id: ObjectId
}

export interface NewsCreateDto {
  title: string;
  text: string;
  active?: boolean; // Allow to manually hide a news even if must be shown
  startAt?: Date;
  endAt?: Date;
  newsAttachments?: File[];
  newsImg?: File[]
}

export interface NewsUpdateDto extends NewsCreateDto {
}
