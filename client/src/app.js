import { render, html } from "../node_modules/lit-html/lit-html.js";
import page from "../node_modules/page/page.mjs";
import { api } from "./api.js";
import renderSpinner from "./renderSpinner.js";
import { request } from "./request.js";

import { renderSelect } from "./select.js";
import { renderLogin } from "./login.js";
import { renderRegister } from "./register.js";
import { renderAdminLogin } from "./adminLogin.js";
import { renderCar } from "./car.js";
import { renderGarage } from "./garage.js";

const menu = document.querySelector(".menu");
const section = document.querySelector("section");
const body = document.querySelector("body");
const nav = document.querySelector("nav");

page("index.html", "/");
page(renderTempletes);
page(renderNavBody);
page(renderFormMenu);
page(renderSectionMenu);

page("/", renderSelect);
page("/login", renderLogin);
page("/register", renderRegister);
page("/admin_login", renderAdminLogin);
page("/car", renderCar);
page("/garage", renderGarage);

page.start();

function renderTempletes(ctx, next) {
  ctx.renderNav = (templete) => render(templete, nav);
  ctx.renderMenu = (templete) => render(templete, menu);
  ctx.renderSection = (templete) => render(templete, section);
  ctx.renderBody = (templete) => render(templete, body);
  next();
}

function renderNavBody(ctx, next) {
  const templete = html`<a
    href=${sessionStorage["admin"] ? "/garage" : "/"}
    class="logo-box"
  >
    <img class="logo" src="./img/logo1.png" alt="logo" />
  </a>`;

  ctx.renderNav(templete);

  next();
}

function renderFormMenu(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const car = JSON.parse(sessionStorage.getItem("car"));

  const templete = html`${car
    ? html`<form @submit=${onUpdate}  class="menu-form">
        <a href="/car" class="menu-form-element">
          <ion-icon name="car-outline"></ion-icon>
          <span>${car.number}</span>
        </a>
        <div class="menu-form-element">
          <label for="km">km</label>
          <input
            type="number"
            name="km"
            id="km"
            value="${car.km ? Number(car.km) : null}"
          />
        </div>
        <div class="menu-form-element">
          <label for="model">model</label>
          <input
            type="text"
            name="model"
            id="model"
            value="${car.model ? car.model : ""}"
          />
        </div>

        <div class="menu-form-element">
          <label for="engine">engine</label>
          <input
            type="text"
            name="engine"
            id="engine"
            value="${car.engine ? car.engine : ""}"
          />
        </div>
        <a href="/login" class="exit">
            <ion-icon name="exit-outline"></ion-icon>
        </a>
        <div class="hidden"><input type="submit" value="edit"></input></div>
      </form>
      <form @submit=${onSearchSubmit} class="menu-form">
      <div class="menu-form-element">
      <ion-icon name="search-outline"></ion-icon>
      <input
      type="text"
      name="search"
      id="search"
      placeholder="service type"
      />
      </div>
      </form>
      `
    : html`<form class="menu-form">
        <div class="menu-form-element">
          <ion-icon name="search-outline"></ion-icon>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search car"
          />
        </div>
        <div class="hidden"><input type="submit" value="edit"></input></div>
      </form>`}`;

  async function onUpdate(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const km = formData.get("km");
    const engine = formData.get("engine");
    const model = formData.get("model");

    if (km || engine || model) {
      renderSpinner();
      await fetch(api + `/cars/${car._id}`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          km,
          engine,
          model,
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.status === "success") {
            renderSpinner();
            document.getElementById("km").value = res.data.updatedCar.km;
            sessionStorage.setItem("car", JSON.stringify(res.data.updatedCar));
            ctx.page.redirect("/car");
          } else {
            throw new Error(res.message);
          }
        })
        .catch((err) => {
          swal(err.message, {
            buttons: false,
            timer: 3000,
            className: "error-box",
          });
        });
    }
  }

  function onSearchSubmit(e) {
    e.preventDefault();

    ctx.page.redirect("/car");
  }

  ctx.renderMenu(templete);

  next();
}

async function renderSectionMenu(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const car = JSON.parse(sessionStorage.getItem("car"));
  const admin = JSON.parse(sessionStorage.getItem("admin"));
  let templete = "";

  if (car) {
    templete = html`<span class="sub-heading">Notifications</span>
      ${Object.keys(car.intervals).map((el) => {
        if (el !== "_id" && el !== "__v") {
          return html`<a @click=${onNotificationClick} class=${
            car.intervals[el] ? "notification-box filled" : "notification-box"
          }>
      <img
      class="notification-icon unclick"
      src="./img/icons/${el}-icon.png"
      alt="${el}-icon"
      />
      <ion-icon class="unclick" name="arrow-down-outline"></ion-icon>
      <div class="hidden-box">
      <form @submit=${onIntervalFormSubmit} id=${
            car.intervals._id
          } class="interval-input">
      <input
            type=number
            placeholder=${
              el === "MOT" ||
              el === "tax" ||
              el === "roadtax" ||
              el === "insurance"
                ? `${el} months`
                : `${el} intervals`
            }
            name=${el}
            value=${car.intervals[el]}
            /><button>
            <ion-icon name="add-outline"></ion-icon>
            </button>
        </form>
      </div>
      </a>
      </div>`;
        }
      })}`;
  }

  if (admin) {
    const res = await request(`${api}/calls`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const calls = res.data.calls;
    const pending = calls.filter((call) => call.status === "pending");
    templete = html`<span class="sub-heading">Calls</span>
      ${pending.map(
        (call) => html`<a
          @click=${onPendingCallClick}
          class="notification-box call"
          id=${call._id}
        >
          <img
            class="notification-icon unclick"
            src="./img/icons/${call.service}-icon.png"
            alt="${call.service}-icon"
          />

          <ion-icon class="unclick" name="car-outline"></ion-icon>
          <span class="unclick">${call.car.number}</span>

          <ion-icon
            class="unclick pending"
            name="caret-forward-outline"
          ></ion-icon>
        </a>`
      )} `;
  }

  ctx.renderSection(templete);

  next();

  async function onIntervalFormSubmit(e) {
    renderSpinner();
    e.preventDefault();
    const intervalId = e.target.id;
    const value = e.target.querySelector("input").value;
    const name = e.target.querySelector("input").name;
    const obj = {};

    obj[name] = Number(value);

    await fetch(api + `/intervals/${intervalId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(obj),
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === "success") {
          renderSpinner();
          sessionStorage.setItem("car", JSON.stringify(res.data.car));
          ctx.page.redirect("/car");
        } else {
          throw new Error(res.message);
        }
      })
      .catch((err) => {
        swal(err.message, {
          buttons: false,
          timer: 3000,
          className: "error-box",
        });
      });
  }

  async function onPendingCallClick(e) {
    renderSpinner();
    await fetch(`${api}/calls/${e.target.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "active" }),
    })
      .then((data) => data.json())
      .then((res) => {
        if (res.status === "success") {
          ctx.page.redirect("/garage");
        }

        renderSpinner();
      })
      .catch((err) => {
        swal(err.message, {
          buttons: false,
          timer: 3000,
          className: "error-box",
        });
      });
  }

  function onNotificationClick(e) {
    if (e.target.classList.contains("notification-box")) {
      if (e.target.classList.contains("open")) {
        e.target.classList.remove("open");
      } else {
        closeAllNotifications();
        e.target.classList.add("open");
      }
    }
  }

  function closeAllNotifications() {
    document
      .querySelectorAll(".notification-box")
      .forEach((el) => el.classList.remove("open"));
  }
}
