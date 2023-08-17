import { LibraryError } from "../../exceptions/library.exceptions";
import { User } from "../../user/user";

export class BookTracker {
  private borrowedBy: User | null = null;
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
