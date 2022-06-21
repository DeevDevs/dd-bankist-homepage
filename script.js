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

/**
 * replaces lazy images with quality images (заменяет ленивые изображения более качественными)
 * @param {}
 * @returns {undefined}
 * @author Jonas Shmedtmann
 */
const addingImagesPaths = function () {
  imagesToReplace.forEach((el, i) => {
    const splittedString = invisibleImages[i].src.split('/');
    el.dataset.src = splittedString[splittedString.length - 1];
  });
};

/////////////////// MODAL WINDOW MANIPULATIONS ///////////////////
////////////// МАНИПУЛЯЦИИ С ОКНОМ СОЗДАНИЯ АККАУНТА /////////////
/**
 * the next two functions display/hide the modal window (следующие две функции отображают/прячут окно создания аккаунта)
 * @param {event}
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

//adding a set of listeners for modal window manipulations (добавляем ряд приемников событий для работы с окном создания аккаунта)
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
////////////////////////////////////////////////////////////

// 'Learn More' button activation (приемник события на кнопке 'Learn More')
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

/**
 * scrolling activation through event delegation (скролл страницы с помощью делегирования событий)
 * @param {event}
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('btn--show-modal')
  ) {
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////// BUILDING A TABBED COMPONENT ///////////////////////////
//////////////////////////// КОМПОНЕНТ С ВКЛАДКАМИ /////////////////////////////
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/**
 * manipulates the component with tabs (манипулирует компонентом с вкладками)
 * @param {event}
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  if (!clicked) return;
  //remove the active class from all of them (убрать активирующий класс со всех элементов)
  tabsContent.forEach(child =>
    child.classList.remove('operations__content--active')
  );
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  //Activating the tab (активировать нужную вкладку)
  clicked.classList.add('operations__tab--active');
  //Activating content using the data-tab attribute (активировать контент используя data атрибут)
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

////////////////////// MENU FADE ANIMATION ////////////////////////
//////////////////// ЭФФЕКТ ЗАТЕМНЕНИЯ МЕНЮ //////////////////////
const nav = document.querySelector('.nav');

/**
 * adds fading effect to the menu buttons (добавляет эффект затемнения элементам меню)
 * @param {event} and the bind value (this)
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
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
};

// adding listeners for the hover effect and binding values for opacity (добавляем приемники событий и привязываем значения для прозрачности элементов)
nav.addEventListener('mouseover', hoverHandler.bind(0.5));
nav.addEventListener('mouseout', hoverHandler.bind(1));

////////////////// STICKY NAVIGATION USING INTERSECTION OBSERVER API /////////////////////////
///////// ГЛАВНОЕ МЕНЮ С ЭФФЕКТОМ "STICKY" С ИСПОЛЬЗОВАНИЕМ INTERSECTION OBSERVER API ////////
const navHeight = nav.getBoundingClientRect().height;

/**
 * adds sticky features to the header menu (добавляет эффект 'sticky' меню в верху страницы)
 * @param {entries} values sent by the API
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
const obsCallback = function (entries) {
  // retrieve the element parameters (выводим параметры элемента на момент времени/положения)
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// creating options for the Intersection Observer (прописываем параметры для Intersection Observer API)
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

// adding and activating the observer (добавляем и акивируем API)
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

/////////////////// REVEAL SECTIONS USING INTERSECTION OBSERVER API /////////////////////
//////////// ПОЯВЛЕНИЕ СЕКЦИЙ С ИСПОЛЬЗОВАНИЕМ INTERSECTION OBSERVER API ////////////////
const allSections = document.querySelectorAll('.section');

/**
 * adds fading effect to the menu buttons (добавляет эффект затемнения элементам меню)
 * @param {event} and the bind value (this)
 * @returns {undefined}
 * @author Dmitriy Vnuchkov (original idea by Jonas Shmedtmann)
 */
const revealSection = function (entries, observer) {
  const [entry] = entries;
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

// LAZY LOADING IMAGES
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
