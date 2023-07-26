import { validate } from "uuid";
import { User } from "../user";
describe("Book test suite", () => {
  let objectUnderTest: User;

  it("Should create book object properly", () => {
    //Given
    const testName = "Test name";
    //When
    objectUnderTest = new User(testName);
    const result: boolean = validate(objectUnderTest.getUuid());
    //Then
    expect(objectUnderTest.getName()).toBe(testName);
    expect(objectUnderTest.getCredit()).toBe(0);
    expect(result).toBeTruthy();
  });
  it("Should set credit properly", () => {
    //Given
    const credit = 5;
    objectUnderTest.setCredit(credit);
    //When
    const result = objectUnderTest.getCredit();
    //Then
    expect(result).toBe(credit);
  });
});
