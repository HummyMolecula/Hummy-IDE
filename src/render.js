const { ipcRenderer } = require('electron')
const path = require('path')

document.addEventListener('DOMContentLoaded', () => {
  const el = {
    create_file: document.getElementById('create_file'),
    open_file: document.getElementById('open_file'),
    editor: document.getElementById('editor'),
    editorText: document.getElementById('editorText'),
    fileEx: document.getElementById('fileEx'),
    currentText: document.getElementById('currentText'),
    home: document.getElementById('home'),
    save: document.getElementById('save'),
    reload: document.getElementById('reload'),
    welcome: document.getElementById('welcome'),
    welcome_close: document.getElementById('welcome_close'),
    welcome_tab: document.getElementById('welcome_tab'),
    tab: document.getElementById('tab'),
    title: document.getElementById('title'),
    settings: document.getElementById('settings'),
    text_size: document.getElementById('text_size'),
    themeCurrent: document.getElementById('themeCurrent'),
    display: document.getElementById('display'),
    reset: document.getElementById('reset')
  }

  let fileName = ''

  const hideWel = () => {
    el.welcome.hidden = true
    el.editor.hidden = false
    el.display.hidden = false
    el.reset.hidden = false
    el.save.hidden = false
    title.innerHTML = fileName
  }

  const showWel = () => {
    el.welcome.hidden = false
    el.editor.hidden = true
    el.display.hidden = true
    el.reset.hidden = true
    el.save.hidden = true
    title.innerHTML = 'Welcome'
  }

  const changeFail = (filePath, content = '') => {
    fileName = path.parse(filePath).base
    el.fileEx.value = path.parse(filePath).ext
    el.tab.innerHTML = fileName
    if (content != '') {
      el.editorText.value = content
    }

    title.innerHTML = fileName
  }

  el.editor.hidden = true
  el.editorText.hidden = true
  el.fileEx.hidden = true
  el.currentText.hidden = true
  el.text_size.hidden = true
  el.save.hidden = true
  el.reset.hidden = true
  el.display.hidden = true
  el.themeCurrent.hidden = true

  ipcRenderer.on('file created', (_, filePath) => {
    changeFail(filePath)
  })

  ipcRenderer.on('settings_closed', (_, size, value) => {
    el.text_size.value = size
    el.themeCurrent.value = value
  })

  ipcRenderer.on('file opened', (_, { filePath, content }) => {
    changeFail(filePath, content)
  })

  el.open_file.addEventListener('click', () => {
    ipcRenderer.send('open')
  })

  el.create_file.addEventListener('click', () => {
    ipcRenderer.send('create', el.currentText.value)
  })

  el.reload.addEventListener('click', () => {
    ipcRenderer.send('reload')
  })

  el.settings.addEventListener('click', () => {
    ipcRenderer.send('openSet')
  })

  el.welcome_close.addEventListener('click', () => {
    hideWel()
    el.welcome_tab.hidden = true
    el.welcome_close.hidden = true
    if (el.tab.classList.length < 2) {
      el.tab.classList.toggle('active')
    }

    if (el.home.classList.length == 4) {
      el.home.classList.toggle('active')
    }
  })

  el.home.addEventListener('click', () => {
    if (el.welcome.hidden == true) {
      showWel()
      el.welcome_tab.hidden = false
      el.welcome_close.hidden = false
      if (el.welcome_tab.classList.length < 2) {
        el.welcome_tab.classList.toggle('active')
      }
    }
    else {
      hideWel()
      el.welcome_tab.hidden = true
      el.welcome_close.hidden = true
    }

    el.tab.classList.toggle('active')
    el.home.classList.toggle('active')
  })

  el.tab.addEventListener('click', () => {
    hideWel()
    if (el.tab.classList.length < 2) {
      el.tab.classList.toggle('active')
      el.welcome_tab.classList.toggle('active')
    }

    if (el.home.classList.length == 4) {
      el.home.classList.toggle('active')
    }
  })

  el.welcome_tab.addEventListener('click', () => {
    showWel()
    if (el.welcome_tab.classList.length < 2) {
      el.welcome_tab.classList.toggle('active')
      el.tab.classList.toggle('active')
    }

    if (el.home.classList.length < 4) {
      el.home.classList.toggle('active')
    }
  })
})
