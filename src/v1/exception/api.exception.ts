class ApiException extends Error {
    public code: number;
    public message: string;
    public status: string;

    constructor (code: number, status: string, message: string) {
        super(message);
        this.code = code,
        this.message = message,
        this.status = status
    };
}

class InternalServerException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

class InvalidEndpointException extends ApiException {
    constructor(status: string, message: string) {
        super(404, status, message);
    }
}

class BadRequestException extends ApiException {
    constructor(status: string, message: string) {
        super(400, status, message);
    }
}

class CoreMSException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

class ModelMSException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

class ContentMSException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

class SSEException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

class UnexpectedException extends ApiException {
    constructor(status: string, message: string) {
        super(500, status, message);
    }
}

export {
    ApiException,
    InternalServerException,
    InvalidEndpointException,
    BadRequestException,
    CoreMSException,
    ModelMSException,
    ContentMSException,
    SSEException,
    UnexpectedException
}