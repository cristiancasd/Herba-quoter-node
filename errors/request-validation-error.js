const { validationResult } = require("express-validator");

class requestValidationError extends Error{
    
}

module.exports=requestValidationError