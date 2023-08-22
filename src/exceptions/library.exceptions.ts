type ErrorName = "PERMISION_DENIED" | "INVALID_BOOK" | "BOOKING_ERROR";
export class LibraryError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}
