import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { EMPLOYEES_PER_PAGE } from "../constants.js";
import { brandColor } from "../constants.js";

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    editingIndex: { type: Number },
    id: { type: String },
    isEdit: { type: Boolean },
    showModal: { type: Boolean },
  };

  constructor() {
    super();
    this.employee = {};
    this.isEdit = false;
    this.id = null;
    this.showModal = false;
  }

  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      max-width: 1280px;
      margin: 0 auto;
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
    }
    .modal {
      background: white;
      padding: 1rem;
      border-radius: 5px;
      width: 300px;
    }
    .modal h2 {
      margin-top: 0;
    }
    .modal form {
      display: flex;
      flex-direction: column;
    }
    .modal label {
      margin: 0.5rem 0 0.2rem;
    }
    input {
      padding: 0.5rem;
      font-size: 1rem;
    }
    .modal-buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    .modal-buttons button {
      margin-left: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
    }
    .submit {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      color: white;
      background-color: ${unsafeCSS(brandColor)};
      border: none;
    }
    .form-area {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      gap: 1rem;
      margin: auto;
    }

    .edit-title {
      color: ${unsafeCSS(brandColor)};
      font-size: 20px;
      font-weight: 500;

      text-align: left;
    }
    @media (min-width: 600px) {
      .edit-title {
        color: ${unsafeCSS(brandColor)};
        font-size: 20px;
        font-weight: 500;

        text-align: center;
      }
    }
  `;

  render() {
    return html`
      <div class="form-container">
        <h2 class="edit-title">${this.isEdit ? "Edit" : "Add"} Employee</h2>
        <form class="form-area" @submit="${this.saveEmployee}">
          <input
            type="text"
            .value="${this.employee.firstName || ""}"
            @input="${(e) => (this.employee.firstName = e.target.value)}"
            placeholder="First Name"
            required
          />
          <input
            type="text"
            .value="${this.employee.lastName || ""}"
            @input="${(e) => (this.employee.lastName = e.target.value)}"
            placeholder="Last Name"
            required
          />
          <input
            type="text"
            .value="${this.employee.dateOfBirth || ""}"
            @input="${(e) => (this.employee.dateOfBirth = e.target.value)}"
            placeholder="Date of Birth"
            required
          />
          <input
            type="text"
            .value="${this.employee.phone || ""}"
            @input="${(e) => (this.employee.phone = e.target.value)}"
            placeholder="Phone"
            required
          />
          <input
            type="mail"
            .value="${this.employee.email || ""}"
            @input="${(e) => (this.employee.email = e.target.value)}"
            placeholder="Email"
            required
          />
          <input
            type="text"
            .value="${this.employee.department || ""}"
            @input="${(e) => (this.employee.department = e.target.value)}"
            placeholder="Department"
            required
          />
          <input
            type="text"
            .value="${this.employee.position || ""}"
            @input="${(e) => (this.employee.position = e.target.value)}"
            placeholder="Position"
            required
          />
          <button class="submit" type="submit">Save</button>
        </form>
      </div>

      ${this.showModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <h2>submit changes?</h2>
                <form @submit=${this.editEmployee}>
                  <div class="modal-buttons">
                    <button type="button" @click=${this.closeModal}>
                      Cancel
                    </button>
                    <button type="submit">OK</button>
                  </div>
                </form>
              </div>
            </div>
          `
        : ""}
    `;
  }

  onBeforeEnter(location) {
    const {
      params: { id },
      pathname,
    } = location;
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.id = id;
    this.isEdit = pathname.split("/")[1] == "edit";
    this.employee = employees.find((e) => e.id == id) || {
      firstName: "",
      lastName: "",
      id: Date.now(),
    };
  }
  saveEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (this.isEdit) {
      this.openModal();
    } else {
      employees.unshift(this.employee);
      this.saveAndRedirect(employees);
    }
  }

  editEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const editedIndex = employees.findIndex(
      (emp) => emp.id === this.employee.id
    );
    employees[editedIndex] = this.employee;
    const page = Math.floor(editedIndex / EMPLOYEES_PER_PAGE) + 1;
    this.saveAndRedirect(employees, page);
  }

  saveAndRedirect(employees, page) {
    localStorage.setItem("employees", JSON.stringify(employees));
    if (this.isEdit) {
      router
        .render(`/employees/page/${page}`)
        .catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", `/employees/page/${page}`);
    } else {
      router.render("/").catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", "/");
    }
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}

customElements.define("employee-form", EmployeeForm);
