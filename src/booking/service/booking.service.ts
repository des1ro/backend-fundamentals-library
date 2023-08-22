import { addMonths, isAfter } from "date-fns";
import { Book } from "../../book/book";
import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user";
export class Booking {
  private readonly penaltyPointsPerBook: number;
  constructor(
    private readonly user: User,
    private readonly booksBorrowDate = new Map<Book, Date>()
  ) {
    this.penaltyPointsPerBook = 10;
  }
  addBookToUser(book: Book): void {
    if (this.user.isBanned()) {
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
    const bookBorrowDateLimit = addMonths(date, 1);
    const bookIsAfterDueDate = isAfter(new Date(), bookBorrowDateLimit);
    this.booksBorrowDate.delete(returnedBook);
    if (bookIsAfterDueDate) {
      this.user.subtractPenaltyPoints(this.penaltyPointsPerBook);
    }
  }
  has(book: Book): boolean {
    return this.booksBorrowDate.has(book);
  }
  _getBooksDatesArray(): Date[] {
    const datesArray = Array.from(this.booksBorrowDate.values());
    return datesArray;
  }
}
