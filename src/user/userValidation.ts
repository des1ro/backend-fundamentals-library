import { isAfter } from "date-fns";
import { User } from "./user";

export class UserValidation {
  constructor(private readonly user: User) {}
  isUserBanned() {
    return isAfter(this.user.getDueDate(), new Date());
  }
}
