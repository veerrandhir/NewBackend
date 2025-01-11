class ApiResponse { // ApiResponse class to handle the response.
  constructor(statusCode, message = "Success", data) { // when we send any response we directly pass the status code, message and data form the controller.
    this.statusCode = statusCode
    this.message = message
    this.data = data
    this.success = statusCode < 400 // it must be less than 400 to be a success response.
  }
}
export { ApiResponse }