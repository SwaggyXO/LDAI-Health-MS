import { Response, NextFunction, Request } from "express";
import { formatResponse } from "../utils/response";
import { ApiException } from "../exception/api.exception";

export const exceptionFunction = (error: any, req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Type', 'application/json');

    console.log(error);
    
    if (error instanceof ApiException)
    {
        return formatResponse(res, error.code, error.status, null, error.message);
    }

    else return formatResponse(res, error.code, error.status, null, {
        message: error.err.message,
        ldaiCode: error.ldaiCode,
        ldaiDetails: error.err.message ? error.ldaiDetails : error.err,
    });
};
