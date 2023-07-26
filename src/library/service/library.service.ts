import { isAfter } from "date-fns";
import { Book } from "../book/book";
import { LibraryError } from "../exceptions/library.exceptions";
import { User } from "../user/user";
import { Booking } from "./components/booking";
export class Library {
  constructor(
    private readonly bookBorrowDaysLimit: number,
    private readonly libraryBooks = new Set<Book>(),
    private readonly bookings = new Set<Booking>()
  ) {}

  addBook(book: Book): void {
    this.libraryBooks.add(book);
  }

  deleteBook(book: Book): void {
    if (!this.libraryBooks.delete(book)) {
      throw new LibraryError({
        name: "INVALID_BOOK",
        message: "The book is not available in the library",
      });
    }
  }
  getBooks() {
    return this.libraryBooks;
  }
  getBookings() {
    return this.bookings;
  }
  addBooking(booking: Booking) {
    this.bookings.add(booking);
  }
  updateBookings() {
    let credit = 0;
    this.bookings.forEach((booking) => {
      credit = booking.getUserCredit(this.bookBorrowDaysLimit);
      if (credit >= 10) {
        const newBooking = booking.getBlockUser();
        this.bookings.add(newBooking);
        this.bookings.delete(booking);
        newBooking.resetCredit();
      }
    });
  }
  getBooking(user: User): Booking {
    let booking: Booking;
    const check = Array.from(this.bookings).find(
      (booking) => booking.getUser() === user
    );
    if (check) {
      booking = check;
    } else {
      booking = new Booking(user);
    }
    return booking;
  }
  borrowBook(user: User, book: Book) {
    this.updateBookings();
    const booking = this.getBooking(user);
    const condition = isAfter(booking.getDueDate(), new Date());
    if (condition) {
      throw new LibraryError({
        name: "PERRMISION_DENIED",
        message: "User's banned",
      });
    }
    this.libraryBooks.delete(book);
    booking.borrowBook(book);
    this.bookings.add(booking);
  }
  returnBook(book: Book) {
    this.bookings.forEach((booking) => {
      if (booking.checkBook(book)) {
        booking.returnBook(book);
        this.libraryBooks.add(book);
        console.log("TOO");

        return;
      }
    });
    throw new LibraryError({
      name: "INVALID_BOOK",
      message: "Book is not in bookings",
    });
  }
}
const book1 = new Book("Title 1", "Author 1", 2021, 1);
const book2 = new Book("Title 2", "Author 2", 2005, 2);
const book3 = new Book("Title 3", "Author 3", 1998, 3);
const book4 = new Book("Title 4", "Author 4", 2010, 4);
const book5 = new Book("Title 5", "Author 5", 2022, 5);
const library = new Library(200000);
