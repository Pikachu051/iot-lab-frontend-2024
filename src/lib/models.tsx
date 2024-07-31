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

export interface Menu {
  id: number;
  name: string;
  price: number;
  img : string;
}

export interface Order {
  id: string;
  menu_id: number;
  quantity: number;
  total_price: number;
  is_completed: boolean;
  order_time: string;
  note: string;
  menu: Menu;
}