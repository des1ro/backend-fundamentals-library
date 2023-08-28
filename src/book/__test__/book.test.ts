import { Book } from "../book.dto";
describe("Book test suite", () => {
  let objectUnderTest: Book;
  it("Should create book object properly", () => {
    //Given
    const testTitle = "Test title";
    const testAuthor = "Test author";
    const testYear = 2021;
    //When
    objectUnderTest = new Book(testTitle, testAuthor, testYear);
    //Then
    expect(objectUnderTest.title).toBe(testTitle);
    expect(objectUnderTest.author).toBe(testAuthor);
    expect(objectUnderTest.year).toBe(testYear);
  });
});
