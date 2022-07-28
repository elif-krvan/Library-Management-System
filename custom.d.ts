declare global {
  namespace Express {
    interface Response {
      paginated: object
    }
  }
}