const { validationResult } = require("express-validator");

class databaseConnectionError extends Error{

}

module.exports=requestValidationError