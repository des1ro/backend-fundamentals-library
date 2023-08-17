import { Book } from "../book/book";
import { LibraryError } from "../exceptions/library.exceptions";
import { User } from "../user/user";
import { Booking } from "../booking/service/booking.service";
export class Library {
  private readonly bookBorrowMonthsLimit: number;
  private readonly penaltyPointsPerBook: number;
  private readonly penaltyPointsLimit: number;
  constructor(
    private readonly libraryBooks = new Map<Book, number>(),
    private readonly bookings = new Map<User, Booking>()
  ) {
    this.bookBorrowMonthsLimit = 1;
    this.penaltyPointsPerBook = 10;
    this.penaltyPointsLimit = 10;
  }
  addBook(book: Book): void {
    const value = this.libraryBooks.get(book) || 0;
    this.libraryBooks.set(book, 1 + value);
  }
  deleteBook(book: Book, amount: number = 1): void {
    const currentAmount = this.libraryBooks.get(book);
    if (!currentAmount) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "The book is not available in this library",
      });
    }
    const newAmount = currentAmount - amount;
    if (newAmount > 0) {
      this.libraryBooks.set(book, currentAmount - amount);
      return;
    }
    this.libraryBooks.delete(book);
  }
  createBooking(user: User) {
    if (this.bookings.get(user)) {
      throw new LibraryError({
        name: "BOOKING_ERROR",
        message: "Booking already exist",
      });
    }
    this.bookings.set(user, new Booking(user));
  }
  borrowBook(user: User, book: Book) {
    const booking = this.bookings.get(user);
    const currentAmount = this.libraryBooks.get(book) || 0;
    if (currentAmount <= 0) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "Book isn't in library",
      });
    }
    if (booking) {
      book.bookTracker().borrow(user);
      booking.addBookToUser(
        book,
        this.bookBorrowMonthsLimit,
        this.penaltyPointsPerBook,
        this.penaltyPointsLimit
      );
      this.libraryBooks.set(book, currentAmount - 1);
      return;
    }
    throw new LibraryError({
      name: "BOOKING_ERROR",
      message: "Booking does not exist",
    });
  }
  returnBook(book: Book) {
    const user = book.bookTracker().getUser();
    const booking = this.bookings.get(user);
    if (!booking) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "Book not found",
      });
    }
    booking.returnBook(
      book,
      this.bookBorrowMonthsLimit,
      this.penaltyPointsPerBook,
      this.penaltyPointsLimit
    );
    book.bookTracker().reset();
    const currentAmount = this.libraryBooks.get(book) || 0;
    this.libraryBooks.set(book, currentAmount + 1);
    return;
  }
}
