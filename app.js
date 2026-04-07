// Constants

const PLANK_WIDTH = 400
const PIVOT = PLANK_WIDTH / 2

// State

let objectList = [] // will store all dropped objects
let isPaused = false // tracks whether simulation is paused

// Load saved state from localStorage on page load
function loadState () {
    const saved = local.Storage.getItem('seesaw-state')
    if(saved) {
        objectList = JSON.parse(saved)
    }
}

 // Save current state to localStorage
 function saveState() {
    // TODO: implement
 }

 localState()