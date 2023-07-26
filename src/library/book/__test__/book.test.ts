import { Book } from "../book";
describe("Book test suite", () => {
  let objectUnderTest: Book;
  it("Should create book object properly", () => {
    //Given
    const testTitle = "Test title";
    const testAuthor = "Test author";
    const testYear = 2021;
    const testId = 37;
    //When
    objectUnderTest = new Book(testTitle, testAuthor, testYear, testId);
    //Then
    expect(objectUnderTest.getTitle()).toBe(testTitle);
    expect(objectUnderTest.getAuthor()).toBe(testAuthor);
    expect(objectUnderTest.getYear()).toBe(testYear);
    expect(objectUnderTest.getId()).toBe(testId);
  });
});
