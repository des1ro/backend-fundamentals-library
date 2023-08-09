import { addDays, addMonths } from "date-fns";
import { Book } from "../../../book/book";
import { User } from "../../../user/user";
import { Booking } from "../booking.service";
import { LibraryError } from "../../../exceptions/library.exceptions";
describe("Booking test suite", () => {
  let objectUnderTest: Booking;
  let mockedUser: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  let testDate: Date;
  let testBookBorrowMonthsLimit: number;
  let testPenaltyPointsPerBook: number;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1992, 1);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995, 2);
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
    const user = objectUnderTest.getUser();
    //Then
    expect(user).toBe(mockedUser);
  });

  describe("Get user penalty points test suite", () => {
    it("Should increase penalty points if books reach borrow limit", () => {
      //Given
      objectUnderTest = new Booking(mockedUser);
      jest.spyOn(objectUnderTest, "isUserBanned").mockReturnValue(false);
      testDate = addMonths(new Date(), 1);
      testDate = addDays(testDate, 1);
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      jest.setSystemTime(testDate);
      objectUnderTest.checkUserPenaltyPoints(
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      const result = objectUnderTest.getUserPenaltyPoints();
      //Then
      expect(result).toBe(testPenaltyPointsPerBook);
      expect(objectUnderTest.isUserBanned).toHaveBeenCalledTimes(1);
    });
    it("Should not increase user penalty points if books don't reach borrow limit", () => {
      //Given
      objectUnderTest = new Booking(mockedUser);
      jest.spyOn(objectUnderTest, "isUserBanned");
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      objectUnderTest.addBookToUser(
        mockedBookTwo,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      testDate = addMonths(new Date(), 1);
      testDate = addDays(testDate, -1);
      jest.setSystemTime(testDate);
      const result = objectUnderTest.getUserPenaltyPoints();
      //Then
      expect(result).toBe(0);
      expect(objectUnderTest.isUserBanned).toHaveBeenCalledTimes(2);
    });
  });
  describe("isUserBanned test suite", () => {
    it("Should return false if user is not banned and not have books more than month", () => {
      //Given
      objectUnderTest = new Booking(mockedUser);
      testDate = addMonths(new Date(), 1);
      testDate = addDays(testDate, -1);
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      jest.setSystemTime(testDate);
      const expectedResult = objectUnderTest.isUserBanned(
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      //Then
      expect(expectedResult).toBe(false);
    });
    it("Should return true if user have books more than month", () => {
      //Given
      objectUnderTest = new Booking(mockedUser);
      testDate = addMonths(new Date(), 1);
      testDate = addDays(testDate, 1);
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      jest.setSystemTime(testDate);
      const expectedResult = objectUnderTest.isUserBanned(
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      //Then
      expect(expectedResult).toBe(true);
    });
    it("Should return true if user is banned", () => {
      //Given
      objectUnderTest = new Booking(mockedUser);
      //When
      mockedUser.setDueDate(addDays(new Date(), 1));
      const expectedResult = objectUnderTest.isUserBanned(
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      //Then
      expect(expectedResult).toBe(true);
    });
  });

  it("Should add book to user properly", () => {
    //Given
    jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
    mockedUser = new User("test user");
    objectUnderTest = new Booking(mockedUser);
    jest.spyOn(objectUnderTest, "addBookToUser");
    //When
    objectUnderTest.addBookToUser(
      mockedBookOne,
      testBookBorrowMonthsLimit,
      testPenaltyPointsPerBook
    );
    const expectedResult = objectUnderTest.getBooksDueDate();
    //Then
    expect(expectedResult).toMatchSnapshot();
    expect(objectUnderTest.addBookToUser).toBeCalledTimes(1);
  });
  it("Should throw an error, when banned user wants to borrow book", () => {
    //Given
    objectUnderTest = new Booking(mockedUser);
    //When
    jest.spyOn(objectUnderTest, "isUserBanned").mockReturnValueOnce(true);
    //Then

    expect(() =>
      objectUnderTest.addBookToUser(
        mockedBookTwo,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      )
    ).toThrow(LibraryError);
    expect(objectUnderTest.isUserBanned).toBeCalledTimes(1);
  });
  describe("Return book test suite", () => {
    it("Should return the book without any changes if it was returned on time", () => {
      //Given
      jest.setSystemTime(new Date(2023, 6, 20, 12, 30, 0, 0));
      mockedUser = new User("test user");
      objectUnderTest = new Booking(mockedUser);
      testDate = addMonths(new Date(), 1);
      testDate = addDays(testDate, -1);
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      const resultOne = objectUnderTest.getBooksDueDate();
      const snapshotOne = objectUnderTest.getBooksDueDate();
      jest.setSystemTime(testDate);
      objectUnderTest.returnBook(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      const resultTwo = objectUnderTest.getBooksDueDate();
      const snapshotTwo = objectUnderTest.getBooksDueDate();
      //Then
      expect(resultOne).toBe(resultTwo);
      expect(snapshotOne).toMatchSnapshot();
      expect(snapshotTwo).toMatchSnapshot();
    });
    it("Should add 10 points for every late book and remove 10 on return book", () => {
      //Given
      testDate = addMonths(new Date(), testBookBorrowMonthsLimit);
      testDate = addDays(testDate, 1);
      objectUnderTest = new Booking(mockedUser);
      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      objectUnderTest.addBookToUser(
        mockedBookTwo,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      jest.setSystemTime(testDate);
      objectUnderTest.returnBook(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      const result = objectUnderTest.getUserPenaltyPoints();
      const expectedResult = 20 - 10;
      //Then
      expect(result).toBe(expectedResult);
    });
    it("Should ban the user for a month for each remaining late book", () => {
      //Given
      jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
      testDate = addMonths(new Date(), testBookBorrowMonthsLimit);
      testDate = addDays(testDate, 1);
      mockedUser = new User("Test user");
      objectUnderTest = new Booking(mockedUser);

      //When
      objectUnderTest.addBookToUser(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      objectUnderTest.addBookToUser(
        mockedBookTwo,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      jest.setSystemTime(testDate);
      objectUnderTest.returnBook(
        mockedBookOne,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      );
      const resultOne = objectUnderTest.getUserDueDate();
      const expectedResultOne = addMonths(new Date(), 2);
      //Then
      expect(expectedResultOne).toStrictEqual(resultOne);
    });
  });
  it("Should throw an Library error on returning wrong book", () => {
    //Given
    objectUnderTest = new Booking(mockedUser);

    //When
    objectUnderTest.addBookToUser(
      mockedBookOne,
      testBookBorrowMonthsLimit,
      testPenaltyPointsPerBook
    );
    //Then
    expect(() =>
      objectUnderTest.returnBook(
        mockedBookTwo,
        testBookBorrowMonthsLimit,
        testPenaltyPointsPerBook
      )
    ).toThrow(LibraryError);
  });
});
