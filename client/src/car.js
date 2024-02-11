import { html } from "../node_modules/lit-html/lit-html.js";
import { request } from "./request.js";
import { api } from "./api.js";

export async function renderCar(ctx, next) {
  const carId = sessionStorage.getItem("_id");

  const res = await request(
    `${api}/service/car/${carId}?fields=-parts,-info,-car,-__v,&page=1&limit=10`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    }
  );

  const services = res.data.services;

  const templete = html`<section></section>
    <main>
      <a @click=${onAddServiceClick} class="add-service-btn">
      <ion-icon name="construct-outline"></ion-icon>
        <span class="unclick sub-heading">Add service</span>
        <ion-icon class="unclick  icon-service"  name="arrow-down-outline"></ion-icon>
        <ion-icon class="unclick  icon-service" name="close-outline"></ion-icon>
        <div class="hidden-box">
          <form @submit=${onCreate} class="add-service-form">
            <div class="service-form-element">
            <ion-icon name="archive-outline"></ion-icon>
              <label for="type">type</label>
              <select id="type" name="type">
                <option>repairs</option>
                <option>oil</option>
                <option>battery</option>
                <option>brakes</option>
                <option>cambelts</option>
                <option>clutches</option>
                <option>engine</option>
                <option>tyres</option>
                <option>chassie</option>
                <option>diagnostics</option>
                <option>cooling</option>
                <option>exhaust</option>
                <option>gearbox</option>
                <option>steering</option>
                <option>suspension</option>
                <option>MOT</option>
                <option>roadtax</option>
                <option>tax</option>
                <option value="insurance">autocasco/insurance</option>
              </select>
            </div>
            <div class="service-form-element">
            <ion-icon name="speedometer-outline"></ion-icon>
              <label for="km">km</label>
              <input type="number" id="km" name="km"></input>
            </div>
            <div class="service-form-element">
            <ion-icon name="calendar-outline"></ion-icon>
              <label for="date">date</label>
              <input type="date" id="date" name="date"></input>
            </div>

            <div class="service-form-element">
                <textarea placeholder="service info" name="info"
                id="info"
                cols="50"
                rows="10"></textarea>
            </div>

            <div class="service-form-element">
            <input type="submit" value="Add"></input>
        </div>
          </form>
        </div>
      </a>
      ${services ? services.map((service) => serviceTemplete(service)) : ""}
    </main>
    <aside>
      <p class="aside-text"></p>
    </aside>`;

  ctx.renderBody(templete);

  document.addEventListener("click", async (e) => {
    try {
      if (
        e.target.nodeName === "BUTTON" &&
        e.target.classList.contains("service-delete")
      ) {
        const serviceId = e.target.id;
        const res = await fetch(`${api}/service/${serviceId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        });

        if (res.ok) {
          ctx.page.redirect("/car");
        } else {
          throw new Error("Unauthorized!");
        }
      }
    } catch (err) {
      alert(err.message);
    }
  });

  async function onCreate(e) {
    e.preventDefault();
    document.querySelector(".add-service-btn").classList.remove("open");
    const carId = sessionStorage.getItem("_id");

    const formData = new FormData(e.target);
    const type = formData.get("type");
    const km = formData.get("km");
    const createdAt = formData.get("date");
    const info = document.getElementById("info").value;

    try {
      if (type) {
        const inputBody = createdAt
          ? { type, km, createdAt, info }
          : {
              type,
              km,
              info,
            };

        const res = await request(`${api}/service/${carId}`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(inputBody),
        });
        if (res.status === "success") {
          ctx.page.redirect(`/car`);
        } else {
          throw new Error(res.message);
        }
        e.target.reset();
      } else {
        throw new Error("Missing fields!");
      }
    } catch (err) {
      alert(err.message);
    }
  }
}

const serviceTemplete = (service) => html`<a
  @click=${onServiceClick}
  id=${service._id}
  class="service"
>
  <img
    class="service-icon"
    src="./img/icons/${service.type}-icon.png"
    alt="${service.type}-icon"
  />
  <div class="service-text">
    <p>date: <span class="strong">${formatDate(service.createdAt)}</span></p>
    <p>
      ${service.km ? html`km: <span class="strong">${service.km}</span>` : ""}
    </p>
  </div>
  <ion-icon class="icon-service" name="arrow-down-outline"></ion-icon>
  <ion-icon class="icon-service" name="close-outline"></ion-icon>
  <div class="hidden-box">
    <ul>
      <li>
        <button @click=${addPartClick} id=${service._id}>
          <ion-icon name="add-outline"></ion-icon>
        </button>
        <input type="text" placeholder="add mechanical part" />
      </li>
    </ul>
    <div class="flex-end">
      <button id=${service._id} class="service-delete">
        <ion-icon name="trash-outline"></ion-icon>
      </button>
    </div>
  </div>
</a>`;

function onAddServiceClick(e) {
  if (e.target.classList.contains("add-service-btn")) {
    closeAllServices();
    if (e.target.classList.contains("open")) {
      e.target.classList.remove("open");
    } else {
      e.target.classList.add("open");
    }
  }
}

async function onServiceClick(e) {
  const serviceId = e.target.id;
  const asideText = document.querySelector(".aside-text");
  const hiddenBoxList = e.target.querySelector(".hidden-box ul");
  closeServiceForm();

  if (e.target.tagName === "A") {
    if (e.target.classList.contains("open")) {
      e.target.classList.remove("open");
      asideText.textContent = "";
    } else {
      closeAllServices();
      e.target.classList.add("open");

      const res = await request(`${api}/service/${serviceId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      });
      if (res.status === "success") {
        asideText.textContent = res.data.service.info;
        if (res.data.service.parts.length > 0) {
          const listArray = Array.from(hiddenBoxList.children);
          for (let i = 0; i < listArray.length - 1; i++) {
            hiddenBoxList.removeChild(listArray[i]);
          }
          res.data.service.parts.map((el) => {
            const li = document.createElement("li");
            li.innerHTML = `<ion-icon name="build-outline"></ion-icon>mechanical part:
            <span class="strong">${el}</span>`;

            hiddenBoxList.insertAdjacentElement("afterbegin", li);
          });
        }
      }
    }
  }
}

async function addPartClick(e) {
  const hiddenBoxList = e.target.parentElement.parentElement;
  const serviceId = e.target.id;
  const partInput = hiddenBoxList.querySelector("li input");
  if (partInput.value) {
    const res = await request(`${api}/service/${serviceId}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        part: partInput.value,
      }),
    });
    if (res.status === "success") {
      const li = document.createElement("li");
      li.style.visibility = "hidden";
      li.classList.add("service-part");
      li.classList.add("slider");
      li.innerHTML = `<ion-icon name="build-outline"></ion-icon>mechanical part:
            <span class="strong">${partInput.value}</span>`;

      hiddenBoxList.insertAdjacentElement("afterbegin", li);

      setTimeout(() => {
        li.classList.remove("slider");
      }, 100);
      setTimeout(() => {
        li.style.visibility = "visible";
      }, 200);
    }
    partInput.value = "";
  }
}

function formatDate(date) {
  const input = new Date(date);
  const year = input.getFullYear();
  const month = input.getMonth() + 1;
  const day = input.getDate();

  const formatted = `${day.toString().padStart(2, "0")}-${month
    .toString()
    .padStart(2, "0")}-${year}`;

  return formatted;
}

function closeServiceForm() {
  document.querySelector(".add-service-btn").classList.remove("open");
}

function closeAllServices() {
  document
    .querySelectorAll(".service")
    .forEach((el) => el.classList.remove("open"));
}
