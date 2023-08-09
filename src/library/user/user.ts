import { randomUUID } from "crypto";

export class User {
  readonly uuid: string = randomUUID();
  private dueDate: Date;
  private penaltyPoints: number = 0;
  constructor(private readonly name: string) {
    this.dueDate = new Date("2000");
  }
  getName(): string {
    return this.name;
  }
  getPenaltyPoints(): number {
    return this.penaltyPoints;
  }
  addPenaltyPoints(penaltyPoints: number): void {
    this.penaltyPoints += penaltyPoints;
  }
  getDueDate(): Date {
    return this.dueDate;
  }
  setDueDate(date: Date): void {
    this.dueDate = date;
  }
  resetPenaltyPoints(): void {
    this.penaltyPoints = 0;
  }
}
