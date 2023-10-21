class GetVerbError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "GetVerbError";
      }
}

export default GetVerbError