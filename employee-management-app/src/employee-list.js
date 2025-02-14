import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { renderEditIcon, renderDeleteIcon } from "./icons.js";
import "./pagination.js";
import { EMPLOYEES_PER_PAGE } from "../constants.js";
import { brandColor } from "../constants.js";

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    currentPage: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      max-width: 1280px;
      margin: 0 auto;
    }

    .employee-list-wrapper {
      overflow-x: auto;
      width: 100%;
      background-color: #fff;
    }

    .employee-list {
      list-style: none;
      padding: 0;
      min-width: 800px;
    }

    .employee-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 0rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      min-width: 1280px;
      position: relative;
    }

    .employee-name {
      position: sticky;
      left: 0;
      padding: 0.5rem 1rem;
      font-weight: 500;
      min-width: 150px;
      z-index: 2;
      background-color: #fff;
      font-size: 14px;

      display: flex;
      justify-content: space-around;
    }

    .employee-data {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      min-width: 600px;
      padding-right: 2rem;
      font-size: 14px;
    }

    .employee-actions {
      position: sticky;
      right: 0;
      background: #fff;
      padding: 0.5rem;
      z-index: 2;
      display: flex;
      gap: 0.5rem;
      min-width: 3.2rem;
    }

    .employee-actions button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .edit-icon {
      text-decoration: none;
      color: inherit;
      padding-top: 6px;
    }

    .employee-data div {
      flex: 1;
      text-align: center;
    }
    .employee-header,
    .employee-header-data,
    .employee-header-name {
      background-color: white;
      color: ${unsafeCSS(brandColor)};
      font-size: small !important;
    }
    .employee-list-title {
      color: ${unsafeCSS(brandColor)};
      font-size: 20px;
      font-weight: 500;
      padding-bottom: 16px;
    }
    .empty-list {
      color: ${unsafeCSS(brandColor)};
    }
  `;

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.showModal = false;
    this.firstName = "";
    this.lastName = "";
    this.currentPage = 1;
  }

  // Toplam sayfa sayısını hesapla (her sayfada 5 eleman olacak)
  get totalPages() {
    return Math.ceil(this.employees.length / EMPLOYEES_PER_PAGE);
  }

  // Geçerli sayfaya ait elemanları slice'la
  get paginatedEmployees() {
    const start = (this.currentPage - 1) * EMPLOYEES_PER_PAGE;
    const end = start + EMPLOYEES_PER_PAGE;
    return this.employees.slice(start, end);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
  }

  disconnectedCallback() {
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
    super.disconnectedCallback();
  }

  // Route değiştiğinde yeni URL'i kontrol edip currentPage'i güncelleyen metot
  _onLocationChanged = (e) => {
    const { pathname } = e.detail.location;
    // Örneğin, /employees/page/3 şeklinde bir URL varsa:
    const match = pathname.match(/^\/employees\/page\/(\d+)/);
    if (match) {
      const newPage = parseInt(match[1], 10);
      if (this.currentPage !== newPage) {
        this.currentPage = newPage;
      }
    }
  };

  onBeforeEnter(location) {
    const { pageNumber } = location.params;
    this.currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    router.render(href).catch((err) => console.error("Routing error:", err));
    window.history.pushState({}, "", href);
  }

  deleteEmployee(index) {
    const realIndex = (this.currentPage - 1) * EMPLOYEES_PER_PAGE + index;
    this.employees = this.employees.filter((_, idx) => idx !== realIndex);
    localStorage.setItem("employees", JSON.stringify(this.employees));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  render() {
    return html`
      <h1 class="employee-list-title">Employee List</h1>
      ${this.employees.length > 0
        ? html`
            <div class="employee-list-wrapper">
              <ul class="employee-list">
                <li class="employee-item employee-header">
                  <div class="employee-name employee-header-name">
                    <span> ${"first name"}</span> <span>${"last name"} </span>
                  </div>
                  <div class="employee-data employee-header-data">
                    <div>${"Date of Employement"}</div>
                    <div>${"Date of Birth"}</div>
                    <div>${"Phone"}</div>
                    <div>${"Email"}</div>
                    <div>${"Department"}</div>
                    <div>${"Position"}</div>
                  </div>
                  <div class="employee-actions">
                    <div>actions</div>
                  </div>
                </li>
                ${this.paginatedEmployees.map(
                  (employee, index) => html`
                    <li class="employee-item">
                      <div class="employee-name">
                        <span>${employee.firstName}</span>
                        <span>${employee.lastName}</span>
                      </div>

                      <div class="employee-data">
                        <div>${"23/03/1987"}</div>
                        <div>${employee.dateOfBirth}</div>
                        <div>${employee.phone}</div>
                        <div>${employee.email}</div>
                        <div>${employee.department}</div>
                        <div>${employee.position}</div>
                      </div>
                      <div class="employee-actions">
                        <a
                          class="edit-icon"
                          href="/edit/${employee.id}"
                          @click="${this.navigate}"
                        >
                          ${renderEditIcon()}
                        </a>
                        <button @click=${() => this.deleteEmployee(index)}>
                          ${renderDeleteIcon()}
                        </button>
                      </div>
                    </li>
                  `
                )}
              </ul>
            </div>
          `
        : html`<div class="empty-list">no employees yet!</div>`}
      ${this.employees.length > EMPLOYEES_PER_PAGE
        ? html`
            <employees-pagination
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              @page-change=${this.handlePageChange}
            ></employees-pagination>
          `
        : ""}
    `;
  }
}

customElements.define("employee-list", EmployeeList);
