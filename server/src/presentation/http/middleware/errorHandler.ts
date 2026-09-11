import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next
) => {
  /*
   * 400 — request body/shape validation
   */
  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Request validation failed",
        details: error.issues,
      },
    });

    return;
  }

  /*
   * Handle application/domain errors.
   */
  if (error instanceof Error) {
    switch (error.name) {
      case "NotFoundError":
        response.status(404).json({
          success: false,
          error: {
            code: "NOT_FOUND",
            message: error.message,
          },
        });
        return;

      case "SubmissionValidationError":
        response.status(422).json({
          success: false,
          error: {
            code: "INVALID_SUBMISSION",
            message: error.message,
          },
        });
        return;

      case "InvalidAttemptStateError":
        response.status(409).json({
          success: false,
          error: {
            code: "INVALID_ATTEMPT_STATE",
            message: error.message,
          },
        });
        return;
    }
  }

  /*
   * Mongo duplicate-key error.
   */
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    response.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_RESOURCE",
        message: "A conflicting resource already exists",
      },
    });

    return;
  }

  /*
   * Only genuinely unexpected errors
   * should be logged as server errors.
   */
  console.error(
    "Unhandled application error:",
    error
  );

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
};