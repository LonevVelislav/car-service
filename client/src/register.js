import { html } from "../node_modules/lit-html/lit-html.js";
import { api } from "./api.js";
import renderSpinner from "./renderSpinner.js";

export function renderRegister(ctx, next) {
  sessionStorage.clear();
  const templete = html`<main>
      <form @submit=${onRegister} class="add-service-form">
        <span class="service-heading sub-heading"
          ><ion-icon name="newspaper-outline"></ion-icon>register</span
        >
        <div class="service-form-element">
          <label for="number">car number</label>
          <input type="text" name="number" id="number" />
        </div>
        <div class="service-form-element">
          <label for="pin">pin code</label>
          <input type="password" name="pin" id="pin" />
        </div>
        <div class="service-form-element">
          <input type="submit" value="Register" />
        </div>
        <a href="/login" class="select-link"
          >Select Car<ion-icon name="arrow-forward-outline"></ion-icon
        ></a>
      </form>
    </main>
    <aside>
      <p class="aside-text"></p>
    </aside>`;

  async function onRegister(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const number = formData.get("number");
    const pin = formData.get("pin");

    if (number && pin) {
      renderSpinner();
      await fetch(api + "/cars/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          number,
          pin,
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          if (res.status === "success") {
            sessionStorage.setItem("accessToken", res.token);
            sessionStorage.setItem("_id", res.data.user._id);
            sessionStorage.setItem("car", JSON.stringify(res.data.user));

            ctx.page.redirect(`/car`);
            renderSpinner();
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

  ctx.renderBody(templete);
}
