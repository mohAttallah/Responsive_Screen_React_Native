import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text } from 'react-native';
import { Video } from 'expo-av';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Slider from '@react-native-community/slider';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

export default function Player({ fullScreenMode }) {
    const navigation = useNavigation();
    const { width, height } = Dimensions.get('window');
    const [containerWidth, setContainerWidth] = useState(width);
    const [containerHeight, setContainerHeight] = useState(height);

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
    const [isSliding, setIsSliding] = useState(false);

    useEffect(() => {
        if (!isSliding) {
            setVideoProgress(status.positionMillis); // update videoProgress with current position
        }
        setVideoDuration(status.durationMillis);
        setVideoPosition(status.positionMillis);
    }, [status, isSliding]);

    useEffect(() => {
        if (showOverlay) {
            const timer = setTimeout(() => {
                if (isPlaying) setShowOverlay(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showOverlay, isPlaying]);

    const handleVolumeChange = (value) => {
        setVolume(value);
        videoRef.current.setVolumeAsync(value);
    };

    const handleOpacityChange = (value) => {
        setOpacity(value);
    };

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
        setIsSliding(true);
        await videoRef.current.setPositionAsync(value);
        setVideoPosition(value);
        setVideoProgress(value);
    };

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

        //  get the new width and height of the screen
        const { width, height } = Dimensions.get('screen');
        setContainerWidth(fullScreen ? width : height);
        setContainerHeight(fullScreen ? height : width);
        fullScreenMode(!fullScreen)

    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: !fullScreen
        });
    }, [fullScreen]);

    return (
        <SafeAreaView style={[styles.container, { maxWidth: containerWidth, maxHeight: containerHeight }]} >

            {showOverlay && <View style={[styles.overLay, { height: fullScreen ? containerHeight : "100%" }]} />}
            <TouchableWithoutFeedback onPress={handlePressShowActions}>
                <Video
                    ref={videoRef}
                    source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                    isLooping
                    style={{ width: containerWidth, height: fullScreen ? containerHeight : "100%", alignSelf: 'center' }}
                    progressUpdateIntervalMillis={1000}

                />
            </TouchableWithoutFeedback>

            {showOverlay &&
                <TouchableOpacity onPress={handlePress}
                    style={styles.actions}
                >
                    <AntDesign name={isPlaying ? "pause" : "play"} size={50} color="#ffffff" />
                    <View style={styles.slider}>
                        <Text>{formatTime(videoPosition / 1000)}</Text>
                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={videoDuration}
                            value={videoProgress}
                            onValueChange={handleSliderChange}
                            onSlidingComplete={() => setIsSliding(false)}
                        />
                        <Text>{formatTime(videoDuration / 1000)}</Text>
                        <TouchableOpacity onPress={handleResizeScreen}>
                            <Entypo name="resize-full-screen" size={24} color="#000000" />
                        </TouchableOpacity>

                    </View>
                    <View>


                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={volume}
                            onValueChange={handleVolumeChange}
                        />
                        <Slider
                            style={{ width: 200, height: 40 }}
                            minimumValue={0}
                            maximumValue={1}
                            value={opacity}
                            onValueChange={handleOpacityChange}
                        />
                    </View>
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
        width: "100%",
        height: "100%",
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
    },
    slider: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        position: "absolute",
        height: 40,
        zIndex: 20,
        top: 120,
        left: -100,
    }
});