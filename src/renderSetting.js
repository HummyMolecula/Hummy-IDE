const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', () => {
  const el = {
    close: document.getElementById('close'),
    reset: document.getElementById('reset'),
    textSize: document.getElementById('textSize'),
    cancel: document.getElementById('cancel'),
    selcTheme: document.getElementById('selcTheme')
  }

  el.close.addEventListener('click', () => {
    ipcRenderer.send('settings_close', el.textSize.value, el.selcTheme.options[el.selcTheme.selectedIndex].value)
  })

  el.cancel.addEventListener('click', () => {
    ipcRenderer.send('settings_cancel')
  })

  el.reset.addEventListener('click', () => {
    el.textSize.value = 12
  })
})
