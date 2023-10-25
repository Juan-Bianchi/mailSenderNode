class DatabaseError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "DatabaseError";
      }
}

export default DatabaseError