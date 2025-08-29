class DBException extends Error {
    public code: number;
    public ldaiCode: number;
    public status: string;
    public err: any;
    public ldaiDetails: string;

    constructor (code: number, ldaiCode: number, status: string, err: any, ldaiDetials: string) {
        super(ldaiDetials);
        this.message = err,
        this.code = code,
        this.ldaiCode = ldaiCode,
        this.status = status
        this.err = err;
        this.ldaiDetails = ldaiDetials;
    }
}

class FetchFailedException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 66, "Fetch Failed", ldaiDetails, err);
    }
}

class CreateFailedException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 36, "Create Failed", ldaiDetails, err);
    }
}

class UpdateFailedException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 16, "Update Failed", ldaiDetails, err);
    }
}

class DeleteFailedException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 46, "Delete Failed", ldaiDetails, err);
    }
}

class DuplicateEntryException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(409, 11000, "Duplicate Entry", ldaiDetails, err);
    }
}

class RedisException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 8, "Redis Error", err, ldaiDetails);
    }
}

class PurchaseFailedException extends DBException {
    constructor(err: any, ldaiDetails: string) {
        super(500, 56, "Purchase Failed", ldaiDetails, err);
    }
}

export {
    FetchFailedException,
    CreateFailedException,
    UpdateFailedException,
    DeleteFailedException,
    DuplicateEntryException,
    RedisException,
    PurchaseFailedException
}