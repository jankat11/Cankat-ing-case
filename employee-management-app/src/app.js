import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { brandColor } from "./constants.js";
import { renderPeopleIcon, renderPlusIcon } from "./icons.js";
import { translate } from "./localization.js";

class EmployeeManagementApp extends LitElement {
  static properties = {
    lang: { type: String },
  };

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
      align-items: center;
      padding: 1rem 0;
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
    select {
      font-size: 14px;
      padding: 0.2rem;
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

  constructor() {
    super();
    this.lang =
      localStorage.getItem("language") || document.documentElement.lang || "en";
    document.documentElement.lang = this.lang;
  }

  render() {
    return html`
      <div class="navbar">
        <div class="navbar-content">
          <img src="../assests/images/ING_logo.jpg" width="100" />
          <nav>
            <a href="/employees/page/1" @click="${this.navigate}">
              ${renderPeopleIcon()}
              <span>${translate("employees", this.lang)}</span>
            </a>
            <a href="/add" @click="${this.navigate}">
              ${renderPlusIcon()}
              <span>${translate("addNew", this.lang)}</span>
            </a>
            <!-- Dil seçimi dropdown'ı -->
            <select @change="${this.changeLanguage}">
              <option value="en" ?selected=${this.lang === "en"}>en</option>
              <option value="tr" ?selected=${this.lang === "tr"}>tr</option>
            </select>
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

  changeLanguage(event) {
    const selectedLang = event.target.value;
    this.lang = selectedLang;
    localStorage.setItem("language", selectedLang);
    document.documentElement.lang = selectedLang;
  }
}

customElements.define("employee-management-app", EmployeeManagementApp);
