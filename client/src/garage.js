import { html } from "../node_modules/lit-html/lit-html.js";
import { request } from "./request.js";
import { api } from "./api.js";
import { formatDate, yearDifferenceCheck } from "./dateUtils.js";
import renderSpinner from "./renderSpinner.js";

export async function renderGarage(ctx, next) {
  const templete = html`<main></main>
    <aside>
      <p class="aside-text"></p>
    </aside>`;

  ctx.renderBody(templete);
}
