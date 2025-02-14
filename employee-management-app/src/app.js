import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { brandColor } from "../constants.js";

class EmployeeManagementApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      margin: 0 auto;
    }
    .navbar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      background-color: #fff;
      margin-bottom: 3rem;
    }
    nav {
      display: flex;
      justify-content: space-around;
      padding: 1rem;
      gap: 2rem;
    }
    a {
      color: ${unsafeCSS(brandColor)};
      text-decoration: none;
      font-weight: bold;
    }
  `;

  render() {
    return html`
      <div class="navbar">
        <img src="../assests/images/ING_logo.jpg" width="100" />
        <nav>
          <a href="/employees/page/1" @click="${this.navigate}">Employees</a>
          <a href="/add" @click="${this.navigate}">Add Employee</a>
        </nav>
      </div>
      <main id="outlet"></main>
    `;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    if (href && href !== window.location.pathname) {
      router.render(href).catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", href);
    }
  }
}

customElements.define("employee-management-app", EmployeeManagementApp);
