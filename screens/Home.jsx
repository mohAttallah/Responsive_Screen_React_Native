import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
    const [showProgress, setShowProgress] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    return (
        <View>
            <Text> Home Page dd</Text >
            <TouchableOpacity
                onPress={() => { navigation.navigate('Details') }}
            >
                <Text> Click Me</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
