'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
const nav = document.querySelector(`.nav`);
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// implementing learn more button (smooth scrolling)
btnScrollTo.addEventListener(`click`, function (event) {
  const s1coords = section1.getBoundingClientRect(); // get coordinations of section1
  console.log(s1coords);
  // console.log(event.target.getBoundingClientRect()); // event.target is the button on which the eventListener is added.

  // console.log(`current scoll (X/Y)`, window.pageXOffset, window.pageYOffset); // scroll position

  // console.log(
  //   `height and width os viewport`,
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // ); // viewport

  ///////////////////////////////////////////////////////
  // scrolling (Old school)
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // ); // top is related to viewport not top of the page

  // smooth scrolling
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  ///////////////////////////////////////////////////////
  //smooth scrolling (new way) (ONLY WORKS IN SUPER MODERN BROWSERS)
  section1.scrollIntoView({
    behavior: `smooth`,
  });
});

///////////////////////////////////////
// implementing navigation (smooth scrolling)

// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (event) {
//     event.preventDefault();

//     const id = this.getAttribute(`href`);
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: `smooth`,
//     });
//   });
// }); // document.querySelectorAll() returns nodelist. This technique is not efficient, because it create one copy of the callback function for each element. to overcome this we put event handler in the parent element. this is called event delegation

// event delegation
// 1. add event listener to common parent element
// 2. determine what element originated the event
document
  .querySelector(`.nav__links`)
  .addEventListener(`click`, function (event) {
    event.preventDefault();

    // match the target (filter out the target from other elements and the parent)
    if (event.target.classList.contains(`nav__link`)) {
      const id = event.target.getAttribute(`href`);
      document.querySelector(id).scrollIntoView({
        behavior: `smooth`,
      });
    }
  });

///////////////////////////////////////
// tabbed component

tabsContainer.addEventListener(`click`, function (event) {
  const clicked = event.target.closest(`.operations__tab`);

  // guard clause
  if (!clicked) return;

  // removing the active classes
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));

  // activating tab
  clicked.classList.add(`operations__tab--active`);
  // activating content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

///////////////////////////////////////
// menu fade animations
const handleOver = function (event) {
  // console.log(this);

  if (event.target.classList.contains(`nav__link`)) {
    const link = event.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

// passing arguments to event handlers (actually handler functions have ONLY ONE argument, we can not pass others, so we need to set the 'this' keyword manually to the value we want to pass as argument)
// (mouseover bubble, but mouseenter does not)
nav.addEventListener(`mouseover`, handleOver.bind(0.5));
nav.addEventListener(`mouseout`, handleOver.bind(1));

///////////////////////////////////////
//// sticky navigation (old way)
// const initCoords = section1.getBoundingClientRect();
// // console.log(initCoords);

// window.addEventListener(`scroll`, function () {
//   // console.log(window.scrollY);

//   if (window.scrollY > initCoords.top) nav.classList.add(`sticky`);
//   else nav.classList.remove(`sticky`);
// });

//// sticky navigation (NEW way): Intersection Observer API

// callback function is called each time when the threshold is reached, no matter we scroll up or down
// const obsCallback = function (
//   entries, // array of threshold entries
//   observer
// ) {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOption = {
//   root: null, // element we want the target element to intersect
//   // threshold: 0.1, // the percentage (of target element) at which the target element intersect the root element. (10% in this case). we can have multiple thresholds in an array. in other words WHEN 10% OF THE SECTION1 IS VISIBLE
//   threshold: [0.5], // when 50% of section1 is visible
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1); // target element

// implementation
const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when 0% of header is visible
  // rootMargin: Number.parseFloat(getComputedStyle(nav).height) * -1 + `px`, // box of 90px will be applied outside of target

  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
//// revealing sections as we scroll up (not images)
const allSections = document.querySelectorAll(`section`);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);

  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.25,
});

allSections.forEach(function (section) {
  // section.classList.add(`section--hidden`);
  sectionObserver.observe(section);
});

///////////////////////////////////////
//// lazy loading images
const imgTargets = document.querySelectorAll(`img[data-src]`);
const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // replace src attribute with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `300px`,
});

imgTargets.forEach(img => imgObserver.observe(img));

///////////////////////////////////////
// slider component
const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  const slider = document.querySelector(`.slider`);
  const dotContainer = document.querySelector(`.dots`);

  let currSlide = 0;
  const maxSlide = slides.length;

  // slider.style.transform = `scale(0.4) translateX(-800px)`;
  // slider.style.overflow = `visible`;

  // slides.forEach(
  //   (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`)
  // );

  // functions
  const createDots = function () {
    slides.forEach(function (_, index) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class='dots__dot' data-slide="${index}"></button>`
      );
    });
  };

  const activateDot = function (s) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`));

    document
      .querySelector(`.dots__dot[data-slide="${s}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSlide = function (s) {
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - s)}%)`;
    });
  };

  // go to next slide
  const nextSlide = function (event) {
    if (currSlide === maxSlide - 1) currSlide = 0;
    else currSlide += 1;

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide === 0) currSlide = maxSlide - 1;
    else currSlide -= 1;

    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activateDot(0);
  };
  init();

  // event handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);
  // -100%, 0%, 100%, 200%

  // handling keyboard event
  document.addEventListener(`keydown`, function (event) {
    (event.key === `ArrowRight` && nextSlide()) ||
      (event.key === `ArrowLeft` && prevSlide());
  });

  // handling dot events
  dotContainer.addEventListener(`click`, function (event) {
    if (event.target.classList.contains(`dots__dot`)) {
      const slide = Number.parseFloat(event.target.dataset.slide);
      currSlide = slide;

      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
// LECTURES

///////////////////////////////////////
// selecting, creating and deleting elements

/*
// selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector(`.header`);
const allSections = document.querySelectorAll(`.section`);
console.log(allSections);

document.getElementById(`section--1`); // select element by ID
const allButtons = document.getElementsByTagName(`button`); // select all buttons, live updation.
console.log(allButtons);
console.log(document.getElementsByClassName(`btn`));

// creating and inserting elements
const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `we use cookies for improved functionality and analytics`;
message.innerHTML = `we use cookies for improved functionality and analytics. <button class='btn btn--close--cookie'>Got It!</button>`;
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true)); // copying element. true = copy all child elements
// header.before(message); // as sibling of header
// header.after(message); // as sibling of header

// delete element
document
  .querySelector(`.btn--close--cookie`)
  .addEventListener(`click`, function () {
    message.remove();
    // message.parentElement.removeChild(message); // old way of removing element
  });
  */

///////////////////////////////////////
// styles, attributes and classes

/*
// styles
message.style.backgroundColor = `#37383d`;
// message.style.height = `80px`;
message.style.width = `120%`;
console.log(message.style.height); // only works for inline styles we set using .style property. we can not get the style hidden inside a class
console.log(message.style.backgroundColor);

// how to get styles from the classes
console.log(getComputedStyle(message));
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).width);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + 'px';

// css properties / variables
// document.documentElement = :root in css
// document.documentElement.style.setProperty(`--color-primary`, `orangered`);

// HTML attributes
const logo = document.querySelector(`.nav__logo`);
// default attributes, so JS creates a property for each of them on logo object
console.log(logo.alt);
console.log(logo.className); //class
logo.alt = `Beautiful minimal logo`;

// non - default
console.log(logo.designer); // property we created on img tag in HTML, this is not a default attribute of img tag, so JS does not create a property for this on logo object
console.log(logo.getAttribute(`designer`));
logo.setAttribute(`company`, `Bankist`);

console.log(logo.src); // absolute URL
console.log(logo.getAttribute(`src`)); // relative URL

const link = document.querySelector(`.nav__link--btn`);
console.log(link.href); // absolute
console.log(link.getAttribute(`href`)); // relative

// Data attributes
console.log(logo.dataset.versionNumber); // look at HTML

// classes
logo.classList.add(`c`, `j`);
logo.classList.remove(`c`);
logo.classList.toggle(`c`);
logo.classList.contains(`c`, `g`, `f`); // not "includes"

// donot use this, this will overwrite all the classes
// logo.className = `jonas`;
*/

///////////////////////////////////////
// types of events and event handlers

/*
// mouse-enter
const h1 = document.querySelector(`h1`);

const alertH1 = function (event) {
  alert(`addEventListener: Reading the h1`);

  // remove the event handler (after one use)
  // h1.removeEventListener(`mouseenter`, alertH1);
};
h1.addEventListener(`mouseenter`, alertH1);

// removing event listener after certain time
setTimeout(() => {
  h1.removeEventListener(`mouseenter`, alertH1);
}, 3000);

// another way (old way)
// h1.onmouseenter = function (event) {
//   alert(`addEventListener: Reading the h1`);
// };

// another way (refer HTML - h1 element)
*/

///////////////////////////////////////
// event propagation: capturing and target and bubbling

/*
// bubbling
// rgb(255, 255, 255)
const randomInt = (min = 0, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// console.log(Math.random(), 6 - 2 + 1 + 2);
// console.log(randomInt(2, 6));

const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document
  .querySelector(`.nav__link`)
  .addEventListener(`click`, function (event) {
    event.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`LINK`, event.target, event.currentTarget); // event.target: where the event happened, not the element to which the handler is attached. event.currentTarget: the element on which the handler is attached
    console.log(event.currentTarget === this); // true

    // stop event propagation
    // event.stopPropagation();
  });

document
  .querySelector(`.nav__links`)
  .addEventListener(`click`, function (event) {
    event.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`CONTAINER`, event.target, event.currentTarget);
  });

document.querySelector(`.nav`).addEventListener(
  `click`,
  function (event) {
    event.preventDefault();
    this.style.backgroundColor = randomColor();
    console.log(`NAV`, event.target, event.currentTarget);
  }
  // true // the event handler now listens for events in the capturing phase, and not in bubbling phase
);
*/

///////////////////////////////////////
// DOM traversing

/*
const h1 = document.querySelector(`h1`);

//// going downwards (selecting children)
console.log(h1.querySelectorAll(`.highlight`)); // highlight class element gets selected no matter how deep they are in the h1 element. and only highlight elements that are children (direct / not-direct) of h1 gets selected not other that may be present outside the h1

// selecting direct children of h1
console.log(h1.childNodes); // all the nodes inside h1 (text content, comments, span, br etc)
console.log(h1.children); // all elements inside h1 (span, br and another span) ONLY WORKS FOR DIRECT CHILDREN
h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `green`;

//// going upwards (selecting parents)
console.log(h1.parentNode); // direct parent node
console.log(h1.parentElement); // direct parent element

// selecting parent element which is not a direct parent element
h1.closest(`.header`).style.background = `var(--gradient-primary)`; // using css custom properties

h1.closest(`h1`).style.background = `var(--gradient-secondary)`; // the element itself.
// querySelector() finds children no matter how deep they are and closest() finds parents no matter how far they are away

//// going sideways (selecting siblings) can only access direct siblings
console.log(h1.previousElementSibling); // element
console.log(h1.nextElementSibling); // element

console.log(h1.previousSibling); // nodes
console.log(h1.previousSibling); // nodes

// all siblings
console.log(h1.parentElement.children); // all sibling elements including itself
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = `scale(0.5)`;
});
*/

///////////////////////////////////////
// life cycle DOM events

document.addEventListener(`DOMContentLoaded`, function (event) {
  console.log(`HTML parsed and DOM tree build`, event);
});

window.addEventListener(`load`, function (event) {
  console.log(`page fully loaded`, event);
});

// window.addEventListener(`beforeunload`, function (event) {
//   event.preventDefault();
//   console.log(event);
//   event.returnValue = ``; // leaving confirmation
// });
