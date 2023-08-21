import { randomUUID } from "crypto";
export class User {
  readonly uuid: string = randomUUID();
  private dueDate?: number;
  private penaltyPoints = 0;
  constructor(readonly name: string) {}
  getPenaltyPoints() {
    return this.penaltyPoints;
  }
  addPenaltyPoints(penaltyPoints: number): void {
    this.penaltyPoints += penaltyPoints;
  }
  getDueDate() {
    return this.dueDate || 0;
  }
  setDueDate(date: number): void {
    this.dueDate = date;
  }
  resetPenaltyPoints(): void {
    this.penaltyPoints = 0;
  }
}
