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

 // Dom References

 const plank = document.getElementById('plank')
 const leftInfo = document.getElementById('left-info')
 const rightInfo = document.getElementById('right-info')

 // Color palette for dropped objects
 const COLORS = [ '#e94560', '#4ecdc4', '#f7dc6f','#a29bfe', '#fd79a8', '#00b894','#6c5ce7', '#fdcb6e', '#e17055' ]

 // Render

 function render() {
    //Calculate current angle
    const {angle} = calculateAngle()

    //Rotate the plank smoothly
    plank.style.transform = `translateX(-50%) rotate(${angle}deg)`
    // Remove all existing objects from plank
    plank.querySelectorAll('.weight-obj').forEach(function(el) {
        el.remove()
    })

    // Calculate total weight on each side
    let leftTotal = 0
    let rightTotal = 0

    objects.forEach(function(obj) {
        if (obj.position < PIVOT) {
            leftTotal += obj.weight
        }
        else {
            rightTotal += obj.weight
        }
    })

    //Update weight display
    leftInfo.textContent = 'Left: ' + leftTotal + ' kg'
    rightInfo.textContent = 'Right: ' + rightTotal + ' kg'

    // Draw each object on the plank
    objects.forEach(function(obj, index) {
        const el = document.createElement('div')
        el.className = 'weight-obj'

        // Size based on weight (heavier = bigger)
        const size = 24 + obj.weight * 2.4
        el.style.width = size + 'px'
        el.style.height = size + 'px'
        el.style.fontSize = Math.max(10, size / 3.5) + 'px'
        el.style.background  = COLORS[index % COLORS.length]
        el.style.left = obj.position + 'px'

        // Show weight inside the circle
        el.textContent = obj.weight + 'kg'

        plank.appendChild(el)
    })
 }

 // User Interaction

 // Handle click on the plank to drop a new object
 plank.addEventListener('click', function(event) {
    // Skip if simulation paused
    if (isPaused) return

    // Get click position relative to the plank
    const clickX = event.offsetX

    // Keep position within plank boundaries
    const position = Math.max(0, Math.min(PLANK_WIDTH, clickX))

    // Generate random weight between 1 and 10
    const weight = Math.floor(Math.random() * 10) + 1

    // Add new object to state
    objects.push({
        position: position,
        weight: weight
    })
    
    // Play sound when object is dropped
    playDropSound()

    // Save and re-render
    saveState()
    render()
 })

 // Initial Render

 // Render on page load to restore saved state
 render()

 // Pause / Resume

 const pauseBtn = document.getElementById('pause-btn')

 //  Toggle pause state on button click
 pauseBtn.addEventListener('click', function() {
    isPaused = !isPaused

    // Update button text based on state
    if (isPaused) {
        pauseBtn.textContent = 'Resume'
    }
    else {
        pauseBtn.textContent = 'Pause'
    }
 })

 // Sound Effect

 // Create a short drop sound with Web Audio API
 function playDropSound() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    // Create oscillator - generates the sound wave
    const oscillator = audioCtx.createOscillator()

    // Create gain node - controls volume
    const gainNode = audioCtx.createGain()

    // Connect oscillator -> gain -> output
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)

    // Sound type and frequency
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime +0.3)

    // Volume starts at 0.3 and fades out
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)

    // Stars and stop
    oscillator.start(audioCtx.currentTime)
    oscillator.stop(audioCtx.currentTime + 0.3)
 }