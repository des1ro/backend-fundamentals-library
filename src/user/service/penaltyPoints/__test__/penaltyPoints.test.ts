import { addDays, addMonths } from "date-fns";
import { User } from "../../../user.dto";
import { PenaltyPoints } from "../penaltyPoints.service";

describe("PenaltyPoints test suite", () => {
  let objectUnderTest: PenaltyPoints;
  let testUserOne: User;
  beforeEach(() => {
    testUserOne = new User("test user one");
    jest.useFakeTimers();
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
      const testDate = new Date().getTime();
      const expectedDate = new Date().setMonth(
        new Date().getTime() + testPenaltyPointsValue / 10
      );
      objectUnderTest = new PenaltyPoints();
      jest.spyOn(objectUnderTest, "updatePenaltyPointsAndBan");
      //When
      const resultOne = testUserOne.getDueDate();
      console.log(resultOne);

      objectUnderTest.updatePenaltyPointsAndBan(
        testUserOne,
        testPenaltyPointsValue
      );
      const resultTwo = testUserOne.getDueDate();
      //Then
      expect(objectUnderTest.updatePenaltyPointsAndBan).toBeCalledTimes(1);
      expect(resultOne).toBe(0);
      expect(resultTwo).toBe(expectedDate);
    });
    it("Should not ban user if not reach 10 penalty points", () => {
      //Given
      const testDate = new Date().getTime();
      objectUnderTest = new PenaltyPoints();
      const testPenaltyPointsValue = 9;
      //When
      objectUnderTest.updatePenaltyPointsAndBan(
        testUserOne,
        testPenaltyPointsValue
      );
      const resultOne = testUserOne.getDueDate();
      //Then
      expect(resultOne).toBe(testDate);
    });
  });

  it("Should add penalty points if book reach limit", () => {
    //Given
    jest.setSystemTime(new Date());
    const testDates: Date[] = [
      addDays(new Date(), 45),
      addDays(new Date(), 33),
      addMonths(new Date(), 1),
    ];
    const expectedResultOne = (1 + 1 + 1) * 10;
    objectUnderTest = new PenaltyPoints();
    //When
    const resultOne = objectUnderTest.calculatePenaltyPoints(testDates);
    //Then
    expect(resultOne).toBe(expectedResultOne);
  });
  it("Should not add penalty points if book not reach limit ", () => {
    //Given
    jest.setSystemTime(new Date());
    const testDates: Date[] = [
      addDays(new Date(), 20),
      addDays(new Date(), 24),
      addDays(new Date(), 10),
    ];
    const expectedResultOne = (0 + 0 + 0) * 10;
    objectUnderTest = new PenaltyPoints();
    //When
    const resultOne = objectUnderTest.calculatePenaltyPoints(testDates);
    //Then
    expect(resultOne).toBe(expectedResultOne);
  });
});
