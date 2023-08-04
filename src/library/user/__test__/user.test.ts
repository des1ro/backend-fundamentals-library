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
    expect(objectUnderTest.getPenaltyPoints()).toBe(0);
    expect(result).toBeTruthy();
  });
  it("Should set penaltyPoints properly", () => {
    //Given
    const penaltyPoints = 5;
    objectUnderTest.addPenaltyPoints(penaltyPoints);
    //When
    const result = objectUnderTest.getPenaltyPoints();
    //Then
    expect(result).toBe(penaltyPoints);
  });
});
