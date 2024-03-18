import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function Details() {
    const progressPercentage = 80; // Set the progress percentage here
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const progressStrokeDashoffset = ((100 - progressPercentage) / 100) * circumference;

    return (
        <View style={styles.container}>
            <Svg style={styles.svg}>
                <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="gray"
                    strokeWidth="4"
                    fill="none"
                />
                <Circle
                    cx="50"
                    cy="50"
                    r={radius}
                    stroke="red"
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={progressStrokeDashoffset}
                    strokeLinecap="round"
                    transform="rotate(25 50 50)"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        container: { flex: 1 },
    },
    progressText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    svg: {
        height: "100",
        width: "100",
        position: "relative",
        top: hp('40%'),
    }
});
