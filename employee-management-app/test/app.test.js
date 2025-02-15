// test/app.test.js
import { html, fixture, expect } from '@open-wc/testing';
import '../src/app.js';
import router from '../src/router.js';

// employee-list bileşeninde translate hatası almamak için stub tanımlıyoruz.
// Eğer employee-list zaten tanımlanmışsa, onun render metodunu boş bir template döndürecek şekilde override ediyoruz.
if (!customElements.get('employee-list')) {
  class EmployeeListStub extends HTMLElement {
    connectedCallback() {
      this.innerHTML = '<div>employee-list stub</div>';
    }
  }
  customElements.define('employee-list', EmployeeListStub);
} else {
  const employeeListEl = customElements.get('employee-list');
  // LitElement tabanlı bir bileşense, render metodunu override edelim:
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
    // Test öncesi localStorage ve document dili sıfırlıyoruz.
    localStorage.removeItem('language');
    document.documentElement.lang = 'en';

    // router.render metodunun orijinal halini saklıyoruz.
    originalRouterRender = router.render;

    // Bileşeni oluşturuyoruz.
    element = await fixture(html`<employee-management-app></employee-management-app>`);
  });

  afterEach(() => {
    // Her testten sonra router.render metodunu eski haline döndürüyoruz.
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
    // localStorage'da "tr" ayarı varsa, bileşenin bu dili kullanması beklenir.
    localStorage.setItem('language', 'tr');
    const newEl = await fixture(html`<employee-management-app></employee-management-app>`);
    expect(newEl.lang).to.equal('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });

  it('defaults language from document if localStorage is not set', async () => {
    // localStorage boş, fakat document dili "fr" olarak ayarlanmış.
    document.documentElement.lang = 'fr';
    const newEl = await fixture(html`<employee-management-app></employee-management-app>`);
    expect(newEl.lang).to.equal('fr');
    expect(document.documentElement.lang).to.equal('fr');
  });

  it('updates language when select is changed', async () => {
    const shadow = element.shadowRoot;
    const select = shadow.querySelector('select');

    // Seçim değerini değiştirip change eventini tetikliyoruz.
    select.value = 'tr';
    select.dispatchEvent(new Event('change'));

    expect(element.lang).to.equal('tr');
    expect(localStorage.getItem('language')).to.equal('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });

/*   it('navigates when a navigation link is clicked', async () => {
    const shadow = element.shadowRoot;
    // Örneğin, çalışan listesinin bulunduğu linki seçiyoruz.
    const navLink = shadow.querySelector('a[href="/employees/page/1"]');

    // router.render metodunu basitçe override edip çağrılan href bilgisini yakalıyoruz.
    let capturedHref = null;
    router.render = (href) => {
      capturedHref = href;
      return Promise.resolve();
    };

    // Linke tıklama olayını simüle ediyoruz.
    navLink.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

    expect(capturedHref).to.equal('/employees/page/1');
  }); */

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

    // router.render metodunu override ediyoruz.
    router.render = (href) => Promise.resolve();

    // navigate metodunu doğrudan çağırıyoruz.
    element.navigate(fakeEvent);

    expect(defaultPrevented).to.be.true;
  });
});
