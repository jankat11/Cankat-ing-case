import { html, fixture, expect } from '@open-wc/testing';
import '../src/employee-list.js';

describe('Employee List Component', () => {
  it('renders correctly', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    expect(el).to.exist;
  });

  it('has an empty employee list by default', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    expect(el.employees).to.deep.equal([]);
  });

  it('adds a new employee to the list', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
    await el.updateComplete;

    expect(el.shadowRoot.querySelectorAll('li').length).to.equal(1);
    expect(el.shadowRoot.textContent).to.include('John Doe');
  });

  it('deletes an employee from the list', async () => {
    const el = await fixture(html`<employee-list></employee-list>`);
    el.employees = [{ id: 1, firstName: 'Jane', lastName: 'Smith' }];
    await el.updateComplete;

    el.deleteEmployee(1);
    await el.updateComplete;

    expect(el.employees.length).to.equal(0);
  });
});
