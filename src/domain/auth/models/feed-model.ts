import { Model, Schema, model, Document } from "mongoose";

interface IFeed extends Document {
  title: string;
  url: string;
  publicationDate: Date;
  provider: string;
  type: string;
}

const feedSchema = new Schema(
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

feedSchema.index({ title: 1, publicationDate: 1 }, { unique: true });

export const FEED_MODEL: Model<IFeed> = model<IFeed>("FEED", feedSchema);
