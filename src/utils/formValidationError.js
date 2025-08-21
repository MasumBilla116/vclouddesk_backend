const { errorResponse } = require("./response");

function formValidationError(res,error) {
  const validationErrors = Object.values(error.errors).map((err) => {
    return {
      field: err.path,
      message: err.message.replace("Path ", "").replace(/`/g, ""),
    };
  });

  return errorResponse(res, "Validation Errors", 422, validationErrors);
}


module.exports = formValidationError;