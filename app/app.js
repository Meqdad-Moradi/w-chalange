const header = document.querySelector("#header");

function stickyHeader() {
  const size = window.scrollY;
  const headerHeight = header.offsetHeight.height;
  header.style.transition = "all .3s ease-in-out";

  if (size > 0) {
    header.classList.add("sticky-header");
    document.body.style.marginTop = headerHeight + "px";
  } else {
    header.classList.remove("sticky-header");
    document.body.style.marginTop = 0 + "px";
  }
}

window.addEventListener("scroll", stickyHeader);

// ************ shocase slide ************* //

const slides = Array.from(document.querySelectorAll(".slide"));
const sliderIndicator = document.querySelectorAll(".slider-indicator span");
const auto = true;
const intervalTime = 10000;
let interval;
let counter = 0;

function reset() {
  slides.forEach((slide) => slide.classList.remove("active"));
  sliderIndicator.forEach((indicator) => indicator.classList.remove("active"));
}

function slider() {
  counter++;
  if (counter > slides.length - 1) {
    counter = 0;
  }
  reset();
  slides[counter].classList.add("active");
  sliderIndicator[counter].classList.add("active");
}

// auto slide
if (auto) {
  interval = setInterval(slider, intervalTime);
}

// slide using slider indicator
sliderIndicator.forEach((indicator, index) =>
  indicator.addEventListener("click", (e) => {
    reset();

    slides[index].classList.add("active");
    sliderIndicator[index].classList.add("active");
    counter = index;

    if (auto) {
      clearInterval(interval);
      interval = setInterval(slider, intervalTime);
    }
  })
);

// ************ responsive navbar ************* //
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");

function responsiveNav() {
  const id = nav.getAttribute("data-visible");
  const toggleEl = navToggle.querySelector('i')

  if (id === "false") {
    nav.setAttribute("data-visible", true);
    toggleEl.className = 'fas fa-times'
  } else {
    nav.setAttribute("data-visible", false);
    toggleEl.className = 'fas fa-bars'
  }
}

navToggle.addEventListener("click", responsiveNav);
