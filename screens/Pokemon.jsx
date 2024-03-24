import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPokemon } from '../redux/PokemonSlice';
import Player from '../components/Player';
import { Dimensions } from 'react-native';

function PokemonScreen() {
    const { width, height } = Dimensions.get('window');
    const [containerWidth, setContainerWidth] = React.useState(width);
    const [containerHeight, setContainerHeight] = React.useState(height);

    const dispatch = useDispatch();
    const pokemon = useSelector(state => state.pokemon.entity);
    const loading = useSelector(state => state.pokemon.loading);
    const [fullScreenMode, setFullScreenMode] = React.useState(false);
    useEffect(() => {
        if (!pokemon) {
            dispatch(fetchPokemon());
        }
    }, [dispatch, pokemon]);
    useEffect(() => {

        console.log("fullScreenMode", fullScreenMode);
    }, [fullScreenMode]);

    if (loading === 'pending') {
        return <Text>Loading...</Text>;
    }
    if (!pokemon) {
        return <Text>No data</Text>;
    }
    const handleFullScreenChange = (isFullScreen) => {
        setFullScreenMode(isFullScreen);
        const { width, height } = Dimensions.get('window');
        setContainerHeight(height);
        setContainerWidth(width);
    };



    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: fullScreenMode ? containerWidth : "35%", width: containerHeight }}>
                <Player fullScreenMode={handleFullScreenChange} />
            </View>
            <ScrollView  >
                <FlatList
                    data={pokemon.results}
                    keyExtractor={item => item.name}
                    renderItem={({ item }) => (
                        <View>
                            <Text>Total Count: {pokemon.count}</Text>
                            <Text>Name: {item.name}</Text>
                            <Image
                                style={{ width: 50, height: 50 }}
                                source={{ uri: `https://img.pokemondb.net/sprites/black-white/anim/normal/${item.name}.gif` }}
                            />
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    );
}

export default PokemonScreen;