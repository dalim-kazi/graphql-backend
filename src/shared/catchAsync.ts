import ApiError from "../errors/ApiErrors";

const catchAsync = async <T>(
  serviceFunction: () => Promise<T>
): Promise<T | null> => {
  try {
    const data = await serviceFunction();
    return data;
  } catch (error: any) {
    const statusCode = error.statusCode || 400;
    throw new ApiError(statusCode, error.message);
  }
};

export default catchAsync;
