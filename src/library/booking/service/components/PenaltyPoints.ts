import { addMonths, differenceInMonths } from "date-fns";
import { Book } from "../../../book/book";
import { User } from "../../../user/user";
export class PenaltyPoints {
  constructor(private readonly user: User) {}
  updateUserPenaltyPointsAndBan(penaltyPoints: number): void {
    this.user.addPenaltyPoints(penaltyPoints);
    const banMonths = penaltyPoints / 10;
    this.user.setDueDate(addMonths(new Date(), banMonths));
  }
  calculatePenaltyPoints(
    booksDueDate: Map<Book, Date>,
    bookBorrowMonthsLimit: number,
    penaltyPointsPerBook: number
  ): number {
    const currentDate = new Date();
    return Array.from(booksDueDate.values()).reduce((totalPoints, bookDate) => {
      const difference = differenceInMonths(currentDate, bookDate);
      if (difference >= bookBorrowMonthsLimit) {
        return totalPoints + penaltyPointsPerBook;
      }
      return totalPoints;
    }, 0);
  }
}
