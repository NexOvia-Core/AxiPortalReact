import type { Schema } from "@/lib/bff";

// Mirrors axiValidateSelectedApp in the legacy auth.js implementation.
export function getSchemaValidationError(schema?: Schema): string | undefined {
  return schema?.statusmessage && schema.statusmessage !== "Success"
    ? schema.statusmessage
    : undefined;
}
