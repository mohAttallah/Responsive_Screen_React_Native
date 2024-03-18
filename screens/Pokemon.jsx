// PokemonScreen.js
import React, { useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPokemon } from '../redux/PokemonSlice';

function PokemonScreen() {
    const dispatch = useDispatch();
    const pokemon = useSelector(state => state.pokemon.entity);
    const loading = useSelector(state => state.pokemon.loading);

    useEffect(() => {
        if (!pokemon) {
            dispatch(fetchPokemon());
        }
    }, [dispatch, pokemon]);

    if (loading === 'pending') {
        return <Text>Loading...</Text>;
    }

    if (!pokemon) {
        return <Text>No data</Text>;
    }
    console.log("tt")
    console.log("tt", pokemon)
    return (
        <View>
            <Text>Total Count: {pokemon.count}</Text>
            <FlatList
                data={pokemon.results}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <View>
                        <Text>Name: {item.name}</Text>
                        {/* <Text>URL: {item.url}</Text> */}
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={{ uri: `https://img.pokemondb.net/sprites/black-white/anim/normal/${item.name}.gif` }}
                        ></Image>
                    </View>
                )}
            />
        </View>
    );
}

export default PokemonScreen;