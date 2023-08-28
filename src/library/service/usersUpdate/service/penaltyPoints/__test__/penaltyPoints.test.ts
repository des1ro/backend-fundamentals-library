import { User } from "../../../models/user/user.dto";
import { PenaltyPoints } from "../penaltyPoints.service";

describe("PenaltyPoints test suite", () => {
  let objectUnderTest: PenaltyPoints;
  let testUserOne: User;
  beforeAll(() => {
    jest.useFakeTimers();
  });
  beforeEach(() => {
    testUserOne = new User("test user one");
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });
  describe("Update penalty points test suite", () => {
    it("Should add users penalty points correctly", () => {
      //Given
      const testPenaltyPointsValue = 10;
      objectUnderTest = new PenaltyPoints();
      const resultOne = testUserOne.getPenaltyPoints();
      //When
      objectUnderTest.updatePenaltyPointsAndBan(
        testUserOne,
        testPenaltyPointsValue
      );
      const resultTwo = testUserOne.getPenaltyPoints();
      //Then
      expect(resultOne).toBe(0);
      expect(resultTwo).toBe(testPenaltyPointsValue);
    });
    it("Should ban the user for a month for every 10 penalty points", () => {
      //Given
      const testPenaltyPointsValue = 20;
      jest.setSystemTime();
      const testDate = new Date();
      const expectedDate = testDate.setMonth(
        testDate.getMonth() + testPenaltyPointsValue / 10
      );
      objectUnderTest = new PenaltyPoints();
      jest.spyOn(objectUnderTest, "updatePenaltyPointsAndBan");
      //When
      const resultOne = testUserOne.getDueDate();
      objectUnderTest.updatePenaltyPointsAndBan(
        testUserOne,
        testPenaltyPointsValue
      );
      const resultTwo = testUserOne.getDueDate();
      //Then
      expect(objectUnderTest).toBeCalledTimes(1);
      expect(resultOne).toBe(testDate);
      expect(resultTwo).toBe(expectedDate);
    });
    it("Should not ban user if not reach 10 penalty points", () => {
      //Given
      jest.setSystemTime();
      jest.spyOn(objectUnderTest, "updatePenaltyPointsAndBan");
      const testDate = new Date();
      objectUnderTest = new PenaltyPoints();
      const testPenaltyPointsValue = 9;
      //When
      objectUnderTest.updatePenaltyPointsAndBan(
        testUserOne,
        testPenaltyPointsValue
      );
      const resultOne = testUserOne.getDueDate();
      //Then
      expect(objectUnderTest).toBeCalledTimes(1);
      expect(resultOne).toBe(testDate);
    });
  });

  it("Should add penalty points if book reach limit", () => {
    //Given
    jest.setSystemTime(new Date(2023, 7, 20, 12, 30, 0, 0));
    const testDates: Date[] = [
      new Date(2023, 6, 15, 12, 30, 0, 10),
      new Date(2023, 6, 20, 12, 30, 0, 1),
      new Date(2023, 5, 20, 12, 30, 0, 10),
      new Date(2023, 5, 19, 12, 30, 0, 0),
    ];
    const expectedResultOne = (1 + 0 + 1 + 2) * 10;
    objectUnderTest = new PenaltyPoints();
    //When
    const resultOne = objectUnderTest.calculatePenaltyPoints(testDates);
    //Then
    expect(resultOne).toBe(expectedResultOne);
  });
  it("Should not add penalty points if book not reach limit ", () => {
    //Given
    jest.setSystemTime(new Date(2023, 7, 20, 12, 30, 0, 0));
    const testDates: Date[] = [
      new Date(2023, 6, 20, 12, 30, 0, 1),
      new Date(2023, 7, 11, 12, 30, 0, 1),
      new Date(2023, 6, 30, 12, 30, 0, 10),
      new Date(2023, 7, 1, 12, 30, 0, 0),
    ];
    const expectedResultOne = (0 + 0 + 0 + 0) * 10;
    objectUnderTest = new PenaltyPoints();
    //When
    const resultOne = objectUnderTest.calculatePenaltyPoints(testDates);
    //Then
    expect(resultOne).toBe(expectedResultOne);
  });
});
