import { addMonths, differenceInMonths, isAfter } from "date-fns";
import { Book } from "../../book/book";
import { User } from "../../user/user";
import { LibraryError } from "../../exceptions/library.exceptions";
export class Booking {
  constructor(
    private readonly user: User,
    private readonly booksDueDate = new Map<Book, Date>()
  ) {}
  private isUserBanned(): boolean {
    return isAfter(this.user.getDueDate(), new Date());
  }
  private updateUserPenaltyPointsAndBan(penaltyPoints: number): void {
    this.user.addPenaltyPoints(penaltyPoints);
    const banMonths = penaltyPoints / 10;
    this.user.setDueDate(addMonths(new Date(), banMonths));
  }
  private calculatePenaltyPoints(
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number
  ): number {
    const currentDate = new Date();
    return Array.from(this.booksDueDate.values()).reduce(
      (totalPoints, bookDate) => {
        const difference = differenceInMonths(currentDate, bookDate);
        if (difference >= bookBorrowMonthsLimit) {
          return totalPoints + penaltyPointsPerBook;
        }
        return totalPoints;
      },
      0
    );
  }
  addBookToUser(
    book: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number,
    penaltyPointsLimit: number
  ): void {
    if (this.isUserBanned()) {
      throw new LibraryError({
        name: "PERMISION_DENIED",
        message: "User is banned!",
      });
    }
    const penaltyPoints = this.calculatePenaltyPoints(
      bookBorrowMonthsLimit,
      penaltyPointsPerBook
    );
    if (penaltyPoints > penaltyPointsLimit) {
      this.updateUserPenaltyPointsAndBan(penaltyPoints);
      throw new LibraryError({
        name: "PERMISION_DENIED",
        message: "User is banned!",
      });
    }
    this.booksDueDate.set(book, new Date());
  }
  returnBook(
    returnedBook: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number,
    penaltyPointsLimit: number
  ): void {
    const penaltyPoints = this.calculatePenaltyPoints(
      bookBorrowMonthsLimit,
      penaltyPointsPerBook
    );
    if (penaltyPoints > penaltyPointsLimit) {
      this.updateUserPenaltyPointsAndBan(penaltyPoints);
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
  getBooksDueDate(): Map<Book, Date> {
    return this.booksDueDate;
  }
}
