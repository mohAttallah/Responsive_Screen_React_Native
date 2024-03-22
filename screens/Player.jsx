import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import { Video } from 'expo-av';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Player() {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoPosition, setVideoPosition] = useState(0);
    const [status, setStatus] = React.useState({});
    const [opacity, setOpacity] = useState(1);
    const [volume, setVolume] = useState(1);
    const [fullScreen, setFullScreen] = useState(false);

    useEffect(() => {
        setVideoProgress(status.durationMillis);
        setVideoDuration(status.durationMillis);
        setVideoPosition(status.positionMillis);

    }, [status]);

    useEffect(() => {
        if (showOverlay) {
            const timer = setTimeout(() => {
                if (isPlaying) setShowOverlay(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showOverlay, isPlaying]);

    const handlePress = async () => {
        if (isPlaying) {
            await videoRef.current.pauseAsync();
        } else {
            await videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const handlePressShowActions = () => {
        setShowOverlay(true);
    };

    const handleSliderChange = async (value) => {
        await videoRef.current.setPositionAsync(value);
        setVideoPosition(value);
    };

    useEffect(() => {
        setVideoProgress(status.positionMillis);
        setVideoDuration(status.durationMillis);
        setVideoPosition(status.positionMillis);
    }, [status]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsFormatted = Math.floor(seconds % 60);
        return `${minutes}:${secondsFormatted < 10 ? '0' : ''}${secondsFormatted}`;
    };

    const handleResizeScreen = async () => {
        setFullScreen(!fullScreen);
        if (fullScreen) {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        } else {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
    }


    return (
        <SafeAreaView style={styles.container}>

            {showOverlay && <View style={[styles.overLay, { height: fullScreen ? "100%" : "35%" }]} />}
            <TouchableWithoutFeedback onPress={handlePressShowActions}>
                <Video
                    ref={videoRef}
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="cover"
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    isLooping
                    style={{ width: "100%", height: fullScreen ? '100%' : "35%" }}
                    progressUpdateIntervalMillis={1000}
                />
            </TouchableWithoutFeedback>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text>{formatTime(videoPosition / 1000)}</Text>
                <Slider
                    style={{ width: 200, height: 40 }}
                    minimumValue={0}
                    maximumValue={videoDuration}
                    value={videoProgress}
                    onValueChange={handleSliderChange}
                />
                <Text>{formatTime(videoDuration / 1000)}</Text>
                <TouchableOpacity onPress={handleResizeScreen}>
                    <Entypo name="resize-full-screen" size={24} color="#000000" />
                </TouchableOpacity>
            </View>

            {showOverlay &&
                <TouchableOpacity onPress={handlePress}
                    style={styles.actions}
                >
                    <AntDesign name={isPlaying ? "pause" : "play"} size={50} color="#ffffff" />
                </TouchableOpacity>
            }

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overLay: {
        position: "absolute",
        backgroundColor: "rgba(0,0,0,0.5)",
        width: "100%",

        zIndex: 1,
    },
    actions: {
        position: "absolute",
        zIndex: 2,
    }
});