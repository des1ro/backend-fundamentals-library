import { randomUUID } from "crypto";
export class User {
  readonly uuid: string = randomUUID();
  private dueDate?: Date;
  private penaltyPoints = 0;
  constructor(readonly name: string) {}
  getPenaltyPoints() {
    this.penaltyPoints;
    return this.penaltyPoints;
  }
  addPenaltyPoints(penaltyPoints: number): void {
    this.penaltyPoints += penaltyPoints;
  }
  getDueDate() {
    const dueDate = this.dueDate || 0;
    return dueDate;
  }
  setDueDate(date: Date): void {
    this.dueDate = date;
  }
  resetPenaltyPoints(): void {
    this.penaltyPoints = 0;
  }
}
