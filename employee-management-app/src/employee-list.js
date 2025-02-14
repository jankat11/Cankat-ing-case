/* import { LitElement, html } from 'lit';

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

customElements.define('employee-list', EmployeeList); */

import { LitElement, html, css } from 'lit';
import router from './router.js'; 

class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    showModal: { type: Boolean },
    firstName: { type: String },
    lastName: { type: String },
    editingIndex: { type: Number }
  };

  constructor() {
    super();
    this.employees = JSON.parse(localStorage.getItem('employees')) || [];
    this.showModal = false;
    this.firstName = '';
    this.lastName = '';
    // buraya dikkat et gerekirse tekrar düzenle index şimdilik -1 yeni ekleme, 0 veya pozitif ise düzenleme
    this.editingIndex = -1;
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
      background: #fff;
      padding: 0.5rem 1rem;
      margin-bottom: 0.5rem;
      border-radius: 4px;
    }
    .employee-actions button {
      margin-left: 0.5rem;
      padding: 0.3rem 0.5rem;
      font-size: 0.9rem;
      cursor: pointer;
    }
  `;



  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    router.render(href).catch(err => console.error('Routing error:', err));
    window.history.pushState({}, '', href);
  }


  deleteEmployee(index) {
    this.employees = this.employees.filter((_, idx) => idx !== index);
    localStorage.setItem('employees', JSON.stringify(this.employees));
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
                <a href="/edit/${employee.id}" @click="${this.navigate}">Edit</a>
                <button @click=${() => this.deleteEmployee(index)}>Delete</button>
              </div>
            </li>
          `
        )}
      </ul>


    `;
  }
}

customElements.define('employee-list', EmployeeList);
