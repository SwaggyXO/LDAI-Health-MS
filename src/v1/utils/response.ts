import { Response } from "express";

export const formatResponse = (res: Response, code: number, status: string, data?: any, err?: any) => {
    return res.status(code).json({
        code: code,
        status: status,
        data: data,
        error: err,
    });
}