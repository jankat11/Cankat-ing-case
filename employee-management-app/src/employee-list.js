import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import {
  renderEditIcon,
  renderDeleteIcon,
  renderTableIcon,
  renderListIcon,
  renderCloseIcon,
} from "./icons.js";
import "./pagination.js";
import { darkGrey, EMPLOYEES_PER_PAGE } from "./constants.js";
import { brandColor, brandColorLight, lightGrey } from "./constants.js";
import { initialEmployees } from "../initialData.js";
import { translate } from "./localization.js";

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    currentPage: { type: Number },
    searchTerm: { type: String },
    selectedView: { type: String },
    lang: { type: String },
    employeeIndex: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      max-width: 1280px;
      margin: 0 auto;
    }
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .header-left-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .employee-list-title {
      color: ${unsafeCSS(brandColor)};
      font-size: 20px;
      font-weight: 500;
    }
    .search-input {
      padding: 0.5rem;
      font-size: 14px;
      border: 1px solid #eee;
      border-radius: 4px;
      outline: none;
    }
    .view-toggle {
      display: flex;
      gap: 10px;
    }
    @media (max-width: 600px) {
      .header-container {
        flex-direction: column;
        align-items: flex-start;
      }
      .view-toggle {
        margin-top: 10px;
        align-self: end;
      }
    }
    .view-toggle button {
      border: none;
      outline: none;
      background-color: transparent;
      color: ${unsafeCSS(brandColorLight)};
      cursor: pointer;
    }
    .view-toggle button:disabled {
      color: ${unsafeCSS(brandColor)};
      cursor: pointer;
    }
    .employee-list-wrapper,
    .employee-table-wrapper {
      overflow-x: auto;
      width: 100%;
      background-color: #fff;
    }
    /* Liste stili */
    .employee-list {
      list-style: none;
      padding: 0;
      min-width: 800px;
    }
    .employee-item {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
      margin-bottom: 0.5rem;

      min-width: 1280px;
      position: relative;
      border-bottom: solid 1px;
      border-color: ${unsafeCSS(lightGrey)};
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
    .empty-list {
      color: ${unsafeCSS(brandColor)};
    }
    /* Tablo stili */
    .employee-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }
    .employee-table th,
    .employee-table td {
      border: 1px solid #ccc;
      padding: 1rem;
      text-align: center;
      font-size: 14px;
    }
    .employee-table th {
      background-color: ${unsafeCSS(brandColor)};
      color: #fff;
      font-weight: bold;
    }
    .search-input::placeholder {
      color: #aaa;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal {
      background: white;
      padding: 1rem;
      border-radius: 5px;
      width: 300px;
    }
    .modal h3 {
      margin-top: 0;
      font-weight: 500;
      color: ${unsafeCSS(brandColor)};
    }
    .modal p {
      font-size: 14px;
    }
    .modal p span {
      font-size: 14px;
      font-weight: 500;
    }
    .modal form {
      display: flex;
      flex-direction: column;
    }
    .modal label {
      margin: 0.5rem 0 0.2rem;
    }
    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
      flex-direction: column;
      gap: 0.5rem;
    }
    .modal-buttons button {
      padding: 6px 1rem;
      font-size: 13px;
      cursor: pointer;
      border-radius: 10px;
    }
    .modal-buttons .proceed {
      border: none;
      background-color: ${unsafeCSS(brandColor)};
      shadow: none !important;
      outline: none !important;
      color: #fff;
      padding: 8px 1rem;
    }
    .modal-title-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: ${unsafeCSS(brandColor)};
    }
    .modal-close-icon {
      cursor: pointer;
      position: relative;
      bottom: 5px;
    }
    .delete-icon-table {
      border: none;
      background-color: transparent;
      cursor: pointer;
    }
    .cancel {
      background-color: #fff;
      border: solid 1px #BDBDBD;
      outline: none;
      shadow:none;
      shadow-inline :none;
      color:  #444;
    }
  `;

  constructor() {
    super();
    this.employees =
      JSON.parse(localStorage.getItem("employees")) || initialEmployees;
    this.showModal = false;
    this.currentPage = 1;
    this.searchTerm = "";
    this.selectedView = localStorage.getItem("selectedView") || "list";
    this.lang =
      localStorage.getItem("language") || document.documentElement.lang || "en";
    this.employeeIndex = null;
  }

  connectedCallback() {
    super.connectedCallback();

    // document.documentElement'in lang attribute'undaki değişiklikleri dinlemek için MutationObserver kullanıyoruz
    this._langObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "lang"
        ) {
          this.lang = document.documentElement.lang || "en";
        }
      }
    });
    this._langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    window.addEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
  }

  disconnectedCallback() {
    if (this._langObserver) {
      this._langObserver.disconnect();
    }
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
    super.disconnectedCallback();
  }

  // Filtrelenmiş çalışanları döndüren getter
  get filteredEmployees() {
    if (!this.searchTerm.trim()) {
      return this.employees;
    }
    const term = this.searchTerm.toLowerCase();
    return this.employees.filter(
      (employee) =>
        employee.firstName.toLowerCase().includes(term) ||
        employee.lastName.toLowerCase().includes(term)
    );
  }

  // Toplam sayfa sayısı (her sayfada EMPLOYEES_PER_PAGE kayıt olacak)
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / EMPLOYEES_PER_PAGE);
  }

  // Geçerli sayfadaki çalışanları dilimleyip döndürür
  get paginatedEmployees() {
    const start = (this.currentPage - 1) * EMPLOYEES_PER_PAGE;
    const end = start + EMPLOYEES_PER_PAGE;
    return this.filteredEmployees.slice(start, end);
  }

  // Route değiştiğinde currentPage güncelleniyor
  _onLocationChanged = (e) => {
    const { pathname } = e.detail.location;
    const match = pathname.match(/^\/employees\/page\/(\d+)/);
    if (match) {
      const newPage = parseInt(match[1], 10);
      if (this.currentPage !== newPage) {
        this.currentPage = newPage;
      }
    }
  };

  onBeforeEnter(location) {
    if (!JSON.parse(localStorage.getItem("employees"))) {
      localStorage.setItem("employees", JSON.stringify(initialEmployees));
    }
    const { pageNumber } = location.params;
    this.currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    router.render(href).catch((err) => console.error("Routing error:", err));
    window.history.pushState({}, "", href);
  }

  deleteEmployee(e) {
    e.preventDefault();
    const employeeToDelete = this.paginatedEmployees[this.employeeIndex];
    this.employees = this.employees.filter(
      (employee) => employee.id !== employeeToDelete.id
    );
    localStorage.setItem("employees", JSON.stringify(this.employees));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.employeeIndex = null;
    this.closeModal();
  }

  formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  // Arama kutusu değişikliklerini işler
  handleSearch(e) {
    this.searchTerm = e.target.value;
    this.currentPage = 1;
  }

  // Görünüm modu değiştirir ("list" veya "table")
  changeView(mode) {
    this.selectedView = mode;
    localStorage.setItem("selectedView", mode);
  }

  openModal(index) {
    this.employeeIndex = index;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  render() {
    return html`
      <div class="header-container">
        <div class="header-left-content">
          <h1 class="employee-list-title">
            ${translate("employeeList", this.lang)}
          </h1>
          <input
            type="text"
            class="search-input"
            placeholder=${translate("search", this.lang)}
            .value=${this.searchTerm}
            @input=${this.handleSearch}
          />
        </div>
        <div class="view-toggle">
          <button
            @click=${() => this.changeView("list")}
            ?disabled=${this.selectedView === "list"}
          >
            ${renderTableIcon()}
          </button>
          <button
            @click=${() => this.changeView("table")}
            ?disabled=${this.selectedView === "table"}
          >
            ${renderListIcon()}
          </button>
        </div>
      </div>
      ${this.employees.length > 0
        ? html`
            ${this.selectedView === "list"
              ? html`
                  <div class="employee-list-wrapper">
                    <ul class="employee-list">
                      <li class="employee-item employee-header">
                        <div class="employee-name employee-header-name">
                          <span>${translate("firstName", this.lang)}</span>
                          <span>${translate("lastName", this.lang)}</span>
                        </div>
                        <div class="employee-data employee-header-data">
                          <div>
                            ${translate("dateOfEmployement", this.lang)}
                          </div>
                          <div>${translate("dateOfBirth", this.lang)}</div>
                          <div>${translate("phone", this.lang)}</div>
                          <div>${translate("email", this.lang)}</div>
                          <div>${translate("department", this.lang)}</div>
                          <div>${translate("position", this.lang)}</div>
                        </div>
                        <div class="employee-actions">
                          <div>${translate("actions", this.lang)}</div>
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
                              <div>
                                ${this.formatDate(employee.dateOfEmployement)}
                              </div>
                              <div>
                                ${this.formatDate(employee.dateOfBirth)}
                              </div>
                              <div>${employee.phone}</div>
                              <div>${employee.email}</div>
                              <div>${employee.department}</div>
                              <div>${employee.position}</div>
                            </div>
                            <div class="employee-actions">
                              <a
                                class="edit-icon"
                                href="/edit/${employee.id}"
                                @click=${this.navigate}
                              >
                                ${renderEditIcon()}
                              </a>
                              <button @click=${() => this.openModal(index)}>
                                ${renderDeleteIcon()}
                              </button>
                            </div>
                          </li>
                        `
                      )}
                    </ul>
                  </div>
                `
              : html`
                  <div class="employee-table-wrapper">
                    <table class="employee-table">
                      <thead>
                        <tr>
                          <th>${translate("firstName", this.lang)}</th>
                          <th>${translate("lastName", this.lang)}</th>
                          <th>${translate("dateOfEmployement", this.lang)}</th>
                          <th>${translate("dateOfBirth", this.lang)}</th>
                          <th>${translate("phone", this.lang)}</th>
                          <th>${translate("email", this.lang)}</th>
                          <th>${translate("department", this.lang)}</th>
                          <th>${translate("position", this.lang)}</th>
                          <th>${translate("actions", this.lang)}</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${this.paginatedEmployees.map(
                          (employee, index) => html`
                            <tr>
                              <td>${employee.firstName}</td>
                              <td>${employee.lastName}</td>
                              <td>
                                ${this.formatDate(employee.dateOfEmployement)}
                              </td>
                              <td>${this.formatDate(employee.dateOfBirth)}</td>
                              <td>${employee.phone}</td>
                              <td>${employee.email}</td>
                              <td>${employee.department}</td>
                              <td>${employee.position}</td>
                              <td>
                                <a
                                  class="edit-icon"
                                  href="/edit/${employee.id}"
                                  @click=${this.navigate}
                                >
                                  ${renderEditIcon()}
                                </a>
                                <button
                                  class="delete-icon-table"
                                  @click=${() => this.openModal(index)}
                                >
                                  ${renderDeleteIcon()}
                                </button>
                              </td>
                            </tr>
                          `
                        )}
                      </tbody>
                    </table>
                  </div>
                `}
          `
        : html`<div class="empty-list">no employees yet!</div>`}
      ${this.filteredEmployees.length > EMPLOYEES_PER_PAGE
        ? html`
            <employees-pagination
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              @page-change=${this.handlePageChange}
            ></employees-pagination>
          `
        : ""}
      ${this.showModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <div class="modal-title-container">
                  <h3 class="modal-title">
                    ${translate("confirmDelete", this.lang)}
                  </h3>
                  <div @click=${this.closeModal} class="modal-close-icon">
                    ${renderCloseIcon()}
                  </div>
                </div>
                <p class="modal-text">
                  ${translate("deleteInfoLeft", this.lang)}
                  <span>
                    ${this.paginatedEmployees[this.employeeIndex]
                      .firstName}${" "}
                    ${this.paginatedEmployees[this.employeeIndex].lastName}
                  </span>
                  ${translate("deleteInfoRight", this.lang)}
                </p>
                <form @submit=${this.deleteEmployee}>
                  <div class="modal-buttons">
                    <button class="proceed" type="submit">
                      ${translate("proceed", this.lang)}
                    </button>
                    <button
                      class="cancel"
                      type="button"
                      @click=${this.closeModal}
                    >
                      ${translate("cancel", this.lang)}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

customElements.define("employee-list", EmployeeList);
