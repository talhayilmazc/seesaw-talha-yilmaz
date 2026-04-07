# Seesaw Simulation

Live demo: https://talhayilmazc.github.io/seesaw-talha-yilmaz/

## Thought Process

I approached this challenge by breaking it into 3 parts:
1. Physics logic (torque calculation)
2. Visual rendering (DOM manipulation)
3. User interaction (click events)

## Core Logic

**Torque = weight × distance from pivot**

The plank is 400px wide. The pivot is at 200px (center).
When a user clicks, I calculate the distance from center
and which side it falls on.

The angle formula:
```javascript
const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10))
```

## Design Decisions

- Used CSS transition for smooth tilt animation
- Object size scales with weight for visual clarity  
- Colors cycle through a palette per object index
- localStorage persists state across page refreshes

## Trade-offs

- Objects stay at their absolute position on the plank
  regardless of tilt (simplification)
- No collision detection between objects

## AI Usage

AI was used only to check syntax and debug small issues.
All core logic, structure, and decisions are my own.