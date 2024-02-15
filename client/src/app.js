import { render, html } from "../node_modules/lit-html/lit-html.js";
import page from "../node_modules/page/page.mjs";
import { api } from "./api.js";

import { renderSelect } from "./select.js";
import { renderLogin } from "./login.js";
import { renderRegister } from "./register.js";
import { renderAdminLogin } from "./adminLogin.js";
import { renderCar } from "./car.js";

const menu = document.querySelector(".menu");
const section = document.querySelector("section");
const body = document.querySelector("body");

page("index.html", "/");
page(renderTempletes);
page(renderFormMenu);
page(renderSectionMenu);

page("/", renderSelect);
page("/login", renderLogin);
page("/register", renderRegister);
page("/admin_login", renderAdminLogin);
page("/car", renderCar);

page.start();

function renderTempletes(ctx, next) {
  ctx.renderMenu = (templete) => render(templete, menu);
  ctx.renderSection = (templete) => render(templete, section);
  ctx.renderBody = (templete) => render(templete, body);
  next();
}

function renderFormMenu(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const car = JSON.parse(sessionStorage.getItem("car"));

  const templete = html`${accessToken
    ? html`<form @submit=${onUpdate} class="menu-form">
        <a href="/car" class="menu-form-element">
          <ion-icon name="car-outline"></ion-icon>
          <span>${car.number}</span>
        </a>
        <div class="menu-form-element">
          <label for="km">km</label>
          <input
            type="text"
            name="km"
            id="km"
            value="${car.km ? car.km : ""}"
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
      </form>`
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
      </form>`}`;

  async function onUpdate(e) {
    e.preventDefault();
    const formDate = new FormData(e.target);

    const km = formDate.get("km");
    const engine = formDate.get("engine");
    const model = formDate.get("model");

    if (km || engine || model) {
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

  ctx.renderMenu(templete);

  next();
}

function renderSectionMenu(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const car = JSON.parse(sessionStorage.getItem("car"));

  const templete = html`${accessToken
    ? html`<span class="sub-heading">Notifications</span>
        ${Object.keys(car.intervals).map(
          (el) =>
            html`<a @click=${onNotificationClick} class="notification-box">
      <img
        class="notification-icon unclick"
        src="./img/icons/${el}-icon.png"
        alt="${el}-icon"
      />
      <ion-icon class="unclick" name="arrow-down-outline"></ion-icon>
      <div class="hidden-box">
        <div class="interval-input">
          <input
            type="text"
            placeholder="set interval"
            value=${car.intervals[el] ? car.intervals[el] : ""}
          /><button>
            <ion-icon name="add-outline"></ion-icon>
          </button>
        </div>
      </div>
      </a>
    </div>`
        )} `
    : html``}`;

  ctx.renderSection(templete);

  next();

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
