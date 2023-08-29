import { randomUUID } from "crypto";

export class User {
  readonly uuid: string = randomUUID();
  constructor(
    readonly name: string,
    private dueDate = 0,
    private penaltyPoints = 0
  ) {}
  getDueDate(): number {
    return this.dueDate;
  }
  getPenaltyPoints(): number {
    return this.penaltyPoints;
  }
  setDueDate(dueDate: number): void {
    this.dueDate = dueDate;
  }
  setPenaltyPoints(penaltyPoints: number): void {
    this.penaltyPoints = penaltyPoints;
  }
}
