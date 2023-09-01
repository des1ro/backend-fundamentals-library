import { isAfter, addMonths } from "date-fns";
import { Book } from "../book/book.dto";
import { LibraryError } from "../exceptions/library.exceptions";
import { User } from "../user/user.dto";

export class Booking {
  constructor(
    private readonly user: User,
    private readonly booksBorrowDate = new Map<Book, Date>()
  ) {}
  addBookToUser(book: Book): void {
    const isBanned = isAfter(this.user.getDueDate(), new Date());
    if (isBanned) {
      throw new LibraryError({
        name: "PERMISION_DENIED",
        message: "User is banned!",
      });
    }
    this.booksBorrowDate.set(book, new Date());
  }
  returnBook(returnedBook: Book): void {
    const date = this.booksBorrowDate.get(returnedBook);
    if (!date) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "The book is not in the user's list",
      });
    }
    this.booksBorrowDate.delete(returnedBook);
  }
  getBooksDatesArray(): Date[] {
    return Array.from(this.booksBorrowDate.values());
  }
}
