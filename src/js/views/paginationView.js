//VIEW

//Icons
import icons from 'url:../../img/icons.svg';
//Parent Class
import View from './View.js';

class PaginationView extends View {
  //Properties
  _parentElement = document.querySelector('.pagination');

  //Methods
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      //Guard clause
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    //Page 1 and there are others pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupButton('next');

    //Last Page
    if (curPage === numPages && numPages > 1)
      return this._generateMarkupButton('prev');

    //Other page
    if (curPage < numPages)
      return (
        this._generateMarkupButton('prev') + this._generateMarkupButton('next')
      );

    //Page 1 and there are NO others pages
    return '';
  }

  _generateMarkupButton(direction) {
    const curPage = this._data.page;
    const page = direction === 'prev' ? curPage - 1 : curPage + 1;
    const side = direction === 'prev' ? 'left' : 'right';

    return `
        <button data-goto=${page} class="btn--inline pagination__btn--${direction}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-${side}"></use>
          </svg>
          <span>Page ${page}</span>
        </button>
      `;
  }
}

export default new PaginationView();
