import { LibraryError } from "../../../exceptions/library.exceptions";
import { User } from "../../../user/user";
import { Book } from "../../../book/book";
export class BookTracker {
  private borrowedBy: User | null = null;
  constructor(readonly book: Book) {}
  borrow(user: User): void {
    if (this.borrowedBy) {
      throw new LibraryError({
        name: "BOOKTRACKER_ERROR",
        message: "Book already borrowed",
      });
    }
    this.borrowedBy = user;
  }
  reset(): void {
    this.borrowedBy = null;
  }
  getUser(): User {
    if (!this.borrowedBy) {
      throw new LibraryError({
        name: "BOOKTRACKER_ERROR",
        message: "Book is not borrowed",
      });
    }
    return this.borrowedBy;
  }
}
