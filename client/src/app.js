import { render, html } from "../node_modules/lit-html/lit-html.js";
import page from "../node_modules/page/page.mjs";
import { api } from "./api.js";

import { renderSelect } from "./select.js";
import { renderLogin } from "./login.js";
import { renderRegister } from "./register.js";
import { renderAdminLogin } from "./adminLogin.js";
import { renderCar } from "./car.js";

const menu = document.querySelector(".menu");
const body = document.querySelector("body");

page("index.html", "/");
page(renderTempletes);
page(renderFormMenu);

page("/", renderSelect);
page("/login", renderLogin);
page("/register", renderRegister);
page("/admin_login", renderAdminLogin);
page("/car", renderCar);

page.start();

function renderTempletes(ctx, next) {
  ctx.renderMenu = (templete) => render(templete, menu);
  ctx.renderBody = (templete) => render(templete, body);
  next();
}

function renderFormMenu(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const id = sessionStorage.getItem("_id");
  const number = sessionStorage.getItem("number");
  const engine = sessionStorage.getItem("engine");
  const km = sessionStorage.getItem("km");
  const model = sessionStorage.getItem("model");

  const templete = html`${accessToken
    ? html`<form @submit=${onUpdate} class="menu-form">
        <a href="/car" class="menu-form-element">
          <ion-icon name="car-outline"></ion-icon>
          <span>${number}</span>
        </a>
        <div class="menu-form-element">
          <label for="km">km</label>
          <input
            type="text"
            name="km"
            id="km"
            value="${km === "undefined" ? "" : km}"
          />
        </div>
        <div class="menu-form-element">
          <label for="model">model</label>
          <input
            type="text"
            name="model"
            id="model"
            value="${model === "undefined" ? "" : model}"
          />
        </div>

        <div class="menu-form-element">
          <label for="engine">engine</label>
          <input
            type="text"
            name="engine"
            id="engine"
            value="${engine === "undefined" ? "" : engine}"
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
      await fetch(api + `/cars/${id}`, {
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
            sessionStorage.setItem("model", res.data.updatedCar.model);
            sessionStorage.setItem("km", res.data.updatedCar.km);
            sessionStorage.setItem("engine", res.data.updatedCar.engine);
            ctx.page.redirect("/car");
          } else {
            throw new Error(res.message);
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }
  }

  ctx.renderMenu(templete);

  next();
}
