const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [OptionSchema],
    // THIS IS THE LINE WE ARE CHANGING
    correctAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions.options', required: true },
});

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    category: {
        type: String,
        required: [true, 'Please specify a category'],
        enum: ['Technology', 'Science', 'History', 'General Knowledge'],
    },
    difficulty: {
        type: String,
        required: [true, 'Please specify a difficulty level'],
        enum: ['Easy', 'Medium', 'Hard'],
    },
    questions: [QuestionSchema],
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Quiz', QuizSchema);