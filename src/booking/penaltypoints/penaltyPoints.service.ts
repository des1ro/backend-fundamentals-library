import { addMonths, differenceInMonths } from "date-fns";
import { User } from "../../user/user";
export class PenaltyPoints {
  private readonly borrowMonthsLimit: number;
  private readonly penaltyPointsPerBook: number;
  constructor() {
    this.borrowMonthsLimit = 1;
    this.penaltyPointsPerBook = 10;
  }
  updatePenaltyPointsAndBan(user: User, penaltyPoints: number): void {
    user.addPenaltyPoints(penaltyPoints);
    const userPenatlyPoints = user.getPenaltyPoints();
    const banMonths = userPenatlyPoints / 10;
    const currentDate = new Date();
    const dueDateWithAddedMonths = addMonths(currentDate, banMonths).getTime();
    user.setDueDate(dueDateWithAddedMonths);
  }
  calculatePenaltyPoints(booksDates: Date[]): number {
    const currentDate = new Date();
    const totalPoints = booksDates.reduce((accumulator, bookDate) => {
      const difference = differenceInMonths(currentDate, bookDate);
      return (
        accumulator +
        (difference >= this.borrowMonthsLimit ? this.penaltyPointsPerBook : 0)
      );
    }, 0);
    return totalPoints;
  }
}
