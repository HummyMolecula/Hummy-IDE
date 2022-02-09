let editor = ace.edit('editor')
editor.session.setMode('ace/mode/javascript')
editor.session.setTabSize(2)
editor.setReadOnly(false);
editor.setOption("wrap", "free");
ace.require("ace/ext/language_tools");
editor.setOptions({
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true
});

let editorText = document.getElementById('editorText').value
let lastText = editorText
let runButton = document.getElementById('run')
let codeButton = document.getElementById('resetCode')
let consoleButton = document.getElementById('resetConsole')
let display = document.getElementById('display')
let consoleMessages = []
let consoleLogs = document.getElementById('display-logs')

let Lo = {
  clearConsole() {
    consoleMessages.length = 0

    while (consoleLogs.firstChild) {
      consoleLogs.removeChild(consoleLogs.firstChild)
    }
  },
  printConsole() {
    consoleMessages.forEach(log => {
      const newLogItem = document.createElement('li')
      const newLogText = document.createElement('pre')

      newLogText.className = log.class
      newLogText.textContent = `> ${log.message}`

      newLogItem.appendChild(newLogText)
      consoleLogs.appendChild(newLogItem)
    })
  }
}

runButton.addEventListener('click', () => {
  Lo.clearConsole()

  const code = editor.getValue()
  try {
    new Function(code)()
  } catch (e) {
    alert('Error: ', e)
  }

  Lo.printConsole()
})

codeButton.addEventListener('click', () => {
  editor.setValue('')
})

consoleButton.addEventListener('click', () => {
  Lo.clearConsole()
})

setInterval(() => {
  if (editorText != lastText) {
    editor.setValue(editorText)
    if (editorText == '') {
      document.getElementById('editorText').value = '12345'
      editorText = '12345'
    }

    lastText = editorText

    if (document.getElementById('fileEx').value == '.js') {
      editor.session.setMode('ace/mode/javascript')
    } else {
      editor.session.setMode(null)
    }
  }

  editorText = document.getElementById('editorText').value
  document.getElementById('currentText').value = editor.getValue()

  document.getElementById('editor').style.fontSize = document.getElementById('text_size').value + 'px'
  editor.setTheme('ace/theme/' + document.getElementById('themeCurrent').value)
  editor.resize()
}, 50)
