const form = document.querySelector('.form');
const title = document.querySelector('.title');
const levels = document.getElementsByName('level');
const description = document.querySelector('.description');
const testCase = document.querySelector('.test-case');
const solution = document.querySelector('.solution');
const button = document.querySelector('.button');
const success = document.querySelector('.success');

button.addEventListener('click', () => {
  try {
    if (!title.value) throw 'title을 입력해주세요';
    if (!description.value) throw 'description을 입력해주세요';
    if (!testCase.value) throw 'test case를 입력해주세요';
    if (!solution.value) throw 'solution을 입력해주세요';
  } catch(err) {
    alert(err);
  }

  let selectedLevel;
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].checked) {
      selectedLevel = levels[i].value;
    }
  }

  fetch('/new-kata', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      title: title.value,
      difficulty_level: selectedLevel,
      description: description.value,
      code: testCase.value,
      solution: solution.value
    })
  })
  .then(res => res.json())
  .then(res => {
    if (res.message === 'success') {
      form.classList.add('invisible');
      success.classList.remove('invisible');
    }
  });
});
