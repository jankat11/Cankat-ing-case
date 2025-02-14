import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { brandColor } from "../constants.js";
import { renderPeopleIcon, renderPlusIcon } from "./icons.js";

class EmployeeManagementApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      margin: 0 auto;
    }
    .navbar {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      margin-bottom: 2rem;
    }
    .navbar-content {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-size: 14px;
    }
    nav {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0rem;
      gap: 1rem;
    }
    a {
      color: ${unsafeCSS(brandColor)};
      text-decoration: none;
      font-weight: 400;
      letter-spacing: 0.6px;
    }
    nav a {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    @media (min-width: 1280px) {
      .navbar-content {
        width: 1280px;
        font-size: 16px;
      }
      nav {
        gap: 2rem;
      }
      nav a {
        gap: 6px;
      }
    }
  `;

  render() {
    return html`
      <div class="navbar">
        <div class="navbar-content">
          <img src="../assests/images/ING_logo.jpg" width="100" />
          <nav>
            <a href="/employees/page/1" @click="${this.navigate}"
              >${renderPeopleIcon()} <span>Employees</span></a
            >
            <a href="/add" @click="${this.navigate}"
              >${renderPlusIcon()} <span>Add New</span></a
            >
          </nav>
        </div>
      </div>
      <main id="outlet"></main>
    `;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.currentTarget.getAttribute("href");
    if (href && href !== window.location.pathname) {
      router.render(href).catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", href);
    }
  }
}



[{"firstName":"ismail","lastName":"şahin","id":1739562750919,"dateOfEmployement":"2024-10-06","dateOfBirth":"2017-02-14","phone":"+905000000000","email":"ismail@gmail.com","department":"human resources","position":"senior"},{"firstName":"alihan","lastName":"yıldız","id":1739562665755,"dateOfEmployement":"2025-02-26","dateOfBirth":"2025-02-15","phone":"+905000000000","email":"ali@gmail.com","department":"analitics","position":"junior"}]

customElements.define("employee-management-app", EmployeeManagementApp);
