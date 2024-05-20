import { InputValidationException } from "../../common/exceptions/input-validation-exception";
export function validateFeedData(data: any) {
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
