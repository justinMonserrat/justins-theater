let aboutStarted = false;
let aboutTimeouts = [];
let aboutTriggeredByClick = false;
let bgAudio = null;

// Scroll helper
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Nav + Scroll Cue Events
document.querySelectorAll('nav a, .scroll-cue').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.dataset.target;

    if (target === 'credits') {
      aboutTriggeredByClick = true;
    }

    if (target === 'home') {
      resetHero();
    } else {
      scrollToSection(target);
    }

    if (target === 'credits') {
      resetCredits();
      startAboutSequence();
    } else {
      resetCredits();
    }
  });
});

// Play Button Behavior
document.getElementById('play-button').addEventListener('click', () => {
  const video = document.getElementById('intro-video');
  const overlay = document.getElementById('hero-overlay');
  const intro = document.getElementById('hero-intro');
  const postMessage = document.getElementById('post-video-message');

  aboutTriggeredByClick = true;

  // Hide intro content and post-video message
  intro.style.display = 'none';
  postMessage.style.display = 'none';
  overlay.style.display = 'none';

  // Show and play the video
  video.style.display = 'block';
  video.play();

  // When video ends
  video.onended = () => {
    video.style.display = 'none';
    scrollToSection('credits');
    resetCredits();
    startAboutSequence();

    // Show "Enjoy the show!" message
    overlay.style.display = 'flex';
    postMessage.style.display = 'block';
  };
});

// Restart Button Behavior
document.getElementById('restart-button').addEventListener('click', () => {
  resetHero();
  document.getElementById('post-video-message').style.display = 'none';
  document.getElementById('hero-intro').style.display = 'flex';
});

// Reset Hero
function resetHero() {
  const video = document.getElementById('intro-video');
  const overlay = document.getElementById('hero-overlay');
  const button = document.getElementById('play-button');

  video.pause();
  video.currentTime = 0;
  video.style.display = 'none';
  overlay.style.display = 'flex';
  button.disabled = false;

  scrollToSection('home');
}

// Reset About Section
function resetCredits() {
  aboutStarted = false;
  aboutTimeouts.forEach(clearTimeout);
  aboutTimeouts = [];

  const roll = document.querySelector('.credits-roll');
  roll.classList.remove('final');

  document.querySelectorAll('.credits-roll p').forEach(p => {
    p.style.display = 'none';
    p.style.opacity = 0;
    p.style.transition = 'none';
  });

  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    document.getElementById('mute-button').style.display = 'none';
  }
}

// Start About Section
function startAboutSequence() {
  if (aboutStarted) return;
  aboutStarted = true;

  const roll = document.querySelector('.credits-roll');
  const paragraphs = [...document.querySelectorAll('.credits-roll p')];

  if (!aboutTriggeredByClick) {
    roll.classList.add('final');
    paragraphs.forEach(p => {
      p.style.display = 'block';
      p.style.opacity = 0.85;
    });
    return;
  }

  // Start background music
  bgAudio = new Audio('assets/hans_zimmer_time.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.5;
  bgAudio.play();
  document.getElementById('mute-button').style.display = 'block';

  // Rolling credits
  let delay = 500;
  const fadeIn = 1000, hold = 2000, fadeOut = 1000;

  paragraphs.forEach(p => {
    aboutTimeouts.push(setTimeout(() => {
      p.style.display = 'block';
      p.style.transition = `opacity ${fadeIn}ms ease-in-out`;
      p.style.opacity = 1;
    }, delay));

    delay += fadeIn + hold;

    aboutTimeouts.push(setTimeout(() => {
      p.style.transition = `opacity ${fadeOut}ms ease-in-out`;
      p.style.opacity = 0;
    }, delay));

    delay += fadeOut;
  });

  aboutTimeouts.push(setTimeout(() => {
    roll.classList.add('final');
    paragraphs.forEach(p => {
      p.style.display = 'block';
      p.style.opacity = 0.85;
      p.style.transition = '';
    });
    aboutTriggeredByClick = false;
  }, delay));
}

// Mute Button Handler
const muteButton = document.getElementById('mute-button');
muteButton.addEventListener('click', () => {
  if (!bgAudio) return;
  bgAudio.muted = !bgAudio.muted;
  muteButton.textContent = bgAudio.muted ? '🔇' : '🔊';
});

// Hamburger toggle menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('open');
});
