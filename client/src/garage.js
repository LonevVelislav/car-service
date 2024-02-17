import { html } from "../node_modules/lit-html/lit-html.js";
import { request } from "./request.js";
import { api } from "./api.js";
import { formatDate, yearDifferenceCheck } from "./dateUtils.js";
import renderSpinner from "./renderSpinner.js";

export async function renderGarage(ctx, next) {
  const accessToken = sessionStorage.getItem("accessToken");

  const res = await request(`${api}/calls`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const calls = res.data.calls;
  const active = calls.filter((call) => call.status === "active");

  const templete = html`<main>
    ${active.map(
      (call) => html`
        <a id=${call.car._id} @click=${onCarClick} class="service">
          <div class="call-car-stats unclick">
            <span>${call.car.number}</span>
            <ion-icon name="car-outline"></ion-icon>
          </div>
          <div class="service-text">
            <p>started: <span class="strong">12:00</span></p>
          </div>
          <img
            class="service-icon"
            src="./img/icons/${call.service}-icon.png"
            alt="${call.service}-icon"
          />
          <button class="call-remove-btn">end service</button>
        </a>
      `
    )}
  </main>`;

  ctx.renderBody(templete);

  async function onCarClick(e) {
    const res = await request(`${api}/cars/${e.target.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(res);
    if (res.status === "success") {
      sessionStorage.setItem("_id", res.data.car._id);
      sessionStorage.setItem("car", JSON.stringify(res.data.car));
      ctx.page.redirect("/car");
    }
  }
}
