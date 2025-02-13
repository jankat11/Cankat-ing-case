import { html, fixture, expect } from '@open-wc/testing';
import '../src/employee-form.js';

describe('Employee Form Component', () => {
  before(() => {
    // Mock window.router.navigate() to prevent errors
    window.router = { navigate: () => {} };
  });

  it('renders correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el).to.exist;
  });

  it('has empty inputs by default', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el.shadowRoot.querySelector('input[placeholder="First Name"]').value).to.equal('');
    expect(el.shadowRoot.querySelector('input[placeholder="Last Name"]').value).to.equal('');
  });

  it('updates input fields when user types', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const firstNameInput = el.shadowRoot.querySelector('input[placeholder="First Name"]');
    const lastNameInput = el.shadowRoot.querySelector('input[placeholder="Last Name"]');

    firstNameInput.value = 'Alice';
    lastNameInput.value = 'Johnson';
    firstNameInput.dispatchEvent(new Event('input'));
    lastNameInput.dispatchEvent(new Event('input'));

    await el.updateComplete;
    expect(el.employee.firstName).to.equal('Alice');
    expect(el.employee.lastName).to.equal('Johnson');
  });

  it('saves employee and updates localStorage', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = { firstName: 'Bob', lastName: 'Brown', id: 123 };

    el.saveEmployee(new Event('submit'));
    const employees = JSON.parse(localStorage.getItem('employees'));

    expect(employees.length).to.be.greaterThan(0);
    expect(employees[0].firstName).to.equal('Bob');
  });
});
