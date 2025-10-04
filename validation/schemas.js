const Joi = require('joi');

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const createQuizSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(10).required(),
    category: Joi.string().valid('Technology', 'Science', 'History', 'General Knowledge').required(),
    difficulty: Joi.string().valid('Easy', 'Medium', 'Hard').required(),
});

const addQuestionSchema = Joi.object({
    questionText: Joi.string().required(),
    options: Joi.array().items(
        Joi.object({ text: Joi.string().required() })
    ).min(2).max(4).required(),
    correctAnswerText: Joi.string().required() 
});

module.exports = { registerSchema, loginSchema, createQuizSchema, addQuestionSchema };