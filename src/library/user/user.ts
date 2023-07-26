import { randomUUID } from "crypto";

export class User {
  private readonly uuid: string = randomUUID();
  private credit: number = 0;
  constructor(private readonly name: string) {}
  getName(): string {
    return this.name;
  }
  getUuid(): string {
    return this.uuid;
  }
  resetCredit() {
    this.credit = 0; // Czy tu powinienem wrzucić credit do construktora, (private readonly credit) i chcąc zmiany tworzyć new User?
  }
  getCredit() {
    return this.credit;
  }
  setCredit(credit: number): void {
    this.credit = credit;
  }
}
