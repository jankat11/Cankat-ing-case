import { LitElement, html } from 'lit';

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object }
  };

  constructor() {
    super();
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.employee = employees.find(e => e.id == id) || { firstName: '', lastName: '', id: Date.now() };
  }

  render() {
    return html`
      <h2>${this.employee.id ? 'Edit' : 'Add'} Employee</h2>
      <form @submit="${this.saveEmployee}">
        <input type="text" .value="${this.employee.firstName}" @input="${e => this.employee.firstName = e.target.value}" placeholder="First Name" required>
        <input type="text" .value="${this.employee.lastName}" @input="${e => this.employee.lastName = e.target.value}" placeholder="Last Name" required>
        <button type="submit">Save</button>
      </form>
    `;
  }

  saveEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    const existingIndex = employees.findIndex(emp => emp.id === this.employee.id);

    if (existingIndex > -1) {
      employees[existingIndex] = this.employee;
    } else {
      employees.push(this.employee);
    }

    localStorage.setItem('employees', JSON.stringify(employees));

    // Ensure navigation is only called if window.router exists
    if (window.router && typeof window.router.navigate === 'function') {
      window.router.navigate('/employees');
    }
  }
}

customElements.define('employee-form', EmployeeForm);
