import mongoose from "mongoose";

import { IStatusController, StatusResult } from "src/adapters/ports/controllers/status-interface";
import { ILogger } from "src/adapters/ports/logger/logger-interface";

export class StatusController implements IStatusController {
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  async checkLiveness(): Promise<StatusResult> {
    try {
      return { status: "live" };
    } catch (error) {
      this.logger.error("Liveness check failed", error);
      throw new Error("Internal server error");
    }
  }

  async checkReadiness(): Promise<StatusResult> {
    try {
      const isDatabaseConnected = mongoose.connection.readyState === 1;
      if (!isDatabaseConnected) {
        throw new Error("Application not ready");
      }
      return { status: "ready", database: true };
    } catch (error) {
      this.logger.error("Readiness check failed", error);
      throw error instanceof Error ? error : new Error("Internal server error");
    }
  }

  async checkStatus(): Promise<StatusResult> {
    try {
      const isDatabaseConnected = mongoose.connection.readyState === 1;
      const podName = process.env.POD_NAME || "unknown";
      const nodeName = process.env.NODE_NAME || "unknown";
      const namespace = process.env.NAMESPACE || "default";

      return {
        status: "healthy",
        database: isDatabaseConnected,
        podName,
        nodeName,
        namespace,
      };
    } catch (error) {
      this.logger.error("Status check failed", error);
      throw new Error("Internal server error");
    }
  }
}