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

// LEARNING TO MANIPULATE SLIDES

//here we just rescale the images and the entire slider part to make it more comfortable to see
// const slider = document.querySelector('.slider');
// slider.style.transform = `scale(0.2)`;
// slider.style.overflow = 'visible';

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
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

// Load is an event, when all the sections and images are loaded.
window.addEventListener('load', function (e) {
  console.log('Page fully loaded!', e);
});

// Beforeunload is an event, when the user is about to leave the page. DO NOT ABUSE IT
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // this may be required, to prevent the user from leaving
//   console.log(e);
//   e.returnValue = ''; // this is to initiate the Leave Site? pop up window. Whatever is written here, the popUp window will always be the same (to avoid abuse)
// });

// LECTURES
///////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// SELECT, CREATE, INSERT and REMOVE ELEMENTS

// //Selecting Elements
// console.log(document); // this is NOT how we select document
// console.log(document.documentElement); // this is how we select the entire document
// console.log(document.body); // selecting body
// console.log(document.head);
// document.querySelector('.header'); // Selecting 1 element by class

// const allSections = document.querySelectorAll('.section'); // Selecting many elements by class
// console.log(allSections); // it returns a NodeList

// document.getElementById('section--1'); // Selecting elements by ID
// //OR
// document.querySelector('#section--1');

// const allButtons = document.getElementsByTagName('button'); // Selecting elements by TAG
// console.log(allButtons); // it returns an HTMLCollection

// document.getElementsByClassName('btn'); // It also returns an HTMLCollection

// // Creating and Inserting Elements
// //One of the most popular is .insertAdjacentHTML
// const message = document.createElement('div'); // Creating an Element
// message.classList.add('cookie-message'); // Adding class to the object
// message.textContent = 'We use cookies for improved functionality and analytics';
// message.innerHTML =
//   'We use cookies for improved funcitonality and analytics. <button class="btn btn-close-cookie">Got it!</button>'; // Adding content
// document.querySelector('.header').prepend(message); // Adding the Element to the Document. PREPEND adds the element as the first child of the chosen element
// document.querySelector('.header').append(message); //Adding as the last child element
// // IMPORTANT. The APPEND method didn't just add the message element as the last child. In this case it actually moved the element that we used to PREPEND first. So, we can use prepend and append to MOVE elements within the parent TAG/Element.
// //However, if we want to append another same element, we need to copy it first. Look below
// document.querySelector('.header').append(message.cloneNode(true)); // TRUE implies that all the child elements within the cloned element are added too. Now we have TWO messages at the end of the chosen element.
// document.querySelector('.header').before(message); // adds the message as a SIBLING before the chosen element
// document.querySelector('.header').after(message); // adds the message as a SIBLING after the chosen element

// //Deleting Elements
// document
//   .querySelector('.btn-close-cookie')
//   .addEventListener('click', function () {
//     message.remove(); // This is the method used to remove elements
//     // OR, the older version is
//     // message.parentElement.removeChild(message);
//   });

// STYLES, ATTRIBUTES AND CLASSES

// //styles - changing styles
// //Here we have inline styles.
// message.style.backgroundColor = '#37383d'; // use camelCase
// message.style.width = '120%'; // write exactly as you would do that in CSS

// console.log(message.style.color); // We cannot retrieve this info this way because we didn't set it as inline style ourselves
// console.log(message.style.backgroundColor); // rgb(55, 56, 61) --- here we can do it though
// console.log(getComputedStyle(message).color); // rgb(187, 187, 187) --- however we CAN retrieve it using this method
// console.log(getComputedStyle(message).height); // 49px --- we can even reteive values that were not set in CSS but were computed by the browser to show the page

// //and now we can change the value
// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;
// //we use parseFloat to retrieve the number from the computed value as initially it was a string '49px'...

// // OR we can change it this way. First, find the property in CSS, then address it through JS.
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// //attributes - changing attributes
// const logo = document.querySelector('.nav__logo');
// //standard properties
// console.log(logo.alt); // Bankist logo
// console.log(logo.className); // nav__logo
// console.log(logo.src); // http://127.0.0.1:5500/img/logo.png --- absolute version of the url
// console.log(logo.getAttribute('src')); // img/logo.png --- relative version of the url

// //non-standard property
// console.log(logo.designer); // undefined ---  if we create this property and then try to reach it, it will be undefined, because it is NON STANDARD property for images
// console.log(logo.getAttribute('designer')); // Jonas --- here it works just fine

// //when retrieving attributes, they can be absolute and relative, like with the URL above
// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // http://127.0.0.1:5500/index.html#
// console.log(link.getAttribute('href')); // #

// //we can simply change attribute values
// logo.alt = 'Beautiful Minimalist Logo'; // and it is changed

// //we can easily create attributes in the following way
// logo.setAttribute('company', 'Bankist'); // First is the name of the attribute, and the second is the value itself

// //Data attributes - attributes that are then stored in a special dataset. It is created by starting the attribute with "data-" and then all the rest
// console.log(logo.dataset.versionNumber); // 3.0 --- when we retrieve it, we need to use camelCase, like with CSS styling

// //classes - changing classes
// logo.classList.add('a', 'c'); // we can add one or more classes
// logo.classList.remove('a', 'c');
// logo.classList.toggle('c');
// logo.classList.contains('c'); // not includes
// //DO NOT set a class this way, as it will remove all the other classes and will allow having one class only
// // logo.className = 'jonas';

// SMOOTH SCROLLING

// const btnScrollTo = document.querySelector(`.btn--scroll-to`);
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function (e) {
//   const s1coords = section1.getBoundingClientRect(); // Here we find out the current position of the targeted DOM element in the browser window
//   console.log(s1coords); // DOMRect {x: 0, y: 749.6000366210938, width: 1109.5999755859375, height: 1396.4000244140625, top: 749.6000366210938, …} --- It changes if I scroll the page

//   console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset); // Current scroll (X/Y) 0 0  --- It is ZEROS if I am at the top of the page. When I scroll down, Y (vertical) starts growing (it shows how much I have scrolled)... If I zoom and move right, X (horizontal) starts changing

//   console.log(
//     'height/widnth of the viewport',
//     document.documentElement.clientHeight,
//     document.documentElement.clientWidth
//   ); // height/widnth of the viewport 852, 1261 --- It shows the height and the width of the window that I view the page through. Whenever I change the size of the window or zoom, these parameters change too.

//   // ---------- SCROLLING -------------
//   // So, to implement SCROLLING to the other section of the page, we need to use the scrollTo function for the global WINDOW. This way the browser finds out how much it needs to move right and how much it needs to move down. Arguments are:
//   // 1. LEFT of the targeted section + How much it has been moved RIGHT already (usually 0)
//   // 2. (TOP of the targeted section (how much it is left to the top of the vieport) + How much it has been scrolled already at that moment (window.pageYOffset). Together, these two parameters show to the browser, where the sections starts relative the top of the document.
//   window.scrollTo(
//     s1coords.left + window.pageXOffset,
//     s1coords.top + window.pageYOffset
//   );

//   // Now, to make it smooth we need to pass an object as an argument to the scrollTo method with three parameters - left, top and behavior

//   window.scrollTo({
//     left: s1coords.left + window.pageXOffset,
//     top: s1coords.top + window.pageYOffset,
//     behavior: 'smooth',
//   });

//   // THAT WAS OLD SCHOOL. NOW THERE IS MORE MODERN WAY
//   section1.scrollIntoView({ behavior: 'smooth' });
// });

// TYPES OF EVENTS, EVENT HANDLERS
// const h1 = document.querySelector('h1');
// // h1.addEventListener('mouseenter', function (e) {
// //   alert('adEventListener: Great! You are reading the Heading xD!');
// // });
// // // Another, more direct (OLDSCHOOL) way of doing it is
// // h1.onmouseenter = function (e) {
// //   alert('onmouseenter: Great! You are reading the Heading xD!');
// // };

// //addEventListener is better because it can have multiple functions inside, and the event handler can be removed to make it work just once... GENIUS
// const alertH1 = function (e) {
//   alert('adEventListener: Great! You are reading the Heading xD!');
//   h1.removeEventListener('mouseenter', alertH1); // Here it is removed once it is activated
// };
// h1.addEventListener('mouseenter', alertH1);
// //If we want, we can set a timer, and the eventListener will be active only for some period of time, and so on...
// // The third way of doing it (VERYOLDSCHOOL), is to set alert in HTML (check HTML)

// // EVENT PROPARAGTION: EVENT BUBBLING
// //rgb(255,255,255) - this is how color is represented. Let's create random colors
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min); //Random int function

// const randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;
// console.log(randomColor()); // Here we create random colors

// //E.TARGET shows, where the event happened originally (LINK(button))
// //E.CURRENTTARGET shows, where the event is happening at the moment of this function being active (ALL THREE, IF WE CLICK ON THE LINK(button)
// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);

//   //Event propagation can be stopped though
//   e.stopPropagation(); // Now it will happen in the LINK(button) and the CONTAINER, but NOT in the NAV panel
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// ); // Look at the third parameter here - TRUE. It means that we listen to the event at its CAPTURING PHASE. It means that when earlier the event on the link was listened first as it was Bubbling Up, now it is listened by this function at its Capturing Phase (before it reachers the Bubbling Phase). So, the event is listened first by the NAV panel (capturing phase), then by the link (first at the bubbling phase), and the container (second at the bubbling phase)... By default it is FALSE.

// Initial approach to implement smooth scrolling (no Event Delegation)
// //smooth scrolling to all the other sections - Navigation Panel
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // Previously, HTML has the feature to move to other sections when you click the elements in the NAV. So, it was a default feature. Now, we prevent it, so it does not jump to the corresponding sections, when you click on them. We do that to make 'smooth scrolling' possible. However, let us use the 'href' attributes used in those 'nav' buttons for the following
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   }); //However, following this principle means attaching a copy of the function to each of the buttons. In larger numbers, it can affect the performance. Hence, let us use the "Event Delegation"
// });

// DOM TRAVERSING
// console.log(h1);

// //Going downwards: children
// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); // NodeList(9) --- basically, all the children inside at any level
// console.log(h1.children); // HTMLCollection(3) --- only direct children
// h1.firstElementChild.style.color = 'white'; // now the word 'banking' is white. it is the first direct child
// h1.lastElementChild.style.color = 'black'; // new the word 'minimalist' is black

// //Going upwards: parents
// console.log(h1.parentNode); // the header__title DIV
// console.log(h1.parentElement); // still the header__title DIV. Here they are the same. However, now this parentElement can be worked with
// h1.closest('.header').style.background = 'var(--gradient-secondary)'; // we address the closest parent element using 'closest' and then use the CSS feature through 'var()'
// h1.closest('h1').style.background = 'var(--gradient-primary)'; // If the closest element is ITSELF, it will adress itself
// // While 'querySelector' finds children no matter how far they are, 'closest' finds parents no matter how far they are

// //Going sideways: siblings
// console.log(h1.previousElementSibling); // null --- h1 is the first sibling
// console.log(h1.nextElementSibling); // h4 element
// console.log(h1.previousSibling); // #text --- learn more about it
// console.log(h1.nextSibling); // #text too
// console.log(h1.parentElement.children); // HTML collection with all the siblings and itself
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// }); // Now, all the sibling of the target h1 have decreased in size by 50%

// Sticky Navigation: Intersection Observer API
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// }; // It is called with two arguments
// const obsOptions = {
//   root: null,
//   threshold: 0.5,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1); //whenever the target (see argument: header) intersects/stops intersecting something (here 'the viewport' - see obsOptions: root) by a certain value (here '10 percent' - see obsOptions: threshold), the obsCallback function will be called.
