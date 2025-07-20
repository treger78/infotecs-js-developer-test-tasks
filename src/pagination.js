export class Pagination {
  constructor({ 
    rowsPerPageOptions = [5, 10, 20, 50, 100],
    initialRowsPerPage = 10,

    onPageChange = () => {}
  }) {
    this.currentPage = 1;
    this.rowsPerPage = initialRowsPerPage;
    this.totalItems = 0;
    this.onPageChange = onPageChange;
    this.rowsPerPageOptions = rowsPerPageOptions;
  }

  get currentPage() {
    return this._currentPage;
  }

  set currentPage(page) {
    this._currentPage = page;
  }

  setTotalItems(total) {
    this.totalItems = total;
    this.updatePaginationInfo();
  }

  getPaginatedData(data) {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    return data.slice(startIndex, endIndex);
  }

  updatePaginationInfo() {
    const totalPages = this.getTotalPages();

    document.getElementById('page-info').textContent = `Страница ${this.currentPage} из ${totalPages}`;

    document.getElementById('first-page').disabled = this.currentPage === 1;
    document.getElementById('prev-page').disabled = this.currentPage === 1;
    document.getElementById('next-page').disabled = this.currentPage === totalPages;
    document.getElementById('last-page').disabled = this.currentPage === totalPages;
  }

  getTotalPages() {
    return Math.ceil(this.totalItems / this.rowsPerPage);
  }

  goToPage(page) {
    const totalPages = this.getTotalPages();

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    this.currentPage = page;

    this.updatePaginationInfo();
    this.onPageChange();
  }

  setupPaginationControls() {
    const rowsPerPageSelect = document.getElementById('rows-per-page');

    rowsPerPageSelect.innerHTML = '';

    this.rowsPerPageOptions.forEach(option => {
      const optElement = document.createElement('option');

      optElement.value = option;
      optElement.textContent = option;
      optElement.selected = option === this.rowsPerPage;

      rowsPerPageSelect.appendChild(optElement);
    });

    rowsPerPageSelect.addEventListener('change', (event) => {
      this.rowsPerPage = parseInt(event.target.value);
      this.currentPage = 1;

      this.onPageChange();
      this.updatePaginationInfo();
    });

    document.getElementById('first-page').addEventListener('click', () => {
      this.goToPage(1);
    });

    document.getElementById('prev-page').addEventListener('click', () => {
      this.goToPage(this.currentPage - 1);
    });

    document.getElementById('next-page').addEventListener('click', () => {
      this.goToPage(this.currentPage + 1);
    });

    document.getElementById('last-page').addEventListener('click', () => {
      this.goToPage(this.getTotalPages());
    });
  }
}
