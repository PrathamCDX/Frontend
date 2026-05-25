export type ErrorResponse = {
    success: boolean,
    message: string,
    data: Record<string, unknown>,
    error: ErrorObject
}

type ErrorObject = {
    statusCode: number,
    message: string,
    name: string
}