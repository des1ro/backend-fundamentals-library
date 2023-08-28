import { randomUUID } from "crypto";
export class User {
  readonly uuid: string = randomUUID();
  constructor(
    readonly name: string,
    private dueDate: number = 0,
    private penaltyPoints: number = 0
  ) {}
  getDueDate() {
    return this.dueDate;
  }
  getPenaltyPoints() {
    return this.penaltyPoints;
  }
  setDueDate(dueDate: number) {
    this.dueDate = dueDate;
  }
  setPenaltyPoints(penaltyPoints: number) {
    this.penaltyPoints = penaltyPoints;
  }
}
