import { addMonths, differenceInMonths } from "date-fns";
import { User } from "../../../user/user";
import { Book } from "../../../book/book";

export class PenaltyPoints {
  private readonly borrowMonthsLimit: number;
  private readonly penaltyPointsPerBook: number;
  constructor(private readonly user: User) {
    this.borrowMonthsLimit = 1;
    this.penaltyPointsPerBook = 10;
  }

  updatePenaltyPointsAndBan(penaltyPoints: number): void {
    this.user.addPenaltyPoints(penaltyPoints);
    const banMonths = penaltyPoints / 10;
    const currentDate = new Date();
    const dueDateWithAddedMonths = addMonths(currentDate, banMonths).getTime();
    this.user.setDueDate(dueDateWithAddedMonths);
  }

  calculatePenaltyPoints(booksDueDate: Map<Book, Date>): number {
    const currentDate = new Date();
    let totalPoints = 0;
    for (const bookDate of booksDueDate.values()) {
      const difference = differenceInMonths(currentDate, bookDate);
      totalPoints +=
        difference >= this.borrowMonthsLimit ? this.penaltyPointsPerBook : 0;
    }
    return totalPoints;
  }
}
