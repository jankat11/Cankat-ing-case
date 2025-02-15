import { LitElement, html, css, unsafeCSS } from "lit";
import { brandColor } from "../constants";
import { renderLeftArrow, renderRightArrow } from "./icons";
import { getPagesList } from "./utils"


class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem 0;
    }
    button,
    .dots {
      margin: 0 0.25rem;
      padding: 0.5rem 0.8rem;
      border: none;
      border-radius: 50%;
      background:  #f9f9f9;
      cursor: pointer;
    }
    button.active {
      background: ${unsafeCSS(brandColor)};
      color: #fff;
      border-color: ${unsafeCSS(brandColor)};
      font-weight: bold;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .dots {
      border: none;
      background: transparent;
      cursor: default;
      font-size: 1rem;
      font-weight: bold;
    }
    .pagination-arrow svg {
      border: none;
      fill: ${unsafeCSS(brandColor)};
    }
    .pagination-arrow:disabled svg {
      fill: gray;
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
  }

  _changePage(page) {
    if (page === "...") return;
    window.history.pushState({}, "", `/employees/page/${page}`);
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const pages = getPagesList(this.currentPage, this.totalPages, 5);

    return html`
      <div class="pagination">
        <!-- Previous Butonu -->
        <button
          class="pagination-arrow"
          ?disabled=${this.currentPage === 1}
          @click=${() => this._changePage(this.currentPage - 1)}
        >
          ${renderLeftArrow()}
        </button>

        <!-- Sayfa Numaraları -->
        ${pages.map((page) => {
          if (page === "...") {
            return html`<span class="dots">...</span>`;
          }
          return html`
            <button
              class=${this.currentPage === page
                ? "active page-button"
                : "page-button"}
              @click=${() => this._changePage(page)}
            >
              ${page}
            </button>
          `;
        })}

        <!-- Next Butonu -->
        <button
          class="pagination-arrow"
          ?disabled=${this.currentPage === this.totalPages}
          @click=${() => this._changePage(this.currentPage + 1)}
        >
          ${renderRightArrow()}
        </button>
      </div>
    `;
  }
}

customElements.define("employees-pagination", PaginationComponent);
export default PaginationComponent;
