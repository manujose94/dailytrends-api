import { Schema, model } from "mongoose";

export interface IFeed {
  title: string;
  url: string;
  publicationDate: Date;
  provider: string;
  type: string;
}

const feedSchema = new Schema<IFeed>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    publicationDate: { type: Date, required: true },
    provider: { type: String, required: true },
    type: { type: String, required: true }
  },
  {
    versionKey: false,
    collection: "FEED"
  }
);

feedSchema.index({ title: 1, source: 1 }, { unique: true });

export const FEED_MODEL = model<IFeed>("FEED", feedSchema);
