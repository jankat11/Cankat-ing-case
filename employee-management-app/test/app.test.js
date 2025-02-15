
import { html, fixture, expect } from '@open-wc/testing';
import '../src/app.js';
import router from '../src/router.js';


if (!customElements.get('employee-list')) {
  class EmployeeListStub extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<div>employee-list stub</div>';
    }
  }
  customElements.define('employee-list', EmployeeListStub);
} else {
  const employeeListEl = customElements.get('employee-list');
  if (employeeListEl.prototype.render) {
    employeeListEl.prototype.render = function() {
      return html``;
    };
  }
}

describe('EmployeeManagementApp', () => {
  let element;
  let originalRouterRender;

  beforeEach(async () => {
    localStorage.removeItem('language');
    document.documentElement.lang = 'en';

    originalRouterRender = router.render;
    element = await fixture(html`<employee-management-app></employee-management-app>`);
  });

  afterEach(() => {
    router.render = originalRouterRender;
  });

  it('renders navbar with logo, links, and main outlet', () => {
    const shadow = element.shadowRoot;
    const navbar = shadow.querySelector('.navbar');
    expect(navbar).to.exist;

    const logo = navbar.querySelector('img');
    expect(logo).to.exist;
    expect(logo.getAttribute('src')).to.include('ING_logo.jpg');

    const navLinks = navbar.querySelectorAll('nav a');
    expect(navLinks.length).to.equal(2);

    const outlet = shadow.querySelector('main#outlet');
    expect(outlet).to.exist;
  });

  it('initializes language from localStorage if available', async () => {
    localStorage.setItem('language', 'tr');
    const newEl = await fixture(html`<employee-management-app></employee-management-app>`);
    expect(newEl.lang).to.equal('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });

  it('defaults language from document if localStorage is not set', async () => {
    document.documentElement.lang = 'fr';
    const newEl = await fixture(html`<employee-management-app></employee-management-app>`);
    expect(newEl.lang).to.equal('fr');
    expect(document.documentElement.lang).to.equal('fr');
  });

  it('updates language when select is changed', async () => {
    const shadow = element.shadowRoot;
    const select = shadow.querySelector('select');
    select.value = 'tr';
    select.dispatchEvent(new Event('change'));

    expect(element.lang).to.equal('tr');
    expect(localStorage.getItem('language')).to.equal('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });


  it('prevents default event behavior in navigate method', () => {
    let defaultPrevented = false;
    const fakeEvent = {
      preventDefault() {
        defaultPrevented = true;
      },
      currentTarget: {
        getAttribute: () => '/employees/page/1'
      }
    };

 
    router.render = (href) => Promise.resolve();


    element.navigate(fakeEvent);

    expect(defaultPrevented).to.be.true;
  });
});
