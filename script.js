// Track whether the About sequence has run and store timeouts
let aboutStarted = false;
let aboutTimeouts = [];

// Smooth scroll helper
function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Intercept nav & scroll-cue clicks for smooth scrolling and content triggers
document.querySelectorAll('nav a, .scroll-cue').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const target = el.dataset.target;
    if (target === 'home') {
      resetHero();
    } else if (target === 'credits') {
      resetCredits();
      scrollToSection('credits');
      startAboutSequence();
    } else {
      resetCredits();
      scrollToSection(target);
    }
  });
});

// Wire up the “Play the Movie” button
document.getElementById('play-button').addEventListener('click', playMovie);

// Play intro video → then show About sequence
function playMovie() {
  const video   = document.getElementById('intro-video');
  const overlay = document.getElementById('hero-overlay');
  const button  = document.getElementById('play-button');

  button.disabled       = true;
  overlay.style.display = 'none';

  video.style.display   = 'block';
  video.play();

  video.onended = () => {
    video.style.display = 'none';
    scrollToSection('credits');
    startAboutSequence();
  };
}

// Reset the hero so Home works and button re-enables
function resetHero() {
  const video   = document.getElementById('intro-video');
  const overlay = document.getElementById('hero-overlay');
  const button  = document.getElementById('play-button');

  video.pause();
  video.currentTime      = 0;
  video.style.display    = 'none';
  overlay.style.display  = 'flex';
  button.disabled        = false;

  scrollToSection('home');
}

// Reset About credits for replay, clearing all pending timeouts
function resetCredits() {
  aboutStarted = false;
  // Clear scheduled timeouts
  aboutTimeouts.forEach(id => clearTimeout(id));
  aboutTimeouts = [];

  // Remove final layout and hide all paragraphs
  const roll = document.querySelector('.credits-roll');
  roll.classList.remove('final');
  document.querySelectorAll('.credits-roll p').forEach(p => {
    p.style.display    = 'none';
    p.style.opacity    = 0;
    p.style.transition = '';
  });
}

// Sequentially fade in/out each line, then show all in final layout
function startAboutSequence() {
  if (aboutStarted) return;
  aboutStarted = true;

  const paragraphs = Array.from(document.querySelectorAll('.credits-roll p'));
  const fadeInDur  = 1000;
  const displayDur = 2000;
  const fadeOutDur = 1000;
  let delay        = 500;

  paragraphs.forEach(p => {
    // Fade in each line
    aboutTimeouts.push(setTimeout(() => {
      p.style.display    = 'block';
      p.style.transition = `opacity ${fadeInDur}ms ease-in-out`;
      p.style.opacity    = 1;
    }, delay));

    delay += fadeInDur + displayDur;

    // Fade out each line (including last)
    aboutTimeouts.push(setTimeout(() => {
      p.style.transition = `opacity ${fadeOutDur}ms ease-in-out`;
      p.style.opacity    = 0;
    }, delay));

    delay += fadeOutDur;
  });

  // After all fade-outs, show all lines simultaneously in final layout
  aboutTimeouts.push(setTimeout(() => {
    const roll = document.querySelector('.credits-roll');
    roll.classList.add('final');
    document.querySelectorAll('.credits-roll p').forEach(p => {
      p.style.display    = 'block';
      p.style.opacity    = '';
      p.style.transition = '';
    });
  }, delay));
}
