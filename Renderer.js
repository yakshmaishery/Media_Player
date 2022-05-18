const { ipcRenderer } = require("electron")
const path = require("path")

window.addEventListener("DOMContentLoaded", () => {
    // File details
    let FILE_URL = undefined
    let FILE_NAME = undefined
    // Close Window
    document.getElementById("closebtn").addEventListener("click", () => {ipcRenderer.send("closeaction")})
    // Maximize Window
    document.getElementById("maxbtn").addEventListener("click", () => {ipcRenderer.send("maxaction")})

    ipcRenderer.on("check_max_text",(e,arr)=>{
        if(arr.data){
            document.getElementById("maxbtn").innerHTML = "❐"
        }
        else{
            document.getElementById("maxbtn").innerHTML = "◻"
        }
    })
    // Minimize Window
    document.getElementById("minbtn").addEventListener("click", () => {ipcRenderer.send("minaction")})
    // Full Screen
    document.getElementById("fullscreen_btn").addEventListener("click", () => {ipcRenderer.send("fullscreenaction")})

    // Open Setting window
    document.getElementById("setting_btn").addEventListener("click", () => {document.getElementById("setting_Window").style.transform = "rotateY(0deg)"})

    // close Setting window
    document.getElementById("close_setting_btn").addEventListener("click", () => {document.getElementById("setting_Window").style.transform = "rotateY(90deg)"})

    // Remove the Element in list
    const Remove_Element_FUNC = (n) => {
        n.remove()
    }

    // Play Element
    const Play_Element_FUNC = (n) => {
        FILE_URL = n
        FILE_NAME = path.basename(FILE_URL)
        if(path.extname(FILE_NAME) == ".mp4" || path.extname(FILE_NAME) == ".gif"){
            if(document.getElementById("displayer").hasChildNodes()){
                document.getElementById("displayer").removeChild(document.getElementById("displayer").children[0])
            }
            let objects = document.createElement("object")
            objects.setAttribute("data",FILE_URL)
            objects.setAttribute("style","height:100%;width:100%")
            document.getElementById("displayer").appendChild(objects)
        }
    }

    // ADD PlayList Layout
    const ADD_PLAYLIST_FUNC = (path_n) => {
        let div1 = document.createElement("div")
        let play_btn = document.createElement("button")
        let cancel_btn = document.createElement("button")
        let file_loc = document.createElement("h3")
        play_btn.innerHTML = "▶"
        play_btn.setAttribute("style","background-color:lime;color:black;margin-left:10px;border:1px solid black;font-size:1.3em;padding:0.3em;border-radius:100%;height:2em;width:2em;cursor:pointer")
        cancel_btn.setAttribute("style","background-color:red;color:black;margin-left:10px;border:1px solid black;font-size:1.3em;padding:0.3em;border-radius:100%;height:2em;width:2em;cursor:pointer")
        cancel_btn.innerHTML = "✖"
        FILE_URL = path_n
        FILE_NAME = path.basename(FILE_URL)
        let data = FILE_URL
        file_loc.innerHTML = data
        play_btn.addEventListener("click",()=>{Play_Element_FUNC(data)})
        file_loc.setAttribute("style","margin-left:1em;text-overflow: ellipsis;overflow:hidden;width:60%;letter-spacing:2px")
        div1.setAttribute("style","display:flex;font-size:1em;align-items:center;color:yellow;border-bottom:1px solid black;padding:10px")
        div1.appendChild(play_btn)
        div1.appendChild(cancel_btn)
        div1.appendChild(file_loc)
        cancel_btn.addEventListener("click", (e) => {Remove_Element_FUNC(div1)})
        document.getElementById("PlayList_div").appendChild(div1)
    }

    // ADD Play List
    document.getElementById("ADD_BTN").addEventListener("click", () => {ipcRenderer.send("ADD_LIST_ACTION")})

    ipcRenderer.on("Files_allow", (e,arr) => {
        let data_list = arr.data
        data_list.forEach(element => {
            ADD_PLAYLIST_FUNC(element)
        });
    })

    // Hide Buttons
    document.getElementById("hide_btns").addEventListener("click", () => {
        document.getElementById("display_btns").style.display = "block"
        document.getElementById("MainContainer").setAttribute("style","grid-template-rows: auto")
        document.getElementById("controler").style.display = "none"
        setTimeout(() => {
            document.getElementById("display_btns").style.opacity = 0
        }, 1000);
        document.getElementById("display_btns").addEventListener("mouseover",() => {document.getElementById("display_btns").style.opacity = 1})
        document.getElementById("display_btns").addEventListener("mouseleave",() => {document.getElementById("display_btns").style.opacity = 0})
    })

    // Show Buttons
    document.getElementById("display_btns").addEventListener("click", () => {
        document.getElementById("display_btns").style.display = "none"
        document.getElementById("MainContainer").setAttribute("style","grid-template-rows: auto 5em")
        document.getElementById("controler").style.display = "flex"
    })

    // Reset Button
    document.getElementById("Reset_btn").addEventListener("click", () => {
        document.getElementById("displayer").removeChild(document.getElementById("displayer").children[0])
    })

    // Open File
    document.getElementById("Open_file_btn").addEventListener("click", () => {ipcRenderer.send("open_File")})

    ipcRenderer.on("Open_FILE_Allow", (e,arr) => {
        Play_Element_FUNC(arr.data[0])
    })

    // Tool Tip
    let ids = ["Reset_btn","hide_btns","Open_file_btn","setting_btn","fullscreen_btn"]
    ids.forEach(element => {
        document.getElementById(element).addEventListener("mouseover", () => {
            let locs = document.getElementById(element).getBoundingClientRect()
            document.getElementById("Tool_TIP").setAttribute("style",`position:absolute;top:${locs.top};left:${locs.right}`)
            document.getElementById("Tool_TIP").style.display = "block"
            if(element == ids[0]){document.getElementById("Tool_TIP").innerHTML = "Reset"}
            if(element == ids[1]){document.getElementById("Tool_TIP").innerHTML = "Hide Buttons"}
            if(element == ids[2]){document.getElementById("Tool_TIP").innerHTML = "Open File"}
            if(element == ids[3]){document.getElementById("Tool_TIP").innerHTML = "Play List"}
            if(element == ids[4]){document.getElementById("Tool_TIP").innerHTML = "Full Screen Mode"}
        })
        document.getElementById(element).addEventListener("mouseleave",() => {document.getElementById("Tool_TIP").style.display = "none"})
    });
})