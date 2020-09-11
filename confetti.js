// Confetti floating with images
// based on
// https://github.com/mathusummut/confetti.js

//Canvas element ID
const CONFETTI_NAME = "PIN_CONFETTI";

const confetti = {
  maxCount: 80, //set max confetti count
  maxPerClick: 6, // Max confetti count per single click
  size: 30, //Initial size of particles
  speed: 5, //set the particle animation speed
  frameInterval: 15, //the confetti animation frame interval in milliseconds
  alpha: 1, //Start alpha/opacity value
  fadeBorder: 0.6, //Height where fading starts
  fade: 0.008, //Alpha fade per frame
  xStart: 0.1, //Left most start pos
  xArea: 0.4, //Area to use from xStart
  start: null, //call to start confetti animation (with optional timeout in milliseconds, and optional min and max random confetti count)
  stop: null, //call to stop adding confetti
  toggle: null, //call to start or stop the confetti animation depending on whether it's already running
  pause: null, //call to freeze confetti animation
  resume: null, //call to unfreeze confetti animation
  togglePause: null, //call to toggle whether the confetti animation is paused
  remove: null, //call to stop the confetti animation and remove all confetti immediately
  isPaused: null, //call and returns true or false depending on whether the confetti animation is paused
  isRunning: null, //call and returns true or false depending on whether the animation is running
  colors: [
    "#1e90ff",
    "#6b8e23",
    "#ffd700",
    "#ffc0cb",
    "#6a5acd",
    "#add8e6",
    "#ee82ee",
    "#98fb98",
    "#4682b4",
    "#f4a460",
    "#d2691e",
    "#dc143c",
  ],
};

confetti.start = startConfetti;
confetti.stop = stopConfetti;
confetti.toggle = toggleConfetti;
confetti.pause = pauseConfetti;
confetti.resume = resumeConfetti;
confetti.togglePause = toggleConfettiPause;
confetti.isPaused = isConfettiPaused;
confetti.remove = removeConfetti;
confetti.isRunning = isConfettiRunning;
confetti.addConfetti = addConfetti;

const supportsAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame;

const requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      return window.setTimeout(callback, confetti.frameInterval);
    }
  );
})();
let stopTimer = null;
let streamingConfetti = false;
let animationTimer = null; // eslint-disable-line
let pause = false;
let lastFrameTime = Date.now();
let particles = [];
let context = null;
let _rootEl;

function resetParticle(particle, width, height) {
  const screenRatio = width / 1980;

  const leftMost = width * confetti.xStart;

  particle.screenRatio = screenRatio;
  particle.x = particle.startX =
    leftMost + Math.random() * (confetti.xArea * width);
  particle.y = particle.startY = height;
  particle.size = confetti.size + Math.floor(Math.random() * 15);
  particle.reSize = (particle.size * screenRatio) / 120;
  particle.toSize =
    (confetti.size + Math.floor(Math.random() * 15)) * screenRatio;
  particle.vel = Math.max(confetti.speed * screenRatio, 2.5);
  particle.dir = 0 + Math.random() * -1 * screenRatio;

  particle.tilt = Math.random() * 10 - 10;
  particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
  particle.tiltAngle = Math.random() * Math.PI;

  particle.color =
    confetti.colors[Math.floor(confetti.colors.length * Math.random())];
  particle.fadeBorder = height * confetti.fadeBorder;
  particle.fade = confetti.fade;
  particle.alpha = confetti.alpha;

  return particle;
}

function toggleConfettiPause() {
  if (pause) {
    resumeConfetti();
  } else {
    pauseConfetti();
  }
}

function isConfettiPaused() {
  return pause;
}

function pauseConfetti() {
  pause = true;
}

function resumeConfetti() {
  pause = false;
  runAnimation();
}

function runAnimation() {
  if (pause) {
    return;
  } else if (particles.length === 0) {
    context.clearRect(0, 0, _rootEl.clientWidth, _rootEl.clientHeight);
    animationTimer = null;
  } else {
    const now = Date.now();
    const delta = now - lastFrameTime;

    if (!supportsAnimationFrame || delta > confetti.frameInterval) {
      context.clearRect(0, 0, _rootEl.clientWidth, _rootEl.clientHeight);
      updateParticles();
      drawParticles(context);
      lastFrameTime = now - (delta % confetti.frameInterval);
    }
    animationTimer = requestAnimationFrame(runAnimation);
  }
}

function startConfetti({ timeout, amount, img, rootEl } = {}) {
  _rootEl = rootEl;
  let canvas = rootEl.querySelector(`#${CONFETTI_NAME}`);

  const width = rootEl.clientWidth;
  const height = rootEl.clientHeight;

  if (canvas === null) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("id", CONFETTI_NAME);
    canvas.setAttribute(
      "style",
      "display:block;z-index:999999;pointer-events:none;position:absolute;top:0"
    );
    rootEl.insertAdjacentElement("afterbegin", canvas);
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute("aria-hidden", true);
    canvas.setAttribute("focusable", false);
    window.addEventListener(
      "resize",
      function () {
        canvas.width = rootEl.clientWidth;
        canvas.height = rootEl.clientHeight;
      },
      true
    );
    context = canvas.getContext("2d");
  } else if (context === null) {
    context = canvas.getContext("2d");
  }
  let count = Math.min(Math.pow(amount, 2), confetti.maxPerClick);

  while (count > 0 && particles.length < confetti.maxCount) {
    count--;
    particles.push(resetParticle({ img }, width, height));
  }

  streamingConfetti = true;
  pause = false;
  runAnimation();
  if (timeout) {
    clearTimeout(stopTimer);
    stopTimer = window.setTimeout(stopConfetti, timeout);
  }
}

function addConfetti({ amount, img, rootEl }) {
  _rootEl = rootEl;
  const width = rootEl.clientWidth;
  const height = rootEl.clientHeight;
  let count = Math.min(Math.pow(amount, 2), confetti.maxPerClick);

  let countToAdd = Math.min(count, confetti.maxCount - count);
  streamingConfetti = true;

  while (countToAdd > 0 && particles.length < confetti.maxCount) {
    countToAdd--;
    particles.push(resetParticle({ img }, width, height));
  }

  if (!isConfettiRunning()) {
    runAnimation();
    addConfetti;
  }
}

function stopConfetti() {
  streamingConfetti = false;
}

function removeConfetti() {
  stop();
  pause = false;
  particles = [];
}

function toggleConfetti() {
  if (streamingConfetti) {
    stopConfetti();
  } else {
    startConfetti();
  }
}

function isConfettiRunning() {
  return streamingConfetti;
}

function drawParticles(context) {
  let particle;

  for (let i = 0; i < particles.length; i++) {
    particle = particles[i];

    // Show image or paper thing
    if (particle.img) {
      context.save();
      context.globalAlpha = particle.alpha < 0 ? 0 : particle.alpha;

      context.drawImage(
        particle.img,
        particle.x,
        particle.y,
        particle.size,
        particle.size
      );

      context.restore();
    } else {
      context.save();
      context.globalAlpha = particle.alpha < 0 ? 0 : particle.alpha;

      context.beginPath();
      context.lineWidth = particle.size;
      let x2 = particle.x + particle.tilt;
      let x = x2 + particle.size / 2;
      let y2 = particle.y + particle.tilt + particle.size / 2;

      context.strokeStyle = particle.color;
      context.moveTo(x, particle.y);
      context.lineTo(x2, y2);
      context.stroke();

      context.restore();
    }
  }
}

function updateParticles() {
  let particle;
  for (let i = 0; i < particles.length; i++) {
    particle = particles[i];

    particle.y -= particle.vel;
    particle.dir += Math.random() * -0.005;
    particle.size -= particle.size > particle.toSize ? particle.reSize : 0;

    // Start fadeout only after the emoji has been visible for some time
    if (particle.y < particle.fadeBorder) {
      particle.alpha -= particle.fade;
    }

    particle.dir += Math.random() * -0.005;
    particle.tiltAngle += particle.tiltAngleIncrement;
    particle.tilt = Math.sin(particle.tiltAngle) * confetti.speed;

    if (particle.y < -50 || particle.x < -50 || particle.alpha < 0) {
      particles.splice(i, 1);
    }
  }

  if (particles.length === 0) {
    stopConfetti();
  }
}

export default confetti;
