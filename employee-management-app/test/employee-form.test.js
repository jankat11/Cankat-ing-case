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




  it('renders additional input fields with correct values from employee object', async () => {
    const testEmployee = {
      firstName: 'Test',
      lastName: 'User',
      dateOfEmployement: '2022-01-01',
      dateOfBirth: '1990-05-15',
      phone: '123456789',
      email: 'test@example.com',
      department: 'HR',
      position: 'Manager',
      id: 999,
    };
    const el = await fixture(html`<employee-form></employee-form>`);
    el.employee = { ...testEmployee };
    await el.updateComplete;
    const dateOfEmploymentInput = el.shadowRoot.querySelector(
      'input[placeholder="Date of Employement"]'
    );
    const dateOfBirthInput = el.shadowRoot.querySelector(
      'input[placeholder="Date of Birth"]'
    );
    const phoneInput = el.shadowRoot.querySelector(
      'input[placeholder="Phone"]'
    );
    const emailInput = el.shadowRoot.querySelector(
      'input[placeholder="Email"]'
    );
    const departmentInput = el.shadowRoot.querySelector(
      'input[placeholder="Department"]'
    );
    const positionInput = el.shadowRoot.querySelector(
      'input[placeholder="Position"]'
    );

    expect(dateOfEmploymentInput.value).to.equal(
      testEmployee.dateOfEmployement
    );
    expect(dateOfBirthInput.value).to.equal(testEmployee.dateOfBirth);
    expect(phoneInput.value).to.equal(testEmployee.phone);
    expect(emailInput.value).to.equal(testEmployee.email);
    expect(departmentInput.value).to.equal(testEmployee.department);
    expect(positionInput.value).to.equal(testEmployee.position);
  });

  it('updates additional input fields when user types', async () => {
    const el = await fixture(html`<employee-form></employee-form>`);
    const dateOfEmploymentInput = el.shadowRoot.querySelector(
      'input[placeholder="Date of Employement"]'
    );
    const dateOfBirthInput = el.shadowRoot.querySelector(
      'input[placeholder="Date of Birth"]'
    );
    const phoneInput = el.shadowRoot.querySelector(
      'input[placeholder="Phone"]'
    );
    const emailInput = el.shadowRoot.querySelector(
      'input[placeholder="Email"]'
    );
    const departmentInput = el.shadowRoot.querySelector(
      'input[placeholder="Department"]'
    );
    const positionInput = el.shadowRoot.querySelector(
      'input[placeholder="Position"]'
    );

    dateOfEmploymentInput.value = '2022-02-02';
    dateOfEmploymentInput.dispatchEvent(new Event('input'));
    dateOfBirthInput.value = '1991-06-20';
    dateOfBirthInput.dispatchEvent(new Event('input'));
    phoneInput.value = '987654321';
    phoneInput.dispatchEvent(new Event('input'));
    emailInput.value = 'new@example.com';
    emailInput.dispatchEvent(new Event('input'));
    departmentInput.value = 'Engineering';
    departmentInput.dispatchEvent(new Event('input'));
    positionInput.value = 'Developer';
    positionInput.dispatchEvent(new Event('input'));

    await el.updateComplete;
    expect(el.employee.dateOfEmployement).to.equal('2022-02-02');
    expect(el.employee.dateOfBirth).to.equal('1991-06-20');
    expect(el.employee.phone).to.equal('987654321');
    expect(el.employee.email).to.equal('new@example.com');
    expect(el.employee.department).to.equal('Engineering');
    expect(el.employee.position).to.equal('Developer');
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
