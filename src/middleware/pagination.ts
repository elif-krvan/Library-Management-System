import { NextFunction, Request, Response } from "express";

class Pegination {
    // peginate_users = () => {
    //     return async (req: Request, res: Response, next: NextFunction) => {
    //         const result = {};
    //     }
    // }
    find_offset(limit: number, page: number): number {
        return (page - 1) * limit;
    }
}

const pegination = new Pegination();
export default pegination;