// server/routes/compiler.js
const express = require('express');
const router = express.Router();
const compilerController = require('../controllers/compilerController');

// Define POST endpoints for each compiler phase
router.post('/lexer', compilerController.runLexer);
router.post('/parser', compilerController.runParser);
router.post('/semantic', compilerController.runSemantic);
router.post('/intermediate', compilerController.runIntermediate);
router.post('/optimization', compilerController.runOptimization);
router.post('/target', compilerController.runTarget);

module.exports = router;
