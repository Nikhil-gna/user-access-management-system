export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: any,
  statusCode: number,
  message: string,
  data?: T
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  } as ApiResponse<T>);
};

export const sendError = (
  res: any,
  statusCode: number,
  message: string,
  code: string,
  details?: any
) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    code,
    ...(details && { errors: details }),
  });
};
