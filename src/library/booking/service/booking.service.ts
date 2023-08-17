import { isAfter } from "date-fns";
import { Book } from "../../book/book";
import { User } from "../../user/user";
import { LibraryError } from "../../exceptions/library.exceptions";
import { PenaltyPoints } from "./components/PenaltyPoints";
export class Booking {
  private readonly penaltyPoints: PenaltyPoints;
  constructor(
    private readonly user: User,
    private readonly booksDueDate = new Map<Book, Date>()
  ) {
    this.penaltyPoints = new PenaltyPoints(this.user);
  }
  addBookToUser(
    book: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number,
    penaltyPointsLimit: number
  ): void {
    if (!this.isUserBanned()) {
      const penaltyPoints = this.penaltyPoints.calculatePenaltyPoints(
        this.booksDueDate,
        bookBorrowMonthsLimit,
        penaltyPointsPerBook
      );
      if (penaltyPoints > penaltyPointsLimit) {
        this.penaltyPoints.updateUserPenaltyPointsAndBan(penaltyPoints);
        throw new LibraryError({
          name: "PERMISION_DENIED",
          message: "User is banned!",
        });
      }
      this.booksDueDate.set(book, new Date());
      return;
    }
    throw new LibraryError({
      name: "PERMISION_DENIED",
      message: "User is banned!",
    });
  }
  returnBook(
    returnedBook: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number,
    penaltyPointsLimit: number
  ): void {
    const penaltyPoints = this.penaltyPoints.calculatePenaltyPoints(
      this.booksDueDate,
      bookBorrowMonthsLimit,
      penaltyPointsPerBook
    );
    if (penaltyPoints > penaltyPointsLimit) {
      this.penaltyPoints.updateUserPenaltyPointsAndBan(penaltyPoints);
    }
    if (this.booksDueDate.has(returnedBook)) {
      this.booksDueDate.delete(returnedBook);
      if (this.isUserBanned() && penaltyPoints > 0) {
        this.user.addPenaltyPoints(-penaltyPointsPerBook);
        return;
      }
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "The book is not in the user's list",
    });
  }
  has(book: Book): boolean {
    return this.booksDueDate.has(book);
  }
  private isUserBanned(): boolean {
    return isAfter(this.user.getDueDate(), new Date());
  }
}
