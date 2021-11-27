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
const intervalTime = 5000;
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
  const toggleEl = navToggle.querySelector("i");

  if (id === "false") {
    nav.setAttribute("data-visible", true);
    toggleEl.className = "fas fa-times";
  } else {
    nav.setAttribute("data-visible", false);
    toggleEl.className = "fas fa-bars";
  }
}

navToggle.addEventListener("click", responsiveNav);

// ************ catalog page ************* //
const productsEl = document.querySelector("#display-product .products");
const filterBtnsContainer = document.querySelector(".filter-btn-container");

productsEl.innerHTML = "";
filterBtnsContainer.innerHTML = "";

fetch("./data.json")
  .then((res) => {
    if (res.status === 200) {
      return res.json();
    } else {
      throw new Error("Data not found!");
    }
  })
  .then((data) => {
    products(data);
    filterBtnsCategory(data);
  });

// filter btns
function filterBtnsCategory(data) {
  const colors = data
    .reduce(
      (item, color) => {
        if (!item.includes(color.color)) {
          item.push(color.color);
        }
        return item;
      },
      ["all"]
    )
    .map((item) => {
      return `
      <button class="filter-btn" data-id="${item}">${item}</button>
      `;
    })
    .join(" ");

  filterBtnsContainer.innerHTML = colors;

  // filter products
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const color = data.filter((item) => item.color === id);

      filterBtns.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");

      if (id === "all") {
        products(data);
      } else {
        products(color);
      }
    })
  );
}

// products
function products(myData) {
  const productItems = myData
    .map((item, index) => {
      return `
      <article class="product">
        <div class="product-img-container">
          <img src="${item.img}" alt="${item.name}" />
        </div>
        <div class="product-content">
          <h2 class="title">${item.name}</h2>
          <p class="body-text">${item.desc}</p>
          <p class="price">$${item.price}</p>
          <button class="btn" onclick="addProduct(${index})">add to cart</button>
        </div>
      </article>`;
    })
    .join(" ");

  productsEl.innerHTML = productItems;
}

function addProduct(index) {
  console.log(index);
}
