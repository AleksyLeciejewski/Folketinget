const joi = require('joi');
const person = require('../models/person');

const schema = joi.object({
    name: joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Name is required',
            'any.required': 'Name is required'
        }),
    role: joi.string()
        .valid('Minister', 'Formand')
        .trim()
        .required()
        .messages({
            'any.only': 'The only valid positions are Minister and Formand, please try again',
            'any.required': 'Input of position is required'
        }),

    politicalParty: joi.string()
        .valid('Venstre', 'Moderaterne', 'Socialdemokratiet', 'Det Konservative Folkeparti', 'Enhedslisten', 'Socialistisk Folkeparti', 'Alternativet', 'Dansk Folkeparti', 'Danmarksdemokraterne', 'Liberal alliance')
        .trim()
        .required()
        .messages({
            'string.empty': 'Input of political party is required',
            'any.required': 'Input of political party is required'
        })
});

const updatePersonSchema = joi.object({
    name: joi.string().trim(),
    role: joi.string().trim(),
    politicalParty: joi.string().trim() //Check for attribute changes in object, min 1
}).min(1).messages({'object.min': 'Please change one or more fields before if you want to update this person'});

exports.validateAddPerson = (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly : false //Should return all errors that occurred, not just break out at the first
    });
    if (error) {
        const errors = error.details.map(detail=> ({
            field: detail.path[0],
            message: detail.message
        }));
        console.log("Validation failed", errors);
        return res.status(400).json({
            error: "Validation failed",
            details: errors
        });
    }
    req.body = value;
    console.log("Validation successfully completed");
    next();
};

exports.validateUpdatePerson = (req, res, next) => {
    const { error, value } = updatePersonSchema.validate(req.body, {
        abortEarly: false
    });
    if(error) {
        const errors = error.details.map(detail=> ({
            field: detail.path[0],
            detail: detail.message
        }));
        console.log("Validation failed", errors);
        return res.status(400).json({
            error: "Validation failed",
            details: errors
        });
    }
    req.body = value;
    console.log("Validation successfully completed");
    next();
};

exports.checkDuplicatePerson = async (req, res, next) => {
    console.log("HEJHEHJEJEHEHJEJEHJE");
    try{
        const {name} = req.body;
        console.log('Duplication check: ', name);
        const existingPerson = await person.findOne(doesPersonMatch(name));
        console.log("*************", existingPerson, "*************");
        if(existingPerson){
            console.log('Duplication failed: ', existingPerson);
            return res.status(409).json({
                error: 'Person already exists',
                message: `This person: "${existingPerson}" Already exists`,
                existingPerson: {
                    name: existingPerson.name,
                    role: existingPerson.role,
                    politicalParty: existingPerson.politicalParty
                }
            });
        }
        console.log('No duplicate found');
        next();
    } catch(err){
        console.error("Error during duplication check", err.message);
        res.status(500).json({
            error: 'Something went wrong during duplication',
        });
    }
};

const doesPersonMatch = name => ({
    $expr: { $eq: [ { $toLower: "$name" }, name.toLowerCase() ] } //case insensitive query check for duplicates in mongo
});