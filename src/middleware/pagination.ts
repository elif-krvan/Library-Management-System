
class Pagination {
    find_offset(limit: number, page: number): number {
        return (page - 1) * limit;
    }
}

const pagination = new Pagination();
export default pagination;