export default class HttpError extends Error{
    private code: number;
    constructor(errorCode:number, message:string, ){
        super(message);
        this.code = errorCode;
    }
}