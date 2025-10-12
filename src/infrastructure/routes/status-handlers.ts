import { Request, Response } from "express";
import { StatusController } from "../../adapters/controllers/status/status-controller"

const statusAdapter = new StatusController();

// The handlers remain in the infrastructure layer, mapping HTTP requests to the adapter.
export const livenessHandler = async (req: Request, res: Response) => {
  try {
    const result = await statusAdapter.checkLiveness();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const readinessHandler = async (req: Request, res: Response) => {
  try {
    const result = await statusAdapter.checkReadiness();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    const statusCode = error.message === "Application not ready" ? 503 : 500;
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const statusHandler = async (req: Request, res: Response) => {
  try {
    const result = await statusAdapter.checkStatus();
    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};