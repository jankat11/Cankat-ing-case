import { LitElement, html } from 'lit';

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array }
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
  }

  render() {
    return html`
      <h2>Employee List</h2>
      <ul>
        ${this.employees.map(emp => html`
          <li>
            ${emp.firstName} ${emp.lastName}
            <button @click="${() => this.deleteEmployee(emp.id)}">Delete</button>
            <a href="/edit/${emp.id}" @click="${this.navigate}">Edit</a>
          </li>
        `)}
      </ul>
    `;
  }

  deleteEmployee(id) {
    this.employees = this.employees.filter(emp => emp.id !== id);
    localStorage.setItem('employees', JSON.stringify(this.employees));
    this.requestUpdate();
  }

  navigate(event) {
    event.preventDefault();
    window.router.navigate(event.target.getAttribute('href'));
  }
}

customElements.define('employee-list', EmployeeList);
