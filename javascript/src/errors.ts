export class InputValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InputValidationError";
  }
}

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export class ApiCommunicationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiCommunicationError";
  }
}

export class ApiServerError extends ApiCommunicationError {
  readonly status: number;
  readonly id?: string | null;
  readonly details?: unknown;

  constructor(status: number, message: string, id?: string | null, details?: unknown) {
    super(message);
    this.name = "ApiServerError";
    this.status = status;
    this.id = id ?? undefined;
    this.details = details;
  }
}


