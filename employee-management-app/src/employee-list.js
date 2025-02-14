import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { renderEditIcon, renderDeleteIcon } from "./icons.js";
import "./pagination.js";
import { EMPLOYEES_PER_PAGE } from "../constants.js";
import { brandColor } from "../constants.js";
import { initialEmployees } from "../initialData.js";

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    currentPage: { type: Number },
    searchTerm: { type: String },
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
    .employee-list-title {
      color: ${unsafeCSS(brandColor)};
      font-size: 20px;
      font-weight: 500;
    }
    .search-input {
      padding: 0.5rem;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 4px;
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
      padding: 0.5rem 0;
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
    .empty-list {
      color: ${unsafeCSS(brandColor)};
    }
  `;

  constructor() {
    super();
    this.employees =
      JSON.parse(localStorage.getItem("employees")) || initialEmployees;
    this.showModal = false;
    this.firstName = "";
    this.lastName = "";
    this.currentPage = 1;
    this.searchTerm = "";
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

  // Toplam sayfa sayısını hesapla (her sayfada EMPLOYEES_PER_PAGE eleman olacak)
  get totalPages() {
    return Math.ceil(this.filteredEmployees.length / EMPLOYEES_PER_PAGE);
  }

  // Geçerli sayfaya ait elemanları slice'la
  get paginatedEmployees() {
    const start = (this.currentPage - 1) * EMPLOYEES_PER_PAGE;
    const end = start + EMPLOYEES_PER_PAGE;
    return this.filteredEmployees.slice(start, end);
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

  // Silme işlemi: Tıklanan çalışanı id'si üzerinden siliyoruz
  deleteEmployee(index) {
    const employeeToDelete = this.paginatedEmployees[index];
    this.employees = this.employees.filter(
      (employee) => employee.id !== employeeToDelete.id
    );
    localStorage.setItem("employees", JSON.stringify(this.employees));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
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

  // Arama kutusundaki değişiklikleri handle eden metot
  handleSearch(e) {
    this.searchTerm = e.target.value;
    // Arama değiştiğinde sayfa numarasını 1'e sıfırla
    this.currentPage = 1;
  }

  render() {
    return html`
      <div class="header-container">
        <h1 class="employee-list-title">Employee List</h1>
        <input
          type="text"
          class="search-input"
          placeholder="Search by first or last name"
          .value=${this.searchTerm}
          @input=${this.handleSearch}
        />
      </div>
      ${this.employees.length > 0
        ? html`
            <div class="employee-list-wrapper">
              <ul class="employee-list">
                <li class="employee-item employee-header">
                  <div class="employee-name employee-header-name">
                    <span>first name</span>
                    <span>last name</span>
                  </div>
                  <div class="employee-data employee-header-data">
                    <div>Date of Employement</div>
                    <div>Date of Birth</div>
                    <div>Phone</div>
                    <div>Email</div>
                    <div>Department</div>
                    <div>Position</div>
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
                        <div>${this.formatDate(employee.dateOfEmployement)}</div>
                        <div>${this.formatDate(employee.dateOfBirth)}</div>
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
      ${this.filteredEmployees.length > EMPLOYEES_PER_PAGE
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

