import { combineReducers } from 'redux';
import pokemonReducer from './PokemonSlice';
export default combineReducers({
    pokemon: pokemonReducer
});