import { News } from '../news.entity';

export enum NewsOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

export interface findNewsOptions {
  where?: Partial<News>;
  order?: Partial<{ [key in keyof News]: NewsOrder }>;
  take?: number;
  skip?: number;
}
