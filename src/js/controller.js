//Polyfilling
import 'core-js/stable'; //ES6 >
import 'regenerator-runtime/runtime'; //Async functions
//Model
import {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
} from './model.js';
//Views
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
//Configs
import { MODAL_CLOSE_SEC } from './config';

const controlRecipes = async () => {
  try {
    //Getting ID from URL
    const id = window.location.hash.slice(1);

    //Guard clause
    if (!id) return;
    recipeView.renderSpinner();

    //0) Update Results view to mark selected search result
    resultsView.update(getSearchResultPage());

    //1) Updating Bookmarks view
    bookmarksView.update(state.bookmarks);

    //2) Loading recipe
    await loadRecipe(id);

    //3) Rendering Recipe
    recipeView.render(state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    //1) Get search query
    const query = searchView.getQuery();

    // Guard clause
    if (!query) return;
    resultsView.renderSpinner();

    //2) Load search results
    await loadSearchResults(query);

    //3) Render results
    resultsView.render(getSearchResultPage(1));

    //4) Render initial pagination buttons
    paginationView.render(state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  //1) Render NEW results
  resultsView.render(getSearchResultPage(goToPage));
  //2) Render NEW pagination buttons
  paginationView.render(state.search);
};

const controlServings = function (newServings) {
  //1) Update the recipe servings (in state)
  updateServings(newServings);
  //2) Update the recipe view
  recipeView.update(state.recipe);
};

const controlAddBookmark = function () {
  //1) Add or remove a bookmark
  if (!state.recipe.bookmarked) addBookmark(state.recipe);
  else deleteBookmark(state.recipe.id);

  //2) Update recipe view
  recipeView.update(state.recipe);

  //3) Render bookmarks
  bookmarksView.render(state.bookmarks);
};

const controlAddBookmarks = function () {
  bookmarksView.render(state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    await uploadRecipe(newRecipe);
    console.log(state.recipe);

    //Render recipe
    recipeView.render(state.recipe);

    //Display success message
    addRecipeView.renderMessage();

    //Render bookmark view
    bookmarksView.render(state.bookmarks);

    //Change ID in URL
    window.history.pushState(null, '', `#${state.recipe.id}`);

    //Close Form Window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.log('🤔', error);
    addRecipeView.renderError(error.message);
  }
};

//--PUBLISHER SUSCRIBER PATTERN

const init = function () {
  //Bookmarks View
  bookmarksView.addHandlerRender(controlAddBookmarks);
  //Initialization Event Listener
  recipeView.addHandlerRender(controlRecipes);
  //Click Update Servings
  recipeView.addHandlerUpdateServings(controlServings);
  //Click Add Bookmark
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  //Search Event Listener
  searchView.addHandlerSearch(controlSearchResults);
  //Click Pagination Event Listener
  paginationView.addHandlerClick(controlPagination);
  //Submit new recipe
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
