import { randomUUID } from "crypto";
import { Book } from "../../book/book.dto";
import { User } from "../../user/user.dto";
import { Booking } from "../booking.service";
import { addMonths } from "date-fns";
import { LibraryError } from "../../exceptions/library.exceptions";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("Booking test suite", () => {
  let objectUnderTest: Booking;
  let mockedUser: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  let mockedDate: number;
  let testBookBorrowMonthsLimit: number;
  let testPenaltyPointsPerBook: number;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1999);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995);
    testBookBorrowMonthsLimit = 1;
    testPenaltyPointsPerBook = 10;
  });
  beforeEach(() => {
    mockedUser = new User("Test user");
    objectUnderTest = new Booking(mockedUser);

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  afterAll(() => {
    jest.clearAllMocks();
  });
  describe("Return book suite test", () => {
    it("Should add book to user correctly", () => {
      //Given
      jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
      //When
      objectUnderTest.addBookToUser(mockedBookOne);
      const result = objectUnderTest;
      //Then
      expect(result).toMatchSnapshot();
    });
    it("Should throw library error if banned user want to borrow", () => {
      //Given
      mockedDate = addMonths(new Date(), 1).getTime();
      const spy = jest.spyOn(mockedUser, "getDueDate");
      //When
      spy.mockReturnValue(mockedDate);
      //Then
      expect(() => objectUnderTest.addBookToUser(mockedBookOne)).toThrow(
        LibraryError
      );
      expect(spy).toBeCalledTimes(1);
    });
  });

  describe("Return book suite test", () => {
    it("Should throw error if user want to return wrong book", () => {
      //Given
      objectUnderTest.addBookToUser(mockedBookOne);
      //When
      const spy = jest.spyOn(objectUnderTest, "returnBook");
      //Then
      expect(() => objectUnderTest.returnBook(mockedBookTwo)).toThrow(
        LibraryError
      );
      expect(spy).toBeCalledTimes(1);
    });
    it("Should return book correctly", () => {
      //Given
      const spy = jest.spyOn(objectUnderTest, "returnBook");
      //When
      objectUnderTest.addBookToUser(mockedBookOne);
      //Then
      expect(() => objectUnderTest.returnBook(mockedBookOne)).not.toThrow();
      expect(objectUnderTest).toMatchSnapshot();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
