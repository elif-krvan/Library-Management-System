import express from "express";

interface BaseRouter {
  router: express.Router;
  init_controller(): void;
}

export default BaseRouter;