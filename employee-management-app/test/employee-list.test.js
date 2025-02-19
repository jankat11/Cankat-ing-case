import { html, fixture, expect, oneEvent } from '@open-wc/testing';
import sinon from 'sinon';
import '../src/employee-list.js';

describe('Employee List Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    expect(el).to.exist;
  });

  it('renders header and search input', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const header = el.shadowRoot.querySelector('.employee-list-title');
    const searchInput = el.shadowRoot.querySelector('.search-input');
    expect(header).to.exist;
    expect(searchInput).to.exist;
    expect(searchInput.placeholder).to.not.be.empty;
  });

  it('updates searchTerm when search input changes', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const searchInput = el.shadowRoot.querySelector('.search-input');
    searchInput.value = 'John';
    searchInput.dispatchEvent(new Event('input'));
    await el.updateComplete;
    expect(el.searchTerm).to.equal('John');
  });

  it('filters employees correctly based on searchTerm', async () => {
    const testEmployees = [
      { firstName: 'Alice', lastName: 'Smith', id: 1 },
      { firstName: 'Bob', lastName: 'Brown', id: 2 },
      { firstName: 'Charlie', lastName: 'Davis', id: 3 },
    ];
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = testEmployees;
    el.searchTerm = 'bo';
    await el.updateComplete;
    const filtered = el.filteredEmployees;
    expect(filtered.length).to.equal(1);
    expect(filtered[0].firstName).to.equal('Bob');
  });


  it('deletes employee and updates localStorage when modal form is submitted', async () => {
    const testEmployees = [
      {
        firstName: 'cankat',
        lastName: 'güven',
        id: 1,
        dateOfEmployement: '2025-01-01',
        dateOfBirth: '1987-01-01',
        phone: '111',
        email: 'can@gmail.com',
        department: 'HR',
        position: 'Manager',
      },
      {
        firstName: 'ali',
        lastName: 'derin',
        id: 2,
        dateOfEmployement: '2020-02-02',
        dateOfBirth: '1991-02-02',
        phone: '222',
        email: 'ali@gmail.com',
        department: 'IT',
        position: 'Developer',
      },
    ];
    localStorage.setItem('employees', JSON.stringify(testEmployees));

    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = testEmployees;
    el.currentPage = 1;
    await el.updateComplete;
    el.openModal(0);
    await el.updateComplete;
    expect(el.showModal).to.be.true;
    const modalForm = el.shadowRoot.querySelector('.modal form');
    modalForm.dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true })
    );
    await el.updateComplete;
    expect(el.employees.length).to.equal(1);
    expect(el.employees[0].id).to.equal(2);
    const storedEmployees = JSON.parse(localStorage.getItem('employees'));
    expect(storedEmployees.length).to.equal(1);
    expect(storedEmployees[0].id).to.equal(2);
  });

  it('changes view mode when view toggle buttons are clicked', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    expect(el.selectedView).to.equal('list');

    const viewToggleButtons = el.shadowRoot.querySelectorAll('.view-toggle button');
    expect(viewToggleButtons.length).to.equal(2);

    viewToggleButtons[1].click();
    await el.updateComplete;
    expect(el.selectedView).to.equal('table');

    viewToggleButtons[0].click();
    await el.updateComplete;
    expect(el.selectedView).to.equal('list');
  });

  it('updates language when document lang attribute changes', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    document.documentElement.lang = 'fr';
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(el.lang).to.equal('fr');
    document.documentElement.lang = 'en';
  });

  it('onBeforeEnter sets currentPage and initializes employees in localStorage', async () => {
    localStorage.removeItem('employees');
    const el = await fixture(html`<employee-list></employee-list>`);
    const location = { params: { pageNumber: '3' } };
    el.onBeforeEnter(location);
    await el.updateComplete;
    expect(el.currentPage).to.equal(3);
    const storedEmployees = JSON.parse(localStorage.getItem('employees'));
    expect(storedEmployees).to.exist;
  });

  it('handlePageChange updates currentPage', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const event = new CustomEvent('page-change', { detail: { page: 2 } });
    el.handlePageChange(event);
    await el.updateComplete;
    expect(el.currentPage).to.equal(2);
  });

  it('_onLocationChanged updates currentPage based on route', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    const newPage = 4;
    const event = new CustomEvent('vaadin-router-location-changed', {
      detail: { location: { pathname: `/employees/page/${newPage}` } },
    });
    window.dispatchEvent(event);
    await el.updateComplete;
    expect(el.currentPage).to.equal(newPage);
  });
});
