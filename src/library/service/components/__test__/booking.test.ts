import { addDays, addMonths } from "date-fns";
import { Book } from "../../../book/book";
import { User } from "../../../user/user";
import { Booking } from "../booking";
import { LibraryError } from "../../../exceptions/library.exceptions";
jest.mock("../../../book/book");
describe("Booking test suite", () => {
  let objectUnderTest: Booking;
  let mockedUser: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  let testDate: Date;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1992, 1);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995, 2);
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
  it("Should get dueData properly", () => {
    //Given
    testDate = new Date();
    objectUnderTest = new Booking(mockedUser, testDate);
    const date = objectUnderTest.getDueDate();
    //Then
    expect(date).toBe(testDate);
  });
  it("Should check if book is in booking", () => {
    //Given
    objectUnderTest.borrowBook(mockedBookTwo);
    //When
    const resultOne = objectUnderTest.checkBook(mockedBookOne);
    const resultTwo = objectUnderTest.checkBook(mockedBookTwo);
    //Then
    expect(resultOne).toBeFalsy();
    expect(resultTwo).toBeTruthy();
  });
  describe("Get user credit test suite", () => {
    it("Should increase credit if books reach borrow limit", () => {
      //Given
      testDate = addDays(new Date(), 30);
      const borrowLimit = 25;
      objectUnderTest = new Booking(mockedUser);
      const spy = jest.spyOn(objectUnderTest, "borrowBook");
      //When
      objectUnderTest.borrowBook(mockedBookOne);
      jest.setSystemTime(testDate);
      const result = objectUnderTest.getUserCredit(borrowLimit);
      const expectedResult = 30 - 25;
      //Then
      expect(spy).toBeCalledTimes(1);
      expect(result).toBe(expectedResult);
    });
    it("Should get user credit if books don't reach borrow limit", () => {
      //Given
      const testBookBorrowLimit = 1;
      objectUnderTest = new Booking(mockedUser);
      //When
      objectUnderTest.borrowBook(mockedBookOne);
      objectUnderTest.borrowBook(mockedBookTwo);
      const result = objectUnderTest.getUserCredit(testBookBorrowLimit);
      const expectedResult = mockedUser.getCredit();
      //Then
      expect(result).toBe(expectedResult);
    });
    it("Should reset the user's credit if it is blocked", () => {
      //Given
      const testBookBorrowLimit = 20;
      testDate = addDays(new Date(), 30);
      mockedUser.setCredit(5);
      objectUnderTest = new Booking(mockedUser, testDate);
      const spy = jest.spyOn(objectUnderTest, "getUserCredit");
      //When
      const result = mockedUser.getCredit();
      const resultCredit = objectUnderTest.getUserCredit(testBookBorrowLimit);
      //Then
      expect(result).toBe(5);
      expect(resultCredit).toBe(0);
      expect(spy).toBeCalledTimes(1);
    });
  });
  it("Should block user for one month", () => {
    //Given
    objectUnderTest = new Booking(mockedUser);
    const spy = jest.spyOn(objectUnderTest, "getBlockUser");
    //When
    const expectedResult = addMonths(new Date(), 1);
    objectUnderTest = objectUnderTest.getBlockUser();
    //Then
    expect(spy).toBeCalledTimes(1);
    expect(objectUnderTest.getDueDate()).toStrictEqual(expectedResult);
  });
  it("Should return book properly", () => {
    //Given
    jest.setSystemTime(new Date());
    objectUnderTest = new Booking(mockedUser);
    const spy = jest.spyOn(objectUnderTest, "returnBook");
    //When
    objectUnderTest.borrowBook(mockedBookOne);
    const resultOne = objectUnderTest.checkBook(mockedBookOne);
    objectUnderTest.returnBook(mockedBookOne);
    const resultTwo = objectUnderTest.checkBook(mockedBookOne);
    //Then
    expect(resultOne).toBeTruthy();
    expect(resultTwo).toBeFalsy();
    expect(spy).toBeCalledWith(mockedBookOne);
  });
  it("Should throw an error on returing wrong book", () => {
    //Given
    objectUnderTest = new Booking(mockedUser);
    const spy = jest.spyOn(objectUnderTest, "checkBook");
    //When
    objectUnderTest.borrowBook(mockedBookOne);
    const resultOne = objectUnderTest.checkBook(mockedBookOne);
    const resultTwo = objectUnderTest.checkBook(mockedBookTwo);
    //Then
    expect(resultOne).toBeTruthy();
    expect(resultTwo).toBeFalsy();
    expect(spy).toBeCalledTimes(2);
    expect(() => objectUnderTest.returnBook(mockedBookTwo)).toThrow(
      LibraryError
    );
  });
});
