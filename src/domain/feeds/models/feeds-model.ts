import { Schema, model, Document } from "mongoose";

interface IFeed extends Document {
  title: string;
  url: string;
  publicationDate: Date;
  source: string;
  type: string;
}

const feedSchema = new Schema<IFeed>({
  title: { type: String, required: true },
  url: { type: String, required: true },
  publicationDate: { type: Date, required: true },
  source: { type: String, required: true },
  type: { type: String, required: true }
});

feedSchema.index({ title: 1, publicationDate: 1 }, { unique: true });

export const Feed = model<IFeed>("Feed", feedSchema);
