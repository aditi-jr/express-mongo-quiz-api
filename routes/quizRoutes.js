const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); 
const {
    createQuiz,
    getQuizzes,
    getQuizById,
    submitQuiz,
    getLeaderboard,
    addQuestionToQuiz // <-- Added the new function here
} = require('../controllers/quizController');

// ... (existing routes)
router.post('/', auth, createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);

// NEW ROUTE for adding a question
router.post('/:id/questions', auth, addQuestionToQuiz);

// ... (existing routes)
router.post('/:id/submit', auth, submitQuiz);
router.get('/:id/leaderboard', getLeaderboard);

module.exports = router;