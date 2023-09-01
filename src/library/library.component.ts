import { Book } from "../book/book.dto";
import { LibraryError } from "../exceptions/library.exceptions";
import { User } from "../user/user.dto";
import { Booking } from "../booking/booking.service";
import { UsersUpdate } from "../user/service/usersUpdate/usersUpdate.service";
import * as cron from "node-cron";

export class Library {
  private readonly usersUpdate: UsersUpdate;
  constructor(
    private readonly libraryBooks = new Map<Book, number>(),
    private readonly bookings = new Map<User, Booking>()
  ) {
    this.usersUpdate = new UsersUpdate();
  }
  constantlyUpdateUsers(): void {
    cron.schedule("* 30 5 * * * ", () => {
      console.log("Update users every day at 5:30");
      this.usersUpdate.update(this.bookings);
      console.log("Library users updated");
    });
  }
  addBook(book: Book, amount = 1): void {
    const value = this.libraryBooks.get(book) || 0;
    this.libraryBooks.set(book, amount + value);
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
      this.libraryBooks.set(book, newAmount);
      return;
    }
    this.libraryBooks.delete(book);
  }
  createBooking(user: User) {
    if (this.bookings.has(user)) {
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
    if (currentAmount === 0) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "Book isn't in library",
      });
    }
    if (booking) {
      this.libraryBooks.set(book, currentAmount - 1);
      booking.addBookToUser(book);
      return;
    }
    throw new LibraryError({
      name: "BOOKING_ERROR",
      message: "Booking doen't exist",
    });
  }
  returnBook(user: User, book: Book) {
    const booking = this.bookings.get(user);
    if (!booking) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "Book not found",
      });
    }
    const currentAmount = this.libraryBooks.get(book);
    if (currentAmount !== undefined) {
      booking.returnBook(book);
      this.libraryBooks.set(book, currentAmount + 1);
      return;
    }
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "Book not found in library",
    });
  }
}
