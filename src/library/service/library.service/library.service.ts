import { Book } from "../../book/book";
import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user";
import { Booking } from "../booking.service/booking.service";
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
    this.libraryBooks.set(book, 1);
  }
  deleteBook(book: Book): void {
    if (!this.libraryBooks.delete(book)) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "The book is not available in the library",
      });
    }
  }
  createBooking(user: User) {
    this.bookings.set(user, new Booking(user));
  }
  borrowBook(user: User, book: Book) {
    const booking = this.bookings.get(user);
    const libraryBook = this.libraryBooks.get(book);
    if (libraryBook !== 1) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "Book isn't in library",
      });
    }

    if (booking) {
      booking.addBookToUser(
        book,
        this.bookBorrowMonthsLimit,
        this.penaltyPointsPerBook,
        this.penaltyPointsLimit
      );
      this.libraryBooks.set(book, 0);
      return;
    }
    throw new LibraryError({
      name: "PERMISION_DENIED",
      message: "Booking does not exist",
    });
  }
  returnBook(book: Book) {
    const booking = Array.from(this.bookings.values()).find((booking) =>
      booking.getBooksDueDate().has(book)
    );
    if (booking) {
      booking.returnBook(
        book,
        this.bookBorrowMonthsLimit,
        this.penaltyPointsPerBook,
        this.penaltyPointsLimit
      );
      this.libraryBooks.set(book, 1);
      return;
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "Book not found",
    });
  }
  getBooks() {
    return this.libraryBooks;
  }
  getBookings() {
    return this.bookings;
  }
}
