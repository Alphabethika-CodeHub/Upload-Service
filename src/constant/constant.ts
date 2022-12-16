export interface ReturnInterface { statusCode: any, message: string, data: object | string }

export enum MessageStatus  {
    SUCCESS = "success",
    FAILED = "failed",
    ERROR = "error"
}