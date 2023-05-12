export interface Response<T> {
    data: T
    meta: {
        total: number
        page: number
        limit: number
    }
}
