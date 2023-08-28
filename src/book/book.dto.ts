export class Book {
  constructor(
    readonly title: string,
    readonly author: string,
    readonly year: number
  ) {}
}
/**
 * book ->
 *  book.service.ts
 *  book.dto.ts
 *
 *
 * book ->
 *    services ->
 *      book.service.ts
 *      newspaper.service.ts
 *    dto ->
 *      book.dto.ts
 *       .....
 */
