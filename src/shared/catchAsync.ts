import ApiError from "../errors/ApiErrors";

const catchAsync = <T, A extends any[]>(
  serviceFunction: (...args: A) => Promise<T>
) => {
  return async (...args: A): Promise<T> => {
    try {
      return await serviceFunction(...args);
    } catch (error: any) {
      throw new ApiError(
        error.statusCode || 500,
        error.message || "Something went wrong."
      );
    }
  };
};

export default catchAsync;
