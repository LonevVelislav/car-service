import { html } from "../node_modules/lit-html/lit-html.js";
import { api } from "./api.js";

export function renderAdminLogin(ctx, next) {
  const templete = html`<section></section>
    <main>
      <form action="#" class="add-service-form">
        <div class="service-form-element">
          <label for="username">username</label>
          <input type="text" name="username" id="username" />
        </div>
        <div class="service-form-element">
          <label for="password">password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div class="service-form-element">
          <input type="submit" value="login" />
        </div>
      </form>
    </main>
    <aside></aside>`;

  ctx.renderBody(templete);
}
