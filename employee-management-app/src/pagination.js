import { LitElement, html, css, unsafeCSS } from "lit";
import { brandColor } from "../constants";
import { renderLeftArrow, renderRightArrow } from "./icons";

// Basit bir yardımcı fonksiyon: Gösterilecek sayfa numaralarını hesaplar.
function getPagesArray(currentPage, totalPages, maxVisiblePages = 5) {
  // Örnek: maxVisiblePages = 5
  // 1 (ilk sayfa), 2, 3, 4, 5, ... (son sayfa) gibi.

  const pages = [];

  // Eğer toplam sayfa sayısı, maksimum gösterilecek sayfa sayısından küçükse,
  // hepsini direkt göster.
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // 1) Her zaman ilk sayfayı ekle
  pages.push(1);

  // 2) Ortada gösterilecek sayfa aralığını hesapla
  // currentPage etrafında kaç sayfa gösterileceğini siz belirleyebilirsiniz.
  // Örneğin 2 solda, 2 sağda (toplam 5).
  const delta = 1; // currentPage'in sol ve sağında kaç sayfa göstereceğiz
  let start = currentPage - delta;
  let end = currentPage + delta;

  // start en az 2 olabilir (çünkü 1 zaten ekli)
  if (start < 2) {
    start = 2;
  }
  // end, totalPages - 1'i geçmesin (çünkü son sayfa en sonda ekleniyor)
  if (end > totalPages - 1) {
    end = totalPages - 1;
  }

  // 3) Eğer start > 2 ise (yani 2 ile start arasında boşluk varsa),
  // "..." ekle
  if (start > 2) {
    pages.push("...");
  }

  // 4) start ile end arasındaki sayfaları ekle
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 5) Eğer end < totalPages - 1 ise, "..." ekle
  if (end < totalPages - 1) {
    pages.push("...");
  }

  // 6) Her zaman son sayfayı ekle
  pages.push(totalPages);

  return pages;
}

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
      background: #fff;
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
    // "..." tıklandığında bir şey yapmayalım
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
    const pages = getPagesArray(this.currentPage, this.totalPages, 5);

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
          // Eğer '...' ise, clickable olmayan bir span vs. render edebilirsiniz
          if (page === "...") {
            return html`<span class="dots">...</span>`;
          }
          // Normal sayfa numarası
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
