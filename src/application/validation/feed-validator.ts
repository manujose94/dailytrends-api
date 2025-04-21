import { InputValidationException } from "../../common/exceptions/input-validation-exception";
import { FeedData } from "../usecases/dto/feed-data-dto";

/**
 * Validates that the required fields in FeedData are present.
 * @param data - Partial FeedData object to validate.
 * @throws InputValidationException if any required fields are missing.
 */
export function validateFeedData(data: Partial<FeedData>) {
  const missingFields = [];
  if (!data.title) {
    missingFields.push("title");
  }
  if (!data.url) {
    missingFields.push("url");
  }
  if (!data.provider) {
    missingFields.push("provider");
  }
  if (!data.type) {
    missingFields.push("type");
  }
  if (missingFields.length > 0) {
    throw new InputValidationException(
      `Missing required fields: ${missingFields.join(", ")}`
    );
  }
}

/**
 * Validates the filter object for delete operations.
 * @param filter 
 */
export function validateDeleteFilter(filter: {
  _id?: string;
  publicationDate?: { $lt?: Date };
  provider?: string;
}) {
  const missingFields = [];
  if (!filter._id && !filter.publicationDate && !filter.provider) {
    throw new InputValidationException(
      `Filter must contain at least one of the following fields: _id, publicationDate, provider`
    );
  }

  // Additional validation for publicationDate
  if (filter.publicationDate && !filter.publicationDate.$lt) {
    throw new InputValidationException(
      `Invalid publicationDate filter: $lt field is required`
    );
  }

  // Additional validation for _id (if needed)
  if (filter._id && typeof filter._id !== "string") {
    throw new InputValidationException(`Invalid _id: must be a string`);
  }

  // Additional validation for provider (if needed)
  if (filter.provider && typeof filter.provider !== "string") {
    throw new InputValidationException(`Invalid provider: must be a string`);
  }
}
