type ErrorName = "PERRMISION_DENIED" | "INVALID_BOOK";
export class LibraryError extends Error {
  name: string;
  message: string;
  constructor({ name, message }: { name: ErrorName; message: string }) {
    super(name);
    this.name = name;
    this.message = message;
  }
}