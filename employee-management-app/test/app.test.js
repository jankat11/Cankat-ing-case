import { html, fixture, expect } from '@open-wc/testing';
import '../src/app.js';
import '../src/router.js';

describe('Employee Management App', () => {
  before(() => {
    // Mock router before tests run
    window.router = { render: () => Promise.resolve() };
  });

  it('renders correctly', async () => {
    const el = await fixture(html`<employee-management-app></employee-management-app>`);
    expect(el).to.exist;
  });

  it('contains a navigation menu', async () => {
    const el = await fixture(html`<employee-management-app></employee-management-app>`);
    const nav = el.shadowRoot.querySelector('nav');
    expect(nav).to.exist;
    expect(nav.textContent).to.include('Home');
    expect(nav.textContent).to.include('Employees');
    expect(nav.textContent).to.include('Add Employee');
  });

  it('renders the router component', async () => {
    const el = await fixture(html`<employee-management-app></employee-management-app>`);
    await el.updateComplete;
    
    const routerOutlet = document.getElementById('outlet');
    expect(routerOutlet).to.exist;
  });

  it('navigates to Employee List page', async () => {
    const el = await fixture(html`<employee-management-app></employee-management-app>`);
    const employeesLink = el.shadowRoot.querySelector('a[href="/employees"]');

    employeesLink.click();
    await el.updateComplete;

    expect(window.location.pathname).to.equal('/employees');
  });

  it('navigates to Add Employee page', async () => {
    const el = await fixture(html`<employee-management-app></employee-management-app>`);
    const addEmployeeLink = el.shadowRoot.querySelector('a[href="/add"]');

    addEmployeeLink.click();
    await el.updateComplete;

    expect(window.location.pathname).to.equal('/add');
  });
});
