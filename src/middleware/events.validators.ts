var validate = require('mongoose-validator');

//validators for schema IN MONGOOSE - in order of schema structure
var nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 20],
      passIfEmpty: false,
      message: 'Event should have a name less than 20 characters',
    })
];

var descValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 100],
      passIfEmpty: true,
      message: 'Event description should be less than 100 characters',
    })
];

var locationValidator = [
    validate({
        validator: 'isIn',
        arguments: ['Point'],
        passIfEmpty: false,
        message: 'Location must be a point type',
    })
];

function coordinateValidation(value: Array<number>) {
   return value.length = 2
}

var creatorValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 12],
        passIfEmpty: false,
        message: 'Enter valid username',
    })
]

var createDateValidator = [
    validate({
        validator: 'isDate',
        passIfEmpty: false,
        message: 'Enter valid date',
    })
]

var eventScopeValidator = [
    validate({
        validator: 'isIn',
        arguments: ['public', 'private'],
        passIfEmpty: false,
        message: 'Event scope must be public or private',
    })
]

var groupEventValidator = [
    validate({
        validator: 'isBoolean',
        passIfEmpty: false,
        message: 'Event must be group or not',
    })
]

var capacityValidator = [  
    validate({
        validator: 'isInt',
        passIfEmpty: true,
        message: 'Capacity must be an integer',
    })
]

function expirationValidator(date: Date) {
    return  date  >=  new Date() //expiration date must be in the future
}