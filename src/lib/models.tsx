export interface Book {
  id: number;
  title: string;
  author: string;
  year: number;
  is_published: boolean;
  detail: string;
  short_desc : string;
  categories : string[];
}
