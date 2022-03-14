// VIEW

//Icons
import icons from 'url:../../img/icons.svg';
//Parent Class
import View from './View.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  //Attributes
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  //Methods
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
