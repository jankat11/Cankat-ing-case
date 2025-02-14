import { LitElement, html, css } from "lit";
import router from "./router.js";
import { renderEditIcon, renderDeleteIcon } from "./icons.js";
import "./pagination.js"; 
import { EMPLOYEES_PER_PAGE } from "../constants.js";

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    currentPage: { type: Number },
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.showModal = false;
    this.firstName = "";
    this.lastName = "";
    this.currentPage = 1;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
    }
    .employee-list {
      list-style: none;
      padding: 0;
      margin: 1rem;
    }
    .employee-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
      background-color: #f9f9f9;
    }
    .employee-actions button {
      all: unset;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-left: 0.5rem;
    }
    .edit-icon {
      text-decoration: none;
      color: inherit;
      padding-top: 6px;
    }
  `;

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

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    router.render(href).catch((err) => console.error("Routing error:", err));
    window.history.pushState({}, "", href);
  }

  // Silme işlemi: Gerçek dizin hesabı yapılır
  deleteEmployee(index) {
    const realIndex = (this.currentPage - 1) * EMPLOYEES_PER_PAGE + index;
    this.employees = this.employees.filter((_, idx) => idx !== realIndex);
    localStorage.setItem("employees", JSON.stringify(this.employees));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  // Pagination bileşeninden gelecek sayfa değişim olayını dinler
  handlePageChange(e) {
    this.currentPage = e.detail.page;
  }

  render() {
    return html`
      <ul class="employee-list">
        ${this.paginatedEmployees.map(
          (employee, index) => html`
            <li class="employee-item">
              <span>${employee.firstName} ${employee.lastName}</span>
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

      <employees-pagination
        .currentPage=${this.currentPage}
        .totalPages=${this.totalPages}
        @page-change=${this.handlePageChange}
      ></employees-pagination>
    `;
  }
}

customElements.define("employee-list", EmployeeList);
