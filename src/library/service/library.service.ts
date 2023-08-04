import { Book } from "../book/book";
import { LibraryError } from "../exceptions/library.exceptions";
import { User } from "../user/user";
import { Booking } from "./components/booking";
export class Library {
  private readonly bookBorrowMonthsLimit: number;
  private readonly penaltyPointsPerBook: number;
  constructor(
    private readonly libraryBooks = new Map<Book, boolean>(),
    private readonly bookings = new Map<User, Booking>()
  ) {
    this.bookBorrowMonthsLimit = 1;
    this.penaltyPointsPerBook = 10;
  }
  addBook(book: Book): void {
    this.libraryBooks.set(book, true);
  }
  deleteBook(book: Book): void {
    if (!this.libraryBooks.delete(book)) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "The book is not available in the library",
      });
    }
  }
  borrowBook(user: User, book: Book) {
    let booking = this.bookings.get(user);
    if (!booking) {
      booking = new Booking(user);
      this.bookings.set(user, booking);
    }
    booking.addBookToUser(
      book,
      this.bookBorrowMonthsLimit,
      this.penaltyPointsPerBook
    );
    this.libraryBooks.set(book, false);
  }
  returnBook(book: Book) {
    const booking = Array.from(this.bookings.values()).find((booking) =>
      booking.getBooksDueDate().has(book)
    );
    if (booking) {
      booking.returnBook(
        book,
        this.bookBorrowMonthsLimit,
        this.penaltyPointsPerBook
      );
      this.libraryBooks.set(book, true);
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
