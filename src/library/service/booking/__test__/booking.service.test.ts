import { addDays, addMonths } from "date-fns";
import { Book } from "../../../models/book/book.dto";
import { LibraryError } from "../../../../exceptions/library.exceptions";
import { User } from "../../../models/user/user.dto";
import { Booking } from "../booking.service";

describe("Booking test suite", () => {
  let objectUnderTest: Booking;
  let mockedUser: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  let testDate: Date;
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
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  it("Should get user properly", () => {
    //Given
    objectUnderTest = new Booking(mockedUser);
    //Then
  });
  const a: object = describe("Get user penalty points test suite", () => {
    it("Should", () => {
      //Given
      //When
      //Then
    });
  });
});
