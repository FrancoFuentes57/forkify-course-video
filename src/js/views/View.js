// VIEWS PARENtT CLASS

//Icons
import icons from 'url:../../img/icons.svg';

class View {
  //Attributes
  _data;

  //Methods
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (eg. recipe)
   * @param {boolean} [render=true] If false, create markup string instead od rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Franco Fuentes
   * @todo Finish implementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    //Render Markup
    const markup = this._generateMarkup();
    //Guard clause
    if (!render) return markup;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    //Render Markup
    const newMarkup = this._generateMarkup();
    //New DOM Elements - Virtual DOM, DOM that is not living on the page but which live in our memory
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //Current DOM Elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    //Comparison
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Updates changed ATTRIBUTES
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
          <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
          </div>;
      `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
        `;

    this._clear();
    this._parentElement.insertAdjacentHTML('afterBegin', markup);
  }
}

export default View;
