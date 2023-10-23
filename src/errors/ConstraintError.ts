import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class ConstraintError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "ConstraintError";
      }
}

export default ConstraintError