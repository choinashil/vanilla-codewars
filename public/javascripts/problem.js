const textarea = document.querySelector('.textarea');
CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  theme: 'tomorrow-night-bright'
});
