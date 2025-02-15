import { LitElement, html, css, unsafeCSS } from "lit";
import router from "./router.js";
import { EMPLOYEES_PER_PAGE } from "../constants.js";
import { brandColor } from "../constants.js";
import { translate } from "./localization.js";

class EmployeeForm extends LitElement {
  static properties = {
    employee: { type: Object },
    editingIndex: { type: Number },
    id: { type: String },
    isEdit: { type: Boolean },
    showModal: { type: Boolean },
    lang: { type: String },
  };

  constructor() {
    super();
    this.employee = {};
    this.isEdit = false;
    this.id = null;
    this.showModal = false;
    this.lang =
      localStorage.getItem("language") || document.documentElement.lang || "en";
  }

  static styles = css`
    :host {
      display: block;
      font-family: Poppins;
      max-width: 1280px;
      margin: 0 auto;
    }
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
    input {
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
    .submit {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
      color: white;
      background-color: ${unsafeCSS(brandColor)};
      border: none;
    }
    .form-area {
      display: flex;
      flex-direction: column;
      max-width: 600px;
      gap: 1rem;
      margin: auto;
    }

    .edit-title {
      color: ${unsafeCSS(brandColor)};
      font-size: 20px;
      font-weight: 500;

      text-align: left;
    }
    @media (min-width: 600px) {
      .edit-title {
        color: ${unsafeCSS(brandColor)};
        font-size: 20px;
        font-weight: 500;

        text-align: center;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();

    // document.documentElement'in lang attribute'undaki değişiklikleri dinlemek için MutationObserver kullanıyoruz
    this._langObserver = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "lang"
        ) {
          this.lang = document.documentElement.lang || "en";
        }
      }
    });
    this._langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"],
    });

    window.addEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
  }

  disconnectedCallback() {
    if (this._langObserver) {
      this._langObserver.disconnect();
    }
    window.removeEventListener(
      "vaadin-router-location-changed",
      this._onLocationChanged
    );
    super.disconnectedCallback();
  }

  onBeforeEnter(location) {
    const {
      params: { id },
      pathname,
    } = location;
    const employees = JSON.parse(localStorage.getItem("employees")) || [];
    this.id = id;
    this.isEdit = pathname.split("/")[1] == "edit";
    this.employee = employees.find((e) => e.id == id) || {
      firstName: "",
      lastName: "",
      id: Date.now(),
    };
  }
  saveEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];

    if (this.isEdit) {
      this.openModal();
    } else {
      employees.unshift(this.employee);
      this.saveAndRedirect(employees);
    }
  }

  editEmployee(e) {
    e.preventDefault();
    let employees = JSON.parse(localStorage.getItem("employees")) || [];
    const editedIndex = employees.findIndex(
      (emp) => emp.id === this.employee.id
    );
    employees[editedIndex] = this.employee;
    const page = Math.floor(editedIndex / EMPLOYEES_PER_PAGE) + 1;
    this.saveAndRedirect(employees, page);
  }

  saveAndRedirect(employees, page) {
    localStorage.setItem("employees", JSON.stringify(employees));
    if (this.isEdit) {
      router
        .render(`/employees/page/${page}`)
        .catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", `/employees/page/${page}`);
    } else {
      router.render("/").catch((err) => console.error("Routing error:", err));
      window.history.pushState({}, "", "/");
    }
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  render() {
    return html`
      <div class="form-container">
        <h2 class="edit-title">
          ${this.isEdit
            ? translate("editEmployeeTitle", this.lang)
            : translate("addEmployeeTitle", this.lang)}
        </h2>
        <form class="form-area" @submit="${this.saveEmployee}">
          <label> ${translate("firstName", this.lang)} </label>
          <input
            type="text"
            .value="${this.employee.firstName || ""}"
            @input="${(e) => (this.employee.firstName = e.target.value)}"
            placeholder=${translate("firstName", this.lang)}
            required
          />

          <label> ${translate("lastName", this.lang)} </label>
          <input
            type="text"
            .value="${this.employee.lastName || ""}"
            @input="${(e) => (this.employee.lastName = e.target.value)}"
            placeholder=${translate("lastName", this.lang)}
            required
          />

          <label> Date of Employement </label>
          <input
            type="date"
            .value="${this.employee.dateOfEmployement || ""}"
            @input="${(e) =>
              (this.employee.dateOfEmployement = e.target.value)}"
            placeholder="Date of Employement"
            required
          />

          <label> Date of Birth </label>
          <input
            type="date"
            .value="${this.employee.dateOfBirth || ""}"
            @input="${(e) => (this.employee.dateOfBirth = e.target.value)}"
            placeholder="Date of Birth"
            required
          />

          <label> ${translate("phone", this.lang)} </label>
          <input
            type="text"
            .value="${this.employee.phone || ""}"
            @input="${(e) => (this.employee.phone = e.target.value)}"
            placeholder=${translate("phone", this.lang)}
            required
          />

          <label> ${translate("email", this.lang)} </label>
          <input
            type="email"
            .value="${this.employee.email || ""}"
            @input="${(e) => (this.employee.email = e.target.value)}"
            placeholder=${translate("email", this.lang)}
            required
          />

          <label> ${translate("department", this.lang)} </label>
          <input
            type="text"
            .value="${this.employee.department || ""}"
            @input="${(e) => (this.employee.department = e.target.value)}"
            placeholder=${translate("department", this.lang)}
            required
          />

          <label> ${translate("position", this.lang)} </label>
          <input
            type="text"
            .value="${this.employee.position || ""}"
            @input="${(e) => (this.employee.position = e.target.value)}"
            placeholder=${translate("position", this.lang)}
            required
          />

          <button class="submit" type="submit">
            ${translate("save", this.lang)}
          </button>
        </form>
      </div>

      ${this.showModal
        ? html`
            <div class="modal-overlay">
              <div class="modal">
                <h2>submit changes?</h2>
                <form @submit=${this.editEmployee}>
                  <div class="modal-buttons">
                    <button type="button" @click=${this.closeModal}>
                      Cancel
                    </button>
                    <button type="submit">OK</button>
                  </div>
                </form>
              </div>
            </div>
          `
        : ""}
    `;
  }
}

customElements.define("employee-form", EmployeeForm);
