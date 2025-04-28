import { NextFunction, Request, Response } from 'express';

// Hàm tiện ích để gửi phản hồi thành công
const sendSuccess = (res: Response, data: any = {}, message: string = 'Success') => {
    res.json({
        status: 'success',
        message,
        data,
    });
};

// Hàm tiện ích để gửi phản hồi lỗi
const sendError = (
    res: Response,
    errorMessage: string = 'Something went wrong',
    errorCode: number = 500,
    errorDetails: any = {}
) => {
    res.status(errorCode).json({
        status: 'error',
        message: errorMessage,
        error: {
            code: errorCode,
            details: errorDetails,
        },
    });
};

// Middleware không cần thiết trong trường hợp này, nhưng có thể giữ để đồng bộ
const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
    // Có thể thêm logic khác nếu cần
    next();
};

// Xuất các hàm để sử dụng ở các route
export { sendSuccess, sendError, responseFormatter };