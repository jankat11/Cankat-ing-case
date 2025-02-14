import { LitElement, html } from "lit";
import { add, edit } from "./constants";

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    editingIndex: { type: Number },
    id: { type: String },
    isEdit: { type: Boolean },
  };

  constructor() {
    super();
    this.employee = {};
    this.isEdit = false
    this.id = null;
  }

  onBeforeEnter(location) {
    const { params: {id}, pathname } = location;
    const path = pathname.split("/")[1]
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.id = id;
    this.isEdit = path == "edit"
    this.employee = employees.find((e) => e.id == id) || {
      firstName: "",
      lastName: "",
      id: Date.now(),
    };
  }

  render() {
    return html`
      <h2>${this.id ? edit : add} Employee</h2>
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
    `;
  }

  saveEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const existingIndex = employees.findIndex(
      (emp) => emp.id === this.employee.id
    );

    if (existingIndex > -1) {
      employees[existingIndex] = this.employee;
    } else {
      employees.push(this.employee);
    }

    localStorage.setItem("employees", JSON.stringify(employees));

    // Ensure navigation is only called if window.router exists
    if (window.router && typeof window.router.navigate === "function") {
      window.router.navigate("/employees");
    }
  }
}

customElements.define("employee-form", EmployeeForm);
