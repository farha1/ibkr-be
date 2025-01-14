export class UpdateNewsDto {
  readonly sourceId: string;
  readonly content?: string;
  readonly keyPoint?: string;
  readonly isPublished?: boolean;
}
