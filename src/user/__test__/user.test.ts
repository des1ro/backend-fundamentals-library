import { User } from "../user.dto";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("Book test suite", () => {
  it("Should create user object correctly", () => {
    //Given
    const testName = "Test name";
    const testDueDate = 1647959027055;
    const testPenaltyPoints = 20;
    //When
    const objectUnderTest = new User(testName, testDueDate, testPenaltyPoints);
    //Then
    expect(objectUnderTest).toMatchSnapshot();
  });
});
