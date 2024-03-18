import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';

export const fetchPokemon = createAsyncThunk('ability/battle-armor', async () => {
    const response = await api.get(`/pokemon?limit=10&offset=0`);
    return response.data;
});

const pokemonSlice = createSlice({
    name: 'pokemon',
    initialState: { entity: null, loading: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPokemon.pending, (state) => {
                console.log("pending", state)
                state.loading = 'pending';
            })
            .addCase(fetchPokemon.fulfilled, (state, action) => {
                state.loading = 'idle';
                console.log("fulfilled", state)
                state.entity = action.payload;
            })
            .addCase(fetchPokemon.rejected, (state, action) => {
                console.log("error", state)
                state.loading = 'idle';
                state.error = action.error;
            });
    },
});

export default pokemonSlice.reducer;