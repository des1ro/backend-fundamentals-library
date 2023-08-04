import { randomUUID } from "crypto";

export class User {
  private readonly uuid: string = randomUUID();
  constructor(
    private readonly name: string,
    private penaltyPoints: number = 0,
    private dueDate = new Date()
  ) {}
  getName(): string {
    return this.name;
  }
  getUuid(): string {
    return this.uuid;
  }
  getPenaltyPoints() {
    return this.penaltyPoints;
  }
  addPenaltyPoints(penaltyPoints: number): void {
    this.penaltyPoints += penaltyPoints;
  }
  getDueDate() {
    return this.dueDate;
  }
  setDueDate(date: Date) {
    this.dueDate = date;
  }
  resetPenaltyPoints() {
    this.penaltyPoints = 0;
  }
}
