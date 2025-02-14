import { LitElement, html, css } from "lit";
import router from "./router.js";
import { renderEditIcon, renderDeleteIcon } from './icons.js';

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.showModal = false;
    this.firstName = "";
    this.lastName = "";
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
      padding-top: 6px
    }
  `;

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute("href");
    router.render(href).catch((err) => console.error("Routing error:", err));
    window.history.pushState({}, "", href);
  }

  deleteEmployee(index) {
    this.employees = this.employees.filter((_, idx) => idx !== index);
    localStorage.setItem("employees", JSON.stringify(this.employees));
  }


  render() {
    return html`
      <!-- Çalışan Listesi -->
      <ul class="employee-list">
        ${this.employees.map(
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
    `;
  }
}

customElements.define("employee-list", EmployeeList);
