import { isAfter, addMonths } from "date-fns";
import { Book } from "../../../book/book.dto";
import { LibraryError } from "../../../exceptions/library.exceptions";
import { User } from "../../../user/user.dto";

export class Booking {
  private readonly penaltyPointsPerBook: number;
  constructor(
    private readonly user: User,
    private readonly booksBorrowDate = new Map<Book, Date>()
  ) {
    this.penaltyPointsPerBook = 10;
  }
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
    const bookBorrowDateLimit = addMonths(date, 1);
    const bookIsAfterDueDate = isAfter(new Date(), bookBorrowDateLimit);
    this.booksBorrowDate.delete(returnedBook);
    if (bookIsAfterDueDate) {
      const penaltyPoints =
        this.user.getPenaltyPoints() + this.penaltyPointsPerBook;
      this.user.setPenaltyPoints(penaltyPoints);
    }
  }
  getBooksDatesArray(): Date[] {
    const datesArray = Array.from(this.booksBorrowDate.values());
    return datesArray;
  }
}
