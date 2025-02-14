import { LitElement, html, css } from "lit";
import router from "./router.js";

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
    /* Modal stil ayarları */
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
    .modal input {
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
  `;

  render() {
    return html`
      <h2>${this.isEdit ? "Edit" : "Add"} Employee</h2>
      <form @submit="${this.saveEmployee}">
        <input
          type="text"
          .value="${this.employee.firstName}"
          @input="${(e) => (this.employee.firstName = e.target.value)}"
          placeholder="First Name"
          required
        />
        <input
          type="text"
          .value="${this.employee.lastName}"
          @input="${(e) => (this.employee.lastName = e.target.value)}"
          placeholder="Last Name"
          required
        />
        <button type="submit">Save</button>
      </form>

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
      this.saveAndRoute(employees);
    }
  }

  editEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const editedIndex = employees.findIndex(
      (emp) => emp.id === this.employee.id
    );
    employees[editedIndex] = this.employee;
    this.saveAndRoute(employees);
  }
  saveAndRoute(employees) {
    localStorage.setItem("employees", JSON.stringify(employees));
    router.render("/").catch((err) => console.error("Routing error:", err));
    window.history.pushState({}, "", "/");
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}


customElements.define("employee-form", EmployeeForm);
