/*************** navbar section ***************/
const header = document.querySelector("#header");

function showDropdownMenu() {
  dropdownList.classList.toggle("active");
}

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

const slides = [...document.querySelectorAll(".slide")];
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
if (auto && document.body.id === "index-page") {
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
const requstedURL =
  "https://raw.githubusercontent.com/Meqdad-Moradi/womensbest-chalange/main/data.json";

if (document.body.id === "catalog") {
  productsEl.innerHTML = "";
  filterBtnsContainer.innerHTML = "";
}

async function getProducts() {
  try {
    let result = await fetch(requstedURL);
    let data = await result.json();
    showProducts(data);
    showFilterBtns(data);
  } catch (error) {
    console.error(error);
  }
}

// filter btns
function showFilterBtns(data) {
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

  if (document.body.id === "catalog") {
    filterBtnsContainer.innerHTML = colors;
  }

  // filter products
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      const color = data.filter((item) => item.color === id);

      filterBtns.forEach((btn) => btn.classList.remove("active"));
      e.currentTarget.classList.add("active");

      if (id === "all") {
        showProducts(data);
      } else {
        showProducts(color);
      }
    })
  );
}

// display products
function showProducts(myData) {
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
          <button class="btn add-to-cart" data-id="${item.id}">add to cart</button>
        </div>
      </article>`;
    })
    .join(" ");

  if (document.body.id === "catalog") {
    productsEl.innerHTML = productItems;
  }

  const btns = document.querySelectorAll(".add-to-cart");
  btns.forEach((btn) =>
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;

      myData.forEach((item) => {
        if (item.id == id) {
          const productItem = { ...item, amount: 1 };
          cart.push(productItem);
          renderCartItems();
        }
      });
    })
  );
}

window.addEventListener("DOMContentLoaded", () => {
  getProducts();
});

// ************ cart section ************* //
const cartCloseBtn = document.querySelector(".cart-close-btn");
const cartOpenBtn = document.querySelector("#open-cart");
const cartEl = document.querySelector(".cart");
const cartBody = document.querySelector(".cart-body");
const cartTotal = document.querySelector(".total-price");
const cartCheckoutBtn = document.querySelector(".checkout-btn");
let cart = [];

cartOpenBtn.addEventListener("click", (e) => {
  cartEl.classList.add("active");
});

cartCloseBtn.addEventListener("click", (e) => {
  cartEl.classList.remove("active");
});

cartEl.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) return;
  cartEl.classList.remove("active");
});

// render cart items
function renderCartItems() {
  let totalPrice = 0;
  if (cart.length === 0) {
    const p = document.createElement("p");
    p.className = "cart-info";
    p.textContent = "your cart is empty";
    cartBody.appendChild(p);
  } else {
    const cartInfo = cartBody.querySelector(".cart-info");
    cartInfo.style.display = "none";

    // count the items price
    cart.forEach((item) => {
      totalPrice += item.price;
    });

    // manipulate the cart inner HTML to show items in cart
    cartBody.innerHTML += `
            <article class="cart-row">
              <div class="cart-img-container">
                <img src=${cart[cart.length - 1].img} alt=${
      cart[cart.length - 1].name
    }/>
              </div>
  
              <div class="cart-text">
                <h3 class="sub-title">${cart[cart.length - 1].name}</h3>
                <p class="item-price">$${cart[cart.length - 1].price}</p>
                <button class="remove-item-btn">remove</button>
              </div>
  
              <div class="quantity-container">
                <span class="quantity-btn up"
                  ><i class="fas fa-angle-up"></i
                ></span>
                <span class="quantity-btn quantity">${
                  cart[cart.length - 1].amount
                }</span>
                <span class="quantity-btn down"
                  ><i class="fas fa-angle-down"></i
                ></span>
              </div>
            </article>
        `;
  }
  cartTotal.textContent = `$${parseFloat(totalPrice.toFixed(2))}`;
}

renderCartItems();
