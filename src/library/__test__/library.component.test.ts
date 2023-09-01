import { Book } from "../../book/book.dto";
import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user.dto";
import { Library } from "../library.component";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
jest.mock("node-cron", () => {
  return {
    schedule: jest.fn(),
  };
});
describe("Library test suite", () => {
  let objectUnderTest: Library;
  let mockedUserOne: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1992);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995);
  });
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
    mockedUserOne = new User("Test user one");
    objectUnderTest = new Library();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("Should add book to library properly", () => {
    //When
    const resultOne = objectUnderTest;
    objectUnderTest.addBook(mockedBookOne);
    const resultTwo = objectUnderTest;
    //Then
    expect(resultOne).toMatchSnapshot();
    expect(resultTwo).toMatchSnapshot();
  });
  describe("Delete book test suite", () => {
    it("Should set books amoount properly", () => {
      //Given
      jest.spyOn(objectUnderTest, "deleteBook");
      //When
      objectUnderTest.addBook(mockedBookOne, 10);
      const resultOne = objectUnderTest;
      objectUnderTest.deleteBook(mockedBookOne, 2);
      const resultTwo = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(objectUnderTest.deleteBook).toBeCalledTimes(1);
    });
    it("Should delete book if if delete more than is in library", () => {
      //Given
      jest.spyOn(objectUnderTest, "deleteBook");
      //When
      objectUnderTest.addBook(mockedBookOne, 10);
      const resultOne = objectUnderTest;
      objectUnderTest.deleteBook(mockedBookOne, 11);
      const resultTwo = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(objectUnderTest.deleteBook).toBeCalledTimes(1);
    });
    it("Should throw an LibraryError if book isn't in library", () => {
      //When
      const result = objectUnderTest;
      //Then
      expect(result).toMatchSnapshot();
      expect(() => objectUnderTest.deleteBook(mockedBookOne)).toThrow(
        LibraryError
      );
    });
  });
  describe("Create booking test suite", () => {
    it("Should create booking correctly", () => {
      //Given
      jest.spyOn(objectUnderTest, "createBooking");
      //When
      const resultOne = objectUnderTest;
      objectUnderTest.createBooking(mockedUserOne);
      const resultTwo = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(objectUnderTest.createBooking).toBeCalledTimes(1);
    });
    it("Should throw library error if booking with this user already exist", () => {
      //Given
      jest.spyOn(objectUnderTest, "createBooking");
      //When
      objectUnderTest.createBooking(mockedUserOne);
      const result = objectUnderTest;
      //Then
      expect(result).toMatchSnapshot();
      expect(() => objectUnderTest.createBooking(mockedUserOne)).toThrow(
        LibraryError
      );
      expect(objectUnderTest.createBooking).toBeCalledTimes(2);
    });
  });

  describe("Borrow book suite test", () => {
    it("Should set new amount of books if user borrow", () => {
      //Given
      objectUnderTest.createBooking(mockedUserOne);
      objectUnderTest.addBook(mockedBookOne);
      const resultOne = objectUnderTest;
      //When
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
    });
    it("Should throw an LibraryError if book isn't in library", () => {
      //Given
      objectUnderTest.createBooking(mockedUserOne);
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest;
      jest.spyOn(objectUnderTest, "borrowBook");
      //Then
      expect(() =>
        objectUnderTest.borrowBook(mockedUserOne, mockedBookTwo)
      ).toThrow(LibraryError);
      expect(objectUnderTest.borrowBook).toBeCalledTimes(1);
      expect(resultOne).toMatchSnapshot();
    });
    it("Should throw an LibraryError if booking don't exist", () => {
      //Given
      objectUnderTest.addBook(mockedBookOne);
      jest.spyOn(objectUnderTest, "borrowBook");
      //When
      const result = objectUnderTest;
      //Then
      expect(() =>
        objectUnderTest.borrowBook(mockedUserOne, mockedBookOne)
      ).toThrow(LibraryError);
      expect(result).toMatchSnapshot();
      expect(objectUnderTest.borrowBook).toBeCalledTimes(1);
    });
  });
  describe("Return book suite test", () => {
    it("Should return book properly and set new value in library", () => {
      //Given
      jest.spyOn(objectUnderTest, "returnBook");
      objectUnderTest.createBooking(mockedUserOne);
      objectUnderTest.addBook(mockedBookOne, 5);
      const resultOne = objectUnderTest;
      //When
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest;
      objectUnderTest.returnBook(mockedUserOne, mockedBookOne);
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(objectUnderTest.returnBook).toBeCalledTimes(1);
    });
    it("Should throw an LibraryError on return wrong book", () => {
      //Given
      objectUnderTest.createBooking(mockedUserOne);
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest;
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(() =>
        objectUnderTest.returnBook(mockedUserOne, mockedBookTwo)
      ).toThrow(LibraryError);
    });
    it("Should throw an LibraryError if booking not exist", () => {
      //Given
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest;
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(() =>
        objectUnderTest.returnBook(mockedUserOne, mockedBookTwo)
      ).toThrow(LibraryError);
    });
  });
});
