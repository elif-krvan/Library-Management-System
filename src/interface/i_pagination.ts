export interface Pagination {
    page: number | string;
    limit: number | string;
    sort_by?: string | undefined;
    order?: string;    
}