import { add, addMonths, differenceInMonths, isAfter } from "date-fns";
import { Book } from "../../book/book";
import { User } from "../../user/user";
import { LibraryError } from "../../exceptions/library.exceptions";
// sprawdzać przy oddawaniu czy książka po terminie
// wszystko w bookingu
// user ma mieć
export class Booking {
  constructor(
    private readonly user: User,
    private readonly booksDueDate = new Map<Book, Date>()
  ) {}
  getUser(): User {
    return this.user;
  }
  isUserBanned(
    bookBorrowMonthsLimit: number,
    penaltyPointsLimit: number
  ): boolean {
    const isBanned = isAfter(this.user.getDueDate(), new Date());
    if (isBanned) {
      return true;
    }
    const userPenaltyPoints = this.checkUserPenaltyPoints(
      bookBorrowMonthsLimit,
      penaltyPointsLimit
    );
    if (userPenaltyPoints > 0) {
      const banMonths = userPenaltyPoints / 10;
      this.user.setDueDate(addMonths(new Date(), banMonths));
      return true;
    }
    return false;
  }
  addBookToUser(
    book: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsLimit: number
  ): void {
    if (!this.isUserBanned(bookBorrowMonthsLimit, penaltyPointsLimit)) {
      this.booksDueDate.set(book, new Date());
      return;
    }
    throw new LibraryError({
      name: "PERRMISION_DENIED",
      message: "User is banned!",
    });
  }
  checkUserPenaltyPoints(
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number
  ): number {
    let penaltyPoints = 0;
    this.booksDueDate.forEach((bookDate) => {
      const difference = differenceInMonths(new Date(), bookDate);
      if (difference >= bookBorrowMonthsLimit)
        penaltyPoints += penaltyPointsPerBook;
    });
    this.user.addPenaltyPoints(penaltyPoints);
    return this.user.getPenaltyPoints();
  }

  returnBook(
    returnedBook: Book,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number
  ): void {
    const isUserBanned = this.isUserBanned(
      bookBorrowMonthsLimit,
      penaltyPointsPerBook
    );
    if (this.booksDueDate.has(returnedBook)) {
      const date = this.booksDueDate.get(returnedBook);
      if (date && isAfter(new Date(), addMonths(date, 1)) && isUserBanned) {
        this.user.addPenaltyPoints(-penaltyPointsPerBook);
      }
      this.booksDueDate.delete(returnedBook);
      return;
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "The book is not in the user's list",
    });
  }
  getBooksDueDate(): Map<Book, Date> {
    return this.booksDueDate;
  }
  getUserDueDate() {
    return this.user.getDueDate();
  }
  getUserPenaltyPoints() {
    return this.user.getPenaltyPoints();
  }
}
