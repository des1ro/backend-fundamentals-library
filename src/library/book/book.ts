export class Book {
  constructor(
    private readonly title: string,
    private readonly author: string,
    private readonly year: number,
    private readonly id: number
  ) {}
  getId(): number {
    return this.id;
  }
  getTitle(): string {
    return this.title;
  }
  getAuthor(): string {
    return this.author;
  }
  getYear(): number {
    return this.year;
  }
}
