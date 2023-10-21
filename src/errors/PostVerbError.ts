class PostVerbError extends Error{
    name: string;

    constructor(message: string) {
        super(message);
        this.name = "PostVerbError";
      }
}

export default PostVerbError