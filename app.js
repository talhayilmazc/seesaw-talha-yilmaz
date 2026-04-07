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

 // Physics

 // Calculate torque for each side and determine tilt angle
 function calculateAngle() {
    let leftTorque = 0
    let rightTorque = 0

    objects.forEach(function(obj) {
        // Distance from the pivot point
            const distance = Math.abs(obj.position - PIVOT)

        if (obj.position < PIVOT) {
            // Object is on the left side
            leftTorque += obj.weight * distance
        }
        else {
            // Object is on the right side
            rightTorque += obj.weight * distance
        }
    })

    // Cap the angle between -30 and +30 degrees
    const angle = Math.max(-30, Math.min(30,
        (rightTorque - leftTorque) /10
    ))

    return {
        angle: angle,
        leftTorque: leftTorque,
        rightTorque: rightTorque
    }
 }