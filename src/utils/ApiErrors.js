// if we have API errors then we can create a custom error class to handle the errors 
// and send the error message to the client


class ApiErorr extends Error { // we extend the Error class to create our own custom error class with constructor
  constructor(message = "somethig went wrong", 
    statuscode,
    errors = [] , // it pass the error array to the constructor
    stack = "" // means the stack trace of the error
  ) {
    super(message)
    this.statuscode = statuscode
    this.data = null
    this.errors =  errors
    this.success = false;
    this.message = message

    if(stack){
        this.stack = stack
    } else { // if stack is not passed then we capture the stack trace and give error instance
        Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError } // need to export the class to use it in other files