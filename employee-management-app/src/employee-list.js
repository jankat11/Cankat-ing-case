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
    nav {
      background-color: #333;
      color: white;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-title {
      font-size: 1.5rem;
    }
    .nav-button {
      background-color: orange;
      border: none;
      padding: 0.5rem 1rem;
      color: white;
      cursor: pointer;
      font-size: 1rem;
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

  // Yeni çalışan ekleme modunu açar
  openModal() {
    this.showModal = true;
    this.firstName = '';
    this.lastName = '';
    this.editingIndex = -1;
  }

  // Var olan çalışanı düzenleme modunu açar
  openEditModal(index) {
    const employee = this.employees[index];
    this.firstName = employee.firstName;
    this.lastName = employee.lastName;
    this.editingIndex = index;
    this.showModal = true;
    
  }

  closeModal() {
    this.showModal = false;
    this.firstName = '';
    this.lastName = '';
    this.editingIndex = -1;
  }

  handleFirstNameChange(e) {
    this.firstName = e.target.value;
  }

  handleLastNameChange(e) {
    this.lastName = e.target.value;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    router.render(href).catch(err => console.error('Routing error:', err));
    window.history.pushState({}, '', href);
  }

  saveEmployee(e) {
    e.preventDefault();
    const fName = this.firstName.trim();
    const lName = this.lastName.trim();

    if (fName && lName) {
      if (this.editingIndex > -1) {
        // Düzenleme yapılıyorsa ilgili çalışan güncelleniyor
        this.employees = this.employees.map((emp, idx) =>
          idx === this.editingIndex ? { firstName: fName, lastName: lName } : emp
        );
        localStorage.setItem('employees', JSON.stringify(this.employees));
      } else {
        // Yeni çalışan ekleniyor
        this.employees = [...this.employees, { firstName: fName, lastName: lName }];
      }
      this.closeModal();
    }
  }

  deleteEmployee(index) {
    this.employees = this.employees.filter((_, idx) => idx !== index);
    localStorage.setItem('employees', JSON.stringify(this.employees));
  }

  render() {
    return html`
      <!-- Nav Bar -->
      <nav>
        <div class="nav-title">Employee List</div>
        <button class="nav-button" @click=${this.openModal}>Add New</button>
      </nav>

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

      <!-- Modal Popup -->
      ${this.showModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <h2>
                  ${this.editingIndex > -1 ? 'Edit Employee' : 'Add Employee'}
                </h2>
                <form @submit=${this.saveEmployee}>
                  <label for="firstName">Ad:</label>
                  <input
                    type="text"
                    id="firstName"
                    .value=${this.firstName}
                    @input=${this.handleFirstNameChange}
                  />
                  <label for="lastName">Soyad:</label>
                  <input
                    type="text"
                    id="lastName"
                    .value=${this.lastName}
                    @input=${this.handleLastNameChange}
                  />
                  <div class="modal-buttons">
                    <button type="button" @click=${this.closeModal}>Cancel</button>
                    <button type="submit">OK</button>
                  </div>
                </form>
              </div>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
