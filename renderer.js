const information = document.getElementById('info')
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`

// https://www.electronjs.org/docs/latest/tutorial/ipc#pattern-2-renderer-to-main-two-way
electronAPI.ping().then(function(data) {
  information.innerText += `, ping (${data})`
});
