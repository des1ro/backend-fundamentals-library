import { addMonths, differenceInDays, isAfter } from "date-fns";
import { Book } from "../../book/book";
import { User } from "../../user/user";
import { LibraryError } from "../../exceptions/library.exceptions";

export class Booking {
  constructor(
    private readonly user: User,
    private readonly dueDate = new Date(),
    private readonly books = new Map<Book, Date>()
  ) {}
  getUser(): User {
    return this.user;
  }
  getDueDate() {
    return this.dueDate;
  }
  checkBook(book: Book): boolean {
    return this.books.has(book);
  }

  getUserCredit(limit: number): number {
    let credit: number = 0;
    if (isAfter(this.dueDate, new Date())) {
      this.resetCredit();
      return this.user.getCredit();
    }
    for (const [book, date] of this.books) {
      const days = differenceInDays(new Date(), date);
      if (days > limit) {
        credit += days - limit;
      }
    }
    const creditSum = this.user.getCredit() + credit;
    this.user.setCredit(creditSum);
    return creditSum;
  }
  resetCredit() {
    this.user.resetCredit();
  }
  borrowBook(book: Book): void {
    this.books.set(book, new Date());
  }
  getBlockUser() {
    return new Booking(this.user, addMonths(new Date(), 1), this.books);
  }
  returnBook(book: Book): void {
    if (this.checkBook(book)) {
      this.books.delete(book);
      return;
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "The book is not in the user's list",
    });
  }
}
