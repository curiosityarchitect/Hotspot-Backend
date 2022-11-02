/* tslint:disable-next-line:no-var-requires */
let validate = require('mongoose-validator');

// validators for schema IN MONGOOSE - in order of schema structure
let nameValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 20],
      passIfEmpty: false,
      message: 'Event should have a name less than 20 characters',
    })
];

let descValidator = [
    validate({
      validator: 'isLength',
      arguments: [0, 100],
      passIfEmpty: false,
      message: 'Event description should be less than 100 characters',
    })
];

let locationValidator = [
    validate({
        validator: 'isIn',
        arguments: ['Point'],
        passIfEmpty: false,
        message: 'Location must be a point type',
    })
];

function coordinateValidation(value: number[]) {
   return value.length = 2
}

let creatorValidator = [
    validate({
        validator: 'isLength',
        arguments: [0, 12],
        passIfEmpty: false,
        message: 'Enter valid username',
    })
]

let createDateValidator = [
    validate({
        validator: 'isDate',
        passIfEmpty: true,
        message: 'Enter valid date',
    })
]

let eventScopeValidator = [
    validate({
        validator: 'isIn',
        arguments: ['public', 'private'],
        passIfEmpty: true,
        message: 'Event scope must be public or private',
    })
]

let groupEventValidator = [
    validate({
        validator: 'isBoolean',
        passIfEmpty: true,
        message: 'Event must be group or not',
    })
]

let capacityValidator = [
    validate({
        validator: 'isInt',
        passIfEmpty: true,
        message: 'Capacity must be an integer',
    })
]

function expirationValidator(date: Date) {
    return  date  >=  new Date() // expiration date must be in the future
}