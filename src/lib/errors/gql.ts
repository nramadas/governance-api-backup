import mercurius from "mercurius";

export class Exception extends mercurius.ErrorWithProps {
  constructor(error?: unknown) {
    super("Internal server error", {
      message: error instanceof Error ? error.message : String(error),
    }, 500)
  }
}

export class MalformedData extends mercurius.ErrorWithProps {
  constructor() {
    super("Malformed data", {}, 400);
  }
}

export class NotFound extends mercurius.ErrorWithProps {
  constructor() {
    super("Not found", {}, 404);
  }
}

export class Unauthorized extends mercurius.ErrorWithProps {
  constructor() {
    super("You are not authorized to perform that action", {}, 403)
  }
}
