import { Book } from "../../../book/book";
import { LibraryError } from "../../../exceptions/library.exceptions";
import { User } from "../../../user/user";
import { Library } from "../library.service";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("Library test suite", () => {
  let objectUnderTest: Library;
  let mockedUserOne: User;
  let mockedBookOne: Book;
  let mockedBookTwo: Book;
  beforeAll(() => {
    mockedBookOne = new Book("Test title One", "Test author One", 1992, 1);
    mockedBookTwo = new Book("Test title Two", "Test author Two", 1995, 2);
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
  });
  beforeEach(() => {
    mockedUserOne = new User("Test user one");
    objectUnderTest = new Library();
  });
  afterEach(() => {
    jest.clearAllMocks();
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
      jest.spyOn(objectUnderTest, "deleteBook");
      //When
      objectUnderTest.addBook(mockedBookOne);
      const resultOne = objectUnderTest.getBooks();
      objectUnderTest.deleteBook(mockedBookOne);
      const resultTwo = objectUnderTest.getBooks();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(objectUnderTest.deleteBook).toBeCalledWith(mockedBookOne);
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
  describe("Borrow book suite test", () => {
    it("Should create new booking if isn't in bookings ", () => {
      //When
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultOne = objectUnderTest.getBookings();
      objectUnderTest.addBook(mockedBookOne);
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest.getBookings();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
    });
    it("Should borrow book and set available to false", () => {
      //Given
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest.getBooks();
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest.getBooks();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
    });
  });
  describe("Return book suite test", () => {
    it("Should return book properly and set to be available in library", () => {
      //Given
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest.getBooks();
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest.getBooks();
      objectUnderTest.returnBook(mockedBookOne);
      const resultThree = objectUnderTest.getBooks();
      //Then
      expect(resultOne).toStrictEqual(resultThree);
      expect(resultTwo).toMatchSnapshot();
    });
    it("Should throw an LibraryError on return wrong book", () => {
      //Given
      objectUnderTest.addBook(mockedBookOne);
      //When
      const resultOne = objectUnderTest.getBooks();
      objectUnderTest.borrowBook(mockedUserOne, mockedBookOne);
      const resultTwo = objectUnderTest.getBooks();
      //Then
      expect(resultOne).toMatchSnapshot();
      expect(resultTwo).toMatchSnapshot();
      expect(() => objectUnderTest.returnBook(mockedBookTwo)).toThrow(
        LibraryError
      );
    });
  });
});
