export type PaginatedResult<TItem> = {
  items: TItem[];
  total: number;
  from: number;
  size: number;
};


