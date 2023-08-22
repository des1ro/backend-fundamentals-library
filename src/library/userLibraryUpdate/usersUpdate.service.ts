import { Booking } from "../../booking/service/booking.service";
import { User } from "../../user/user";
import * as cron from "node-cron";
import { PenaltyPoints } from "../../booking/penaltypoints/penaltyPoints.service";

export class UsersUpdate {
  private readonly penaltyPointsCalc: PenaltyPoints;
  constructor() {
    this.penaltyPointsCalc = new PenaltyPoints();
  }
  private updateUsersPenaltyPoints(bookings: Map<User, Booking>) {
    bookings.forEach((booking, user) => {
      if (user.isBanned()) return;
      const datesArray = booking._getBooksDatesArray();
      const penaltyPoints =
        this.penaltyPointsCalc.calculatePenaltyPoints(datesArray);
      this.penaltyPointsCalc.updatePenaltyPointsAndBan(user, penaltyPoints);
    });
  }
  update(bookings: Map<User, Booking>) {
    console.log("Library users update running\nUpdate users every day at 5:30");
    cron.schedule("* 30 5 * * * ", () => {
      this.updateUsersPenaltyPoints(bookings);

      //Update users every day at 5:30
    });
  }
}
