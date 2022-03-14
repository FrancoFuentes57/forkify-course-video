//MODEL

//API_URL
import { API_KEY, API_URL, RES_PER_PAGE } from './config';
import { AJAX } from './helpers';

const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;

  return (state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  });
};

const loadRecipe = async id => {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    //Check if recipe is bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

const loadSearchResults = async query => {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceUrl: rec.source_url,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

const getSearchResultPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 10

  return state.search.results.slice(start, end);
};

const updateServings = function (newServings) {
  //state.recipe.ingredients
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (newServings * ing.quantity) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const addBookmark = function (recipe) {
  //Add bookmark
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //LocalStorage
  persistBookmarks();
};

const deleteBookmark = function (id) {
  //Delete Bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  //Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //LocalStorage
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

//Simply debugging function during development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();

const uploadRecipe = async function (newRecipe) {
  try {
    //Get Ingredients from the form
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry.at(0).startsWith('ingredient') && entry.at(1))
      .map(ing => {
        const ingArray = ing
          .at(1)
          .split(',')
          .map(el => el.trim());

        //Throw New Error
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    //Create the POST object
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    //POST request
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

export {
  state,
  loadRecipe,
  loadSearchResults,
  getSearchResultPage,
  updateServings,
  addBookmark,
  deleteBookmark,
  uploadRecipe,
};
