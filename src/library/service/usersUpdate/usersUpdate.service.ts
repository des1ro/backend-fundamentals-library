import { PenaltyPoints } from "./service/penaltyPoints/penaltyPoints.service";
import { isAfter } from "date-fns";
import { User } from "../../../user/user.dto";
import { Booking } from "../booking/booking.service";

export class UsersUpdate {
  private readonly penaltyPointsCalc: PenaltyPoints;
  // Nie wstrzykuje zależności, bo musi pobierać cały czas dane z library by były aktualne do aktualizacji, inaczej by to wyglądało gdyby była baza danych,
  // wtedy bym pobierał za każdym razem z bazy
  constructor() {
    this.penaltyPointsCalc = new PenaltyPoints();
  }

  update(bookings: Map<User, Booking>) {
    const currentDate = new Date();
    bookings.forEach((booking, user) => {
      const isBanned = isAfter(user.getDueDate(), currentDate);
      if (isBanned) return;
      const datesArray = booking.getBooksDatesArray();
      const penaltyPoints =
        this.penaltyPointsCalc.calculatePenaltyPoints(datesArray);
      this.penaltyPointsCalc.updatePenaltyPointsAndBan(user, penaltyPoints);
    });
  }
}
