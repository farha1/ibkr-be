import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  sourceId: string;

  @Column()
  section: string;

  @Column({ type: 'timestamp' })
  publishDate: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ select: false, nullable: true })
  content: string | null;

  @Column({ nullable: true })
  keyPoint: string | null;

  @Column()
  source: string;

  @Column()
  sourceUrl: string;

  @Column()
  apiUrl: string;

  @Column({ default: false })
  isPublished: boolean;
}
