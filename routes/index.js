var express = require('express');
var router = express.Router();
var fs = require('fs');
var vm = require('vm');


/* GET home page. */
router.get('/', (req, res, next) => {
  fs.readFile('./data/problems.json', 'utf-8', (err, data) => {
    problems = JSON.parse(data);
    if (req.query.level) {
      problems = problems.filter(problem => { 
        if (problem.difficulty_level === Number(req.query.level)) {
          return problem;
        }
      });
    } 
    res.render('index', { problems });
  });
});

router.get('/problems/:problem_id', (req, res) => {
  fs.readFile('./data/problems.json', 'utf-8', (err, data) => {
    var answer = '';
    var results = [];
    var data = JSON.parse(data);    
    var index = req.params.problem_id - 1;
    res.render('problem', {
      id: req.params.problem_id,
      title: data[index].title,
      solutionCount: data[index].solution_count,
      level: data[index].difficulty_level,
      description: data[index].description,
      results,
      answer,
      error: ''
    });
  });
});

router.post('/problems/:problem_id', (req, res) => {
  fs.readFile('./data/problems.json', 'utf-8', (err, data) => {
    index = req.params.problem_id - 1;
    problem = JSON.parse(data)[index];
    var answer = req.body.answer;
    var results = [];
    var sandbox = {};
    for (var i = 0; i < problem.tests.length; i++) {
      try {
        var script = new vm.Script(`
          function solution(arg) {
            return (${req.body.answer})(arg);
          };
          result = ${problem.tests[i].code};
        `);
        const context = vm.createContext(sandbox); // context = contextifiedSandbox
        script.runInNewContext(context);
      } catch (error) {
        res.render('problem', {
          id: req.params.problem_id,
          title: problem.title,
          solutionCount: problem.solution_count,
          level: problem.difficulty_level,
          description: problem.description,
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
      id: req.params.problem_id,
      title: problem.title,
      solutionCount: problem.solution_count,
      level: problem.difficulty_level,
      description: problem.description,
      results,
      answer,
      error: ''
    });

  });
});

module.exports = router;
