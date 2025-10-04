const Quiz = require('../models/Quiz');
const Result = require('../models/Result');
const { createQuizSchema, addQuestionSchema } = require('../validation/schemas');

exports.createQuiz = async (req, res) => {
    const { error } = createQuizSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const newQuiz = new Quiz({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            difficulty: req.body.difficulty,
            createdBy: req.user.id,
            questions: [],
        });
        
        const quiz = await newQuiz.save();
        res.status(201).json(quiz);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.addQuestionToQuiz = async (req, res) => {
    const { error } = addQuestionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        if (quiz.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { questionText, options, correctAnswerText } = req.body;
        
        const tempOptions = options.map(opt => ({ text: opt.text }));
        const correctOptionIndex = tempOptions.findIndex(opt => opt.text === correctAnswerText);

        if (correctOptionIndex === -1) {
            return res.status(400).json({ message: 'Correct answer text must match one of the options' });
        }
        
        const questionToAdd = {
            questionText,
            options: tempOptions,
        };
        
        quiz.questions.push(questionToAdd);
        const addedQuestion = quiz.questions[quiz.questions.length - 1];
        const correctOptionId = addedQuestion.options[correctOptionIndex]._id;
        addedQuestion.correctAnswer = correctOptionId;
        
        await quiz.save();
        res.json(quiz);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getQuizzes = async (req, res) => {
    const { category, difficulty } = req.query;
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    try {
        const quizzes = await Quiz.find(query).populate('createdBy', 'username');
        res.json(quizzes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const quizForTaking = {
            _id: quiz._id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            difficulty: quiz.difficulty,
            questions: quiz.questions.map(q => ({
                _id: q._id,
                questionText: q.questionText,
                options: q.options,
            })),
        };
        res.json(quizForTaking);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitQuiz = async (req, res) => {
    const { submission } = req.body;
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        let score = 0;
        submission.forEach(sub => {
            const question = quiz.questions.find(q => q._id.toString() === sub.questionId);
            if (question) {
                if (question.correctAnswer.toString() === sub.selectedOptionId) {
                    score++;
                }
            }
        });
        const result = new Result({
            quiz: req.params.id,
            user: req.user.id,
            score,
        });
        await result.save();
        res.json({
            message: 'Quiz submitted successfully!',
            score: score,
            total: quiz.questions.length,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const results = await Result.find({ quiz: req.params.id })
            .sort({ score: -1 })
            .limit(10)
            .populate('user', 'username');
        res.json(results);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};