import { LitElement, html, css } from 'lit';

class PaginationComponent extends LitElement {
  static properties = {
    currentPage: { type: Number },
    totalPages: { type: Number },
  };

  static styles = css`
    .pagination {
      display: flex;
      justify-content: center;
      margin: 1rem 0;
    }
    button {
      margin: 0 0.25rem;
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      background: #fff;
      cursor: pointer;
    }
    button.active {
      background: #ccc;
    }
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  constructor() {
    super();
    this.currentPage = 1;
    this.totalPages = 1;
  }

  _changePage(page) {
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div class="pagination">
        <button 
          ?disabled=${this.currentPage === 1} 
          @click=${() => this._changePage(this.currentPage - 1)}>
          Previous
        </button>
        ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(page => html`
          <button 
            class=${this.currentPage === page ? 'active' : ''} 
            @click=${() => this._changePage(page)}>
            ${page}
          </button>
        `)}
        <button 
          ?disabled=${this.currentPage === this.totalPages} 
          @click=${() => this._changePage(this.currentPage + 1)}>
          Next
        </button>
      </div>
    `;
  }
}

customElements.define('employees-pagination', PaginationComponent);

export default PaginationComponent;
