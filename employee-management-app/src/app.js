import { LitElement, html, css } from 'lit';
import router from './router.js'; 

class EmployeeManagementApp extends LitElement {
  static styles = css`
    nav {
      display: flex;
      justify-content: space-around;
      padding: 1rem;
      background: #6200ea;
      color: white;
    }
    a {
      color: white;
      text-decoration: none;
      font-weight: bold;
    }
  `;

  render() {
    return html`
      <nav>
        <a href="/" @click="${this.navigate}">Home</a>
        <a href="/employees" @click="${this.navigate}">Employees</a>
        <a href="/add" @click="${this.navigate}">Add Employee</a>
      </nav>
      <main id="outlet"></main>
    `;
  }

  navigate(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
  
    if (href && href !== window.location.pathname) {
      router.render(href).catch(err => console.error('Routing error:', err));
      window.history.pushState({}, '', href);
    }
  }
  
}

customElements.define('employee-management-app', EmployeeManagementApp);
