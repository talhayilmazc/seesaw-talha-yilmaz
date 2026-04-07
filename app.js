// Constants

const PLANK_WIDTH = 400
const PIVOT = PLANK_WIDTH / 2

// State

let objects = [] // will store all dropped objects
let isPaused = false // tracks whether simulation is paused

// Load saved state from localStorage on page load
function loadState() {
    const saved = localStorage.getItem('seesaw-state')
    if (saved) {
        objects = JSON.parse(saved)
    }
}

 // Save current state to localStorage
 function saveState() {
    localStorage.setItem('seesaw-state', JSON.stringify(objects))
 }

 loadState()