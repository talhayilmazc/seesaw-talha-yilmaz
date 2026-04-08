// Constants

const PLANK_WIDTH = 400
const PIVOT = PLANK_WIDTH / 2

// State

let objects = [] // Will store all dropped objects
let isPaused = false // Tracks whether simulation is paused
let nextWeight = Math.floor(Math.random() * 10) + 1 // Pre-generate the next object weight to show preview

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
 const angleInfo = document.getElementById('angle-info')
 const logList = document.getElementById('log-list')
 const nextInfo = document.getElementById('next-info')

 // Color palette for dropped objects
 const COLORS = [ '#e94560', '#4ecdc4', '#f7dc6f','#a29bfe', '#fd79a8', '#00b894','#6c5ce7', '#fdcb6e', '#e17055' ]

// Distance Grid

// Draw distance markers on the plank
function drawGrid() {
    const grid = document.getElementById('grid')
    grid.innerHTML = ''

    // Place a marker every 50px along the plank
    for (let px = 0; px <= PLANK_WIDTH; px += 50) {
        const mark = document.createElement('div')
        mark.className = 'grid-mark'
        mark.style.left = px + 'px'

        // Calculate distance from pivot
        const distance = Math.abs(px - PIVOT)

        // Label shows side and distance
        let label = ''
        if (px < PIVOT) {
            label = 'L' + distance
        }
        else if (px > PIVOT) {
            label = 'R' + distance
        }
        else {
            label = '0'
        }

        const line = document.createElement('div')
        line.className = 'grid-line'

        const text = document.createElement('div')
        text.className = 'grid-label'
        text.textContent = label

        mark.appendChild(line)
        mark.appendChild(text)
        grid.appendChild(mark)
    }
}

 // Render

 function render() {
    // Draw distance grid
    drawGrid()

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
    angleInfo.textContent = 'Angle: ' + angle.toFixed(1) + '°'
    nextInfo.textContent = 'Next: ' + nextWeight + ' kg'

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

    // Generate next weight for preview
    const weight = nextWeight
    nextWeight = Math.floor(Math.random() * 10) + 1
    nextInfo.textContent = 'Next: ' + nextWeight + ' kg'

    // Add new object to state
    objects.push({
        position: position,
        weight: weight
    })

    // Add entry to acticity log
    const side = position < PIVOT ? 'left' : 'right'
    const distance = Math.round(Math.abs(position - PIVOT))

    const logItem = document.createElement('li')
    logItem.textContent = weight + 'kg added - ' + side + ' side ' + distance + 'px from pivot'
    logList.insertBefore(logItem, logList.firstChild)
    
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

 // Reset

 const resetBtn = document.getElementById('reset-btn')

 // Clear all objects and reset simulation
 resetBtn.addEventListener('click', function() {
    // Empty the object array
    objects = []

    // Clear log list
    logList.innerHTML = ''

    // Clear localStorage
    localStorage.removeItem('seesaw-state')

    // Reset pause state
    isPaused = false
    pauseBtn.textContent = 'Pause'

    // Re-render empty seesawS
    render()
 })