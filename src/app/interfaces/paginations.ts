export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  skip?: number;
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
};
