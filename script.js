'use strict';

///////////////////////////////////////
// Modal window
const header = document.querySelector('.header');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector('#section--1');
const h1 = document.querySelector('h1');
//Variables for Slides
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
const invisibleImages = document.querySelectorAll('.img-set');
const imagesToReplace = document.querySelectorAll('.features__img');

const addingImagesPaths = function () {
  imagesToReplace.forEach((el, i) => {
    const splittedString = invisibleImages[i].src.split('/');
    el.dataset.src = splittedString[splittedString.length - 1];
  });
};

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//opening/closing the Modal Window
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal); Let us use forEach instead
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLLING to the section 1
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// SMOOTH SCROLLING FROM ALL NAV BUTTONS - Event Delegation
//1. add eventListener to common parent element
//2. Determine, what element originated the event (e.target)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //below, we check if the element we are clicking containts the class needed. Otherwise, the entire parent element activates the scrolling and creates an error
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

// BUILDING A TABBED COMPONENT
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //Guard Clause - used to terminate function, if needed
  if (!clicked) return;
  //Before activating the tab and the content window, I remove the active class from all of them to assign it to the ones I need
  tabsContent.forEach(child =>
    child.classList.remove('operations__content--active')
  );
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  //Activating the tab
  clicked.classList.add('operations__tab--active');
  //Activating content - I used the data-tab attribute through dataset to find the window
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION
const nav = document.querySelector('.nav');

const hoverHandler = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
}; //we use mouseover because it bubbles, while mouseenter doesn't

// nav.addEventListener('mouseover', function (e) {
//   hoverHandler(e, 0.5);
// });
// nav.addEventListener('mouseout', function (e) {
//   hoverHandler(e, 1);
// });
//instead of putting the function inside and make it look ugly, we can use the BIND method and pass the 'argument' into the handler. we just leave the 'e' argument in the initial function, and use THIS in the opacity (Read More)
nav.addEventListener('mouseover', hoverHandler.bind(0.5));
nav.addEventListener('mouseout', hoverHandler.bind(1));

// STICKY NAVIGATION EFFECT just for the section 1 (old version)
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// STICKY NAVIGATION: Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
const obsCallback = function (entries) {
  // nav.classList.contains('sticky')
  //   ? nav.classList.add('sticky')
  //   : nav.classList.remove('sticky');
  //OR
  const [entry] = entries; // this is how I select ONE entry of the entries (here it is always one)
  if (!entry.isIntersecting) nav.classList.add('sticky');
  // isIntersecting is a property of the entry
  else nav.classList.remove('sticky');
}; // It is called with two arguments
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, // This is to modify the treshold slightly. E.g. here it shows that I want the function to be called navHeight BEFORE the end of the Header intersection
}; // Also, I can insert it directly into the arguments below
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

// REVEAL SECTIONS using Intersection Observer API
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries; // here we get just one entry out of entries
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden'); // To make that only section reveal, which I am looking at...
  observer.unobserve(entry.target); // To stop obsering the section which has already been revealed (for the sake of the performance)
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

//LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]'); // This is how we use only the images that have the data-src attribute (have higher resolution versions)

const revealImage = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  //Instead of removing the lazy-img class immediately, better to wait for the picture loading is over, and then only remove the class. Let us use the EventListener
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  //stop observing
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(revealImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // This parameter makes the images load 200px BEFORE they reach the root (viewport)
});
imgTargets.forEach(function (img) {
  imgObserver.observe(img);
});

//here we place each of the slides in one row
slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

//---- here we create functions for the buttons ----

//common variable for most of the functions below
let curSlide = 0;

//This is how we create the dots for slides
const createDots = function () {
  slides.forEach(function (_, i) {
    dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

// this is a general sliding function
const goToSlide = function (cuS) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - cuS)}%)`)
  );
  activateDot(curSlide);
};

const nextSlide = function () {
  //first we check if we have reached the last slide. If yes, we jump back to the first one
  curSlide < slides.length - 1 ? curSlide++ : (curSlide = 0);
  // then we use that value, to move the slides horizontally
  goToSlide(curSlide);
};

const prevSlide = function () {
  curSlide > 0 ? curSlide-- : (curSlide = slides.length - 1);
  goToSlide(curSlide);
};

const activateDot = function (cuS) {
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');
    //Here we choose the slide that should be active
    document
      .querySelector(`.dots__dot[data-slide="${cuS}"]`)
      .classList.add('dots__dot--active');
    //OR
    // if (dot.dataset.slide === `${cuS}`) dot.classList.add('dots__dot--active');
  });
};
//This is the function that we need to run at the page refresh to create/activate Dots
const init = function () {
  createDots();
  activateDot(curSlide);
  addingImagesPaths();
};

// -------- Event handlers --------
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

// Go to Slide using keyboard Arrows
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide(); // Notice that I can use either IF
  e.key === 'ArrowRight' && nextSlide(); // or Short Circuit... both work just fine
});

//here we do Event Delegation to make dots work
dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) return;
  curSlide = e.target.dataset.slide;
  // OR ... below is the example of DESTRUCTURING (Read More)
  // const { slide } = e.target.dataset;
  // console.log(slide);

  goToSlide(curSlide);
});

//creating and activating dots at page load
init();

// LIFECYCLE DOM EVENTS
// DOMContentLoaded is an event, when the HTML DOM tree and the initial JS Script are loaded and executed
// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// // Load is an event, when all the sections and images are loaded.
// window.addEventListener('load', function (e) {
//   console.log('Page fully loaded!', e);
// });
