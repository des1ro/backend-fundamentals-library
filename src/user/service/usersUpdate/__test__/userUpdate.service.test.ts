import { addDays, addMonths } from "date-fns";
import { Booking } from "../../../../booking/booking.service";
import { User } from "../../../user.dto";
import { UsersUpdate } from "../usersUpdate.service";
jest.mock("crypto", () => ({
  randomUUID: jest.fn().mockReturnValue("test-uuid"),
}));
describe("UserUpdate test suite", () => {
  let objectUnderTest: UsersUpdate;
  let mockedUserOne: User;
  let mockedUserTwo: User;
  let mockedBookingOne: Booking;
  let mockedBookingTwo: Booking;
  let mockedDatesBeforeLimit: Date[];
  let mockedDatesAfterLimit: Date[];
  let spyUser: jest.SpyInstance;
  let spyBooking: jest.SpyInstance;
  beforeEach(() => {
    objectUnderTest = new UsersUpdate();
  });
  beforeAll(() => {
    mockedUserOne = new User("Mocked user one");
    mockedUserTwo = new User("Mocked user two");
    mockedBookingOne = new Booking(mockedUserOne);
    mockedBookingTwo = new Booking(mockedUserTwo);
    mockedDatesBeforeLimit = [
      addDays(new Date(), 20),
      addDays(new Date(), 24),
      addDays(new Date(), 10),
    ];
    mockedDatesAfterLimit = [
      addDays(new Date(), 32),
      addDays(new Date(), 33),
      addMonths(new Date(), 1),
    ];
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });
  it("Should return and not add penaltyPoints user if user is banned", () => {
    //Given
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
    const testDate = addDays(new Date(), 1).getTime();
    spyUser = jest.spyOn(mockedUserOne, "getDueDate").mockReturnValue(testDate);
    spyBooking = jest
      .spyOn(mockedBookingOne, "getBooksDatesArray")
      .mockReturnValue(mockedDatesAfterLimit);
    const mockedMap = new Map<User, Booking>();
    //When
    mockedMap.set(mockedUserOne, mockedBookingOne);
    objectUnderTest.update(mockedMap);
    //Then
    expect(mockedUserOne).toMatchSnapshot();
    expect(spyUser).toBeCalledTimes(1);
    expect(spyBooking).toBeCalledTimes(0);
  });
  it("Should return and not add penaltyPoints if users books not reach limit", () => {
    //Given
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
    const testDate = new Date().getTime();
    spyUser = jest.spyOn(mockedUserOne, "getDueDate").mockReturnValue(testDate);
    spyBooking = jest
      .spyOn(mockedBookingOne, "getBooksDatesArray")
      .mockReturnValue(mockedDatesBeforeLimit);
    const mockedMap = new Map<User, Booking>();
    //When
    mockedMap.set(mockedUserOne, mockedBookingOne);
    objectUnderTest.update(mockedMap);
    //Then
    expect(mockedUserOne).toMatchSnapshot();
    expect(spyUser).toBeCalledTimes(1);
    expect(spyBooking).toBeCalledTimes(1);
  });
  it("Should add penaltyPoints and ban user if books reach limit", () => {
    //Given
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 12, 30, 0, 0));
    const testDate = new Date().getTime();
    spyUser = jest.spyOn(mockedUserOne, "getDueDate").mockReturnValue(testDate);
    spyBooking = jest
      .spyOn(mockedBookingOne, "getBooksDatesArray")
      .mockReturnValue(mockedDatesAfterLimit);
    const mockedMap = new Map<User, Booking>();
    //When
    mockedMap.set(mockedUserOne, mockedBookingOne);
    objectUnderTest.update(mockedMap);

    //Then
    expect(mockedUserOne).toMatchSnapshot();
    expect(spyBooking).toBeCalledTimes(1);
    expect(spyUser).toBeCalledTimes(1);
  });
});
