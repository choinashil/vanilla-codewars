const express = require('express');
const router = express.Router();
const vm = require('vm');
const Problem = require('../models/Problem');

router.get('/', (req, res) => {
  Problem.find().then(problems => {
    if (req.query.level) {
      problems = problems.filter(problem => {
        if (problem.difficulty_level === Number(req.query.level)) {
          return problem;
        }
      });
    }
    res.render('index', {problems});
  });
});

router.get('/new-kata', (req, res) => {
  res.render('newKata');
});

router.post('/new-kata', (req, res) => {
  const { title, difficulty_level, description, code, solution } = req.body;
  const newProblem = new Problem({
    title,
    solution_count: 0,
    difficulty_level,
    description,
    tests: [{code, solution}]
  });
  newProblem.save()
  .then(() => {res.send({message : 'success'});})
  .catch(err => console.error(new Date(), err.message));
});

router.get('/problems/:problem_id', (req, res, next) => {
  const id = req.params.problem_id;
  Problem.findById(id, (err, problem) => {
    if (err) {
      console.error(new Date(), err.message);
      next(err);
    } else {
      res.render('problem', {
        id,
        problem,
        results: [],
        answer: '',
        error: ''
      });
    }
  });
});

router.post('/problems/:problem_id', (req, res) => {
  const id = req.params.problem_id;
  const answer = req.body.answer;
  const results = [];

  Problem.findById(id).then(problem => {
    const sandbox = {};
    for (let i = 0; i < problem.tests.length; i++) {
      try {
        const script = new vm.Script(`
          function solution(arg) {
            return (${req.body.answer})(arg);
          };
          result = ${problem.tests[i].code};
        `);
        const context = vm.createContext(sandbox);
        script.runInNewContext(context);
      } catch (error) {
        res.render('problem', {
          id,
          problem,
          results,
          answer,
          error
        });
      }
      if (sandbox.result === problem.tests[i].solution) {
        results.push('passed');
      } else {
        results.push([problem.tests[i].solution, sandbox.result]);
      }
    }
    res.render('problem', {
      id,
      problem,
      results,
      answer,
      error: ''
    });
  });
});

module.exports = router;
