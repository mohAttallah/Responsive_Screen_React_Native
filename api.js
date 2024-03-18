import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    // other config goes here
});

export default instance;