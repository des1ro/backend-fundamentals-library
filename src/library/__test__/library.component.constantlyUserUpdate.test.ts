import { Library } from "../library.component";

jest.mock("node-cron", () => ({
  schedule: jest.fn(),
}));
describe("Library constantlyUserUpdate test suite", () => {
  let objectUnderTest: Library;
  let updateSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 0, 20, 5, 30, 0, 0));
  });
  beforeEach(() => {
    objectUnderTest = new Library();
    updateSpy = jest.spyOn(objectUnderTest["usersUpdate"], "update");
    logSpy = jest.spyOn(console, "log");
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it("Should call constantlyUpdateUsers method and log messages", () => {
    const { schedule } = require("node-cron");
    (schedule as jest.Mock).mockImplementationOnce(
      async (frequency, callback) => {
        await callback();
      }
    );
    // When
    objectUnderTest.constantlyUpdateUsers();
    jest.advanceTimersToNextTimer();
    // Then
    expect(schedule).toHaveBeenCalledWith(
      "* 30 5 * * * ",
      expect.any(Function)
    );
    expect(logSpy).toHaveBeenCalledWith("Update users every day at 5:30");
    expect(logSpy).toHaveBeenCalledWith("Library users updated");
    expect(updateSpy).toHaveBeenCalled();
  });
});
