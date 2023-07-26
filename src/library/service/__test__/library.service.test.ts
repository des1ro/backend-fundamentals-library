import { Book } from "../../book/book";
import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user";
import { Booking } from "../components/booking";
import { Library } from "../library.service";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("Library test suite", () => {
  let objectUnderTest: Library;
  let mockedUserOne: User;
  let mockedUserTwo: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  let mockedBookingOne: Booking;
  let mockedBookingTwo: Booking;
  let testDate: Date;
  let spy: jest.SpyInstance;
  const testBookBorrowDaysLimit = 30;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1992, 1);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995, 2);
  });
  beforeEach(() => {
    mockedUserOne = new User("Test user one");
    mockedUserTwo = new User("Test user one");
    objectUnderTest = new Library(testBookBorrowDaysLimit);
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  it("Should add book properly", () => {
    //When
    const resultOne = objectUnderTest.getBooks();
    objectUnderTest.addBook(mockedBookOne);
    const resultTwo = objectUnderTest.getBooks();
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(resultTwo).toMatchSnapshot();
  });
  describe("Delete book test suite", () => {
    it("Should delete book properly", () => {
      //Given
      spy = jest.spyOn(objectUnderTest, "deleteBook");
      //When
      objectUnderTest.addBook(mockedBookOne);
      const resultOne = objectUnderTest.getBooks();
      objectUnderTest.deleteBook(mockedBookOne);
      const resultTwo = objectUnderTest.getBooks();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(spy).toBeCalledWith(mockedBookOne);
    });
    it("Should throw an LibraryError if book isn't in library", () => {
      //When
      const result = objectUnderTest.getBooks();
      //Then
      expect(result).toMatchSnapshot();
      expect(() => objectUnderTest.deleteBook(mockedBookOne)).toThrow(
        LibraryError
      );
    });
  });
  describe("Update booking test suite", () => {
    it("Should only add credit if user credit < 10", () => {
      //Given
      jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
      objectUnderTest = new Library(testBookBorrowDaysLimit);
      mockedBookingOne = new Booking(mockedUserOne);
      //When
      const spy = jest
        .spyOn(mockedBookingOne, "getUserCredit")
        .mockReturnValue(9);
      objectUnderTest.addBooking(mockedBookingOne);
      objectUnderTest.updateBookings();
      const result = objectUnderTest.getBookings();
      //Then
      expect(spy).toBeCalledTimes(1);
      expect(result).toMatchSnapshot();
    });
    it("Should add user to block list if credit >= 10 ", () => {
      //Given
      jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
      objectUnderTest = new Library(testBookBorrowDaysLimit);
      mockedBookingOne = new Booking(mockedUserOne);
      //When
      jest.spyOn(mockedBookingOne, "getUserCredit").mockReturnValue(10);
      objectUnderTest.addBooking(mockedBookingOne);
      const resultOne = objectUnderTest.getBookings();
      objectUnderTest.updateBookings();
      const resultTwo = objectUnderTest.getBookings();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
    });
  });

  it("Should return booking if it's in bookings", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    mockedBookingOne = new Booking(mockedUserOne);
    mockedBookingTwo = new Booking(mockedUserTwo);
    objectUnderTest.addBooking(mockedBookingOne);
    objectUnderTest.addBooking(mockedBookingTwo);
    //When
    const resultOne = objectUnderTest.getBooking(mockedUserOne);
    const resultTwo = objectUnderTest.getBookings();
    //Then
    expect(resultOne).toBe(mockedBookingOne);
    expect(resultTwo).toMatchSnapshot();
  });

  it("Should return new booking if isn't in bookings ", () => {
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    mockedBookingOne = new Booking(mockedUserOne);
    mockedBookingTwo = new Booking(mockedUserTwo);
    objectUnderTest.addBooking(mockedBookingTwo);
    //When
    const resultOne = objectUnderTest.getBooking(mockedUserOne);
    const resultTwo = objectUnderTest.getBookings();
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(resultTwo).toMatchSnapshot();
  });
  it("Should delete book form library and add to booking if user isn't banned ", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    //When
    objectUnderTest.addBook(mockedBookOne);
    objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
    const resultOne = objectUnderTest.getBooks();
    const resultTwo = objectUnderTest.getBookings();
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(resultTwo).toMatchSnapshot();
  });
  it("Should throw an LibraryError if banned user want to borrow book", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    objectUnderTest = new Library(testBookBorrowDaysLimit);
    testDate = new Date(2023, 8, 20, 12, 30, 0, 0);
    mockedBookingOne = new Booking(mockedUserOne, testDate);
    //When
    objectUnderTest.addBooking(mockedBookingOne);
    objectUnderTest.addBook(mockedBookOne);
    const resultOne = objectUnderTest.getBooking(mockedUserOne);
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(() =>
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne)
    ).toThrow(LibraryError);
  });
  it("Should return book properly", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    testDate = new Date();
    const books = new Map<Book, Date>();
    books.set(mockedBookOne, testDate);
    const testBooking = new Booking(mockedUserOne, testDate, books);
    //When
    objectUnderTest.addBooking(testBooking);
    const resultOne = objectUnderTest.getBooking(mockedUserOne);
    //Then
    expect(resultOne).toMatchSnapshot();
  });
  it("Should throw an LibraryError on returnig book, which isn't in bookings", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    testDate = new Date();
    const books = new Map<Book, Date>();
    books.set(mockedBookOne, testDate);
    const testBooking = new Booking(mockedUserOne, testDate, books);
    //When
    objectUnderTest.addBooking(testBooking);
    const resultOne = objectUnderTest.getBooking(mockedUserOne);
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(() => objectUnderTest.returnBook(mockedBookTwo)).toThrow(
      LibraryError
    );
  });
});
