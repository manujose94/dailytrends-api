export interface StatusResult {
    status: string;
    database?: boolean;
    podName?: string;
    nodeName?: string;
    namespace?: string;
  }
  // status controller in the ports folder to establish the contract for the business logic.
  export interface IStatusController {
    checkLiveness(): Promise<StatusResult>;
    checkReadiness(): Promise<StatusResult>;
    checkStatus(): Promise<StatusResult>;
  }