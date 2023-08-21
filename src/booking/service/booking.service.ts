import { isAfter } from "date-fns";
import { Book } from "../../book/book";
import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user";
import { PenaltyPoints } from "./components/penaltyPoints";

export class Booking {
  private readonly penaltyPoints: PenaltyPoints;
  private readonly penaltyPointsLimit: number;
  private readonly penaltyPointsPerBook: number;
  constructor(
    private readonly user: User,
    private readonly booksBorrowDate = new Map<Book, Date>()
  ) {
    this.penaltyPoints = new PenaltyPoints(this.user);
    this.penaltyPointsLimit = 10;
    this.penaltyPointsPerBook = 10;
  }
  addBookToUser(book: Book): void {
    if (this.isUserBanned()) {
      throw new LibraryError({
        name: "PERMISION_DENIED",
        message: "User is banned!",
      });
    }
    const penaltyPoints = this.penaltyPoints.calculatePenaltyPoints(
      this.booksBorrowDate
    );
    if (penaltyPoints > this.penaltyPointsLimit) {
      this.penaltyPoints.updatePenaltyPointsAndBan(penaltyPoints);
      throw new LibraryError({
        name: "PERMISION_DENIED",
        message: "User is banned!",
      });
    }
    this.booksBorrowDate.set(book, new Date());
  }

  returnBook(returnedBook: Book): void {
    const penaltyPoints = this.penaltyPoints.calculatePenaltyPoints(
      this.booksBorrowDate
    );
    if (penaltyPoints > this.penaltyPointsLimit) {
      this.penaltyPoints.updatePenaltyPointsAndBan(penaltyPoints);
    }
    if (this.booksBorrowDate.has(returnedBook)) {
      this.booksBorrowDate.delete(returnedBook);
      if (this.isUserBanned() && penaltyPoints > 0) {
        this.user.addPenaltyPoints(-this.penaltyPointsPerBook);
        return;
      }
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "The book is not in the user's list",
    });
  }
  has(book: Book): boolean {
    return this.booksBorrowDate.has(book);
  }
  private isUserBanned(): boolean {
    return isAfter(this.user.getDueDate(), new Date());
  }
}
