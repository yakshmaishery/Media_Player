const {app,BrowserWindow, ipcMain, dialog} = require("electron")
const path = require("path")
const os = require("os")

let root;

const AppWindow = () => {
    root = new BrowserWindow({
        webPreferences:{
            webSecurity:true,
            nodeIntegration:false,
            preload:path.join(app.getAppPath(),"Renderer.js")
        },
        minHeight:500,
        minWidth:500,
        // frame:false
    })
    root.loadFile("Index.html")
}

// Hardware Acceleration
app.disableHardwareAcceleration()

// Initial Start Up
app.on("ready", () => {AppWindow()})

// Close Event
ipcMain.on("closeaction", () => {app.quit()})

// Maxmize Event
ipcMain.on("maxaction", (e,arr) => {
    root.isMaximized()?root.unmaximize():root.maximize()
    e.reply("check_max_text",{data:root.isMaximized()})
})

// Minmize Event
ipcMain.on("minaction", () => {root.minimize()})

// fullscreen Event
ipcMain.on("fullscreenaction", () => {root.isFullScreen()?root.setFullScreen(false):root.setFullScreen(true)})

// ADD LIST Event
ipcMain.on("ADD_LIST_ACTION", (e,arr) => {
    dialog.showOpenDialog(root,{
        title:"Select Files",
        properties:["multiSelections","openFile"]
    }).then(options => {
        if(options.canceled == false){
            e.reply("Files_allow",{data:options.filePaths})
        }
    })
})

// Open File
ipcMain.on("open_File", (e,arr) => {
    dialog.showOpenDialog(root,{
        title:"Open File",
        properties:["openFile"],
        filters:[{name:"Video",extensions:["mp4"]}]
    }).then(choosen => {
        if(choosen.canceled == false){
            e.reply("Open_FILE_Allow",{data:choosen.filePaths})
        }
    })
})