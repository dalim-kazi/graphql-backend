export type IOptions = {
    page?: number;
    limit?: number;
    sortBy?: string;
    skip?:number;
    sortOrder?: string;
  };
  
  type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
  };
  
  const calculatePagination = (options: IOptions): IOptionsResult => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit);
    const skip = (page - 1) * limit;
  
    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";
  
    return {
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    };
  };
  
  export const paginationHelpers = {
    calculatePagination,
  };
  