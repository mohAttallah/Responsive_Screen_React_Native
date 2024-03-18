import React, { useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, Animated, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
    const [showProgress, setShowProgress] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text>
                    ff
                </Text>
            </View>
            <View style={styles.main}>




                <TouchableOpacity
                    style={styles.section1}
                    onPress={() => { navigation.navigate('Details') }}
                >
                    <Text> Details Page</Text >
                    <Text> Click Me</Text>
                </TouchableOpacity>



                <TouchableOpacity
                    style={styles.section2}
                    onPress={() => { navigation.navigate('Pokemon') }}
                >
                    <Text> Pokemon Page</Text >
                    <Text> Click Me</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.footer}>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 1,
        backgroundColor: "tomato",
        width: "100%",
        display: "flex",

    }, main: {
        flex: 4,
        width: "100%",
        display: "flex",
        flexDirection: "row",
    },
    section1: {
        flex: 1,
        backgroundColor: "yellow",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    section2: {
        flex: 1,
        backgroundColor: "orange",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    footer: {
        flex: 1,
        backgroundColor: "tomato",
        width: "100%"
    }
});
