import { html, fixture, expect } from '@open-wc/testing';
import '../src/employee-form.js';

describe('Employee Form Component', () => {
  before(() => {
    window.router = { navigate: () => {} };
  });

  it('renders correctly', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    expect(el).to.exist;
  });


  it('saves employee and updates localStorage', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = { firstName: 'Bob', lastName: 'Brown', id: 123 };

    el.saveEmployee(new Event('submit'));
    const employees = JSON.parse(localStorage.getItem('employees'));

    expect(employees.length).to.be.greaterThan(0);
    expect(employees[0].firstName).to.equal('Bob');
  });


  it('opens and closes modal in edit mode', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.isEdit = true;
    el.saveEmployee(new Event('submit'));
    await el.updateComplete;
    expect(el.showModal).to.be.true;
    const cancelButton = el.shadowRoot.querySelector(
      '.modal-buttons button[type="button"]'
    );
    cancelButton.click();
    await el.updateComplete;
    expect(el.showModal).to.be.false;
  });

  it('edits employee and updates localStorage when modal proceed is clicked', async () => {
    const originalEmployee = {
      firstName: 'Old',
      lastName: 'Name',
      id: 321,
      dateOfEmployement: '2021-01-01',
      dateOfBirth: '1990-01-01',
      phone: '111111111',
      email: 'old@example.com',
      department: 'Sales',
      position: 'Salesman',
    };
    localStorage.setItem('employees', JSON.stringify([originalEmployee]));

    const el = await fixture(html`<employee-form></employee-form>`);
    el.isEdit = true;
    el.employee = { ...originalEmployee, firstName: 'New', phone: '222222222' };
    await el.updateComplete;
    el.saveEmployee(new Event('submit'));
    await el.updateComplete;
    const modalForm = el.shadowRoot.querySelector('.modal form');
    modalForm.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    await el.updateComplete;
    const employees = JSON.parse(localStorage.getItem('employees'));
    expect(employees[0].firstName).to.equal('New');
    expect(employees[0].phone).to.equal('222222222');
  });

  it('renders correct title for add and edit modes', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    el.isEdit = false;
    await el.updateComplete;
    const title = el.shadowRoot.querySelector('.edit-title');
    expect(title.textContent).to.contain('Add Employee');
    el.isEdit = true;
    await el.updateComplete;
    expect(title.textContent).to.contain('Edit Employee');
  });

  it('updates language when document lang attribute changes', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    document.documentElement.lang = 'fr';
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(el.lang).to.equal('fr');
    document.documentElement.lang = 'en';
  });

  it('initializes employee on before enter for add mode when employee not found', async () => {
    localStorage.setItem('employees', JSON.stringify([]));
    const el = await fixture(html`<employee-form></employee-form>`);
    const location = {
      params: { id: '999' },
      pathname: '/add',
    };
    el.onBeforeEnter(location);
    expect(el.employee.firstName).to.equal('');
    expect(el.employee.lastName).to.equal('');
    expect(el.employee.id).to.exist;
  });

  it('initializes employee on before enter in edit mode when employee exists', async () => {
    const testEmployee = {
      firstName: 'Test',
      lastName: 'User',
      id: '1000',
      dateOfEmployement: '2022-01-01',
      dateOfBirth: '1990-01-01',
      phone: '123456789',
      email: 'test@example.com',
      department: 'TestDept',
      position: 'Tester',
    };
    localStorage.setItem('employees', JSON.stringify([testEmployee]));
    const el = await fixture(html`<employee-form></employee-form>`);
    const location = {
      params: { id: '1000' },
      pathname: '/edit/1000',
    };
    el.onBeforeEnter(location);
    expect(el.employee.firstName).to.equal('Test');
  });



});
