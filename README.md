# Seesaw Simulation

A physics-based seesaw simulation where you can drop objects by clicking directly on the plank. Built with pure HTML, CSS and Javascript - no libraries, no frameworks.

**Live Demo:** https://talhayilmazc.github.io/seesaw-talha-yilmaz/

---

## What It Does

You click anywhere on the seesaw plank. A new object appears at that exact position with a random weight between 1 and 10 kg. The seesaw then recalculates its balance and tilts accordingly - heavier side goes down, lighter side goes up.

The simulation keeps running as you add more objects. You can pause it, reset it and your progress is saved even if you refresh the page.

---

## How I Approached It

I started by thinking about what the seesaw actually needs to know:

- Where is each object on the plank?
- How heavy is it?
- How far is it from the center?

These three things determine everything. Once I had that clear the rest was just connecting the logic to the UI.

I split the work into three layers:

1.Physsics
The core of the simulation. I calculate torque for each side seperately: torque = weight x distance from pivot

The plankk is 400px wide. The pivot sits at 200px. Exactly in the center. When someone clicks, I find the distance from that center point and which side the click landed on. Then I sum up all the torques on both sides and compute angle: `const angle = Math.max(-30, Math.min(30, (rightTorque - leftTorque) / 10))`

Capped at ±30 degrees so the seesaw doesn't flip completely over.

2.Rendering
Every time a new object is dropped, I clear the plank and redraw everything from current state. The plank rotation is handled with a CSS transform. I used a 'transition' in CSS for the smooth tilt.

Object sizes scale with weight so heavier objects look visually bigger. Each object shows its weight in kg.,

3.Interaction
Click events on the plank use 'event.offsetX' to get the position relative to the plank itself. I tried 'getBoundingClientRect' first but ran into an illegal invocation error, so I switched to 'offsetX' which worked cleanly.

Pause stops new objects from being added. Reset clears everything including localStorage. Sound is generated with the Web Audio API - no external filex needed.

---

## Features

- Drop objects by clicking directly on the plank
- Real torque-based physsics calculation
- Smooth tilt animation
- Object size scales with weight (1kg = small, 10kg = large)
- Weight display for left and right sides
- Pause / Resume
- Reset
- Drop sound effect via Web Audio API
- State persisted in localStorage across page refreshes

---

## What I Would Improve

- Objects currently stay at their original click position visually, even when plank tilts. In more realistic simualation, they would slide slightly as the angle changes.
- No collision detection between objects - they can overlap if you click in the same spot.
- The sound effect is very basic. A proper audio file would feel much better.

---

## AI Usage

I used ChatGPT to double-check a couple of Web Audio API method names ('setValueAtTime', 'exponentialRampToValueAtTime') since I hadn't used that API before. Everything else (the pyhsics logic, the rendering approach, the state management, the overall structure) I worked out myself.