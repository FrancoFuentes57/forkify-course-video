// VIEW

//Icons
import icons from 'url:../../img/icons.svg';
//Parent Class
import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  //Attributes
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again ;)';
  _message = '';

  //Methods
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
