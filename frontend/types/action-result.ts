// types/action-result.ts

export type ActionResult<T = void> =
    | {
          success: true;
          message: string;
          data?: T;
      }
    | {
          success: false;
          message: string;
          errors?: Record<string, string> | string[];
      };
