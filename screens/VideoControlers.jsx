import React, { useRef, useState, useEffect } from "react";
import { Dimensions, FlatList, View, Text } from "react-native";
import { Video } from "expo-av";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import VideoControls from "../components/VideoControlers";
import * as ScreenOrientation from "expo-screen-orientation";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['new NativeEventEmitter()']);
const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

const PlayLessonScreen = ({ navigation, route }) => {
    const [lessons, setLessons] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState({});
    const videoRef = useRef(null);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [orientation, setOrientation] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart((event) => {
            //get the tap position on X
            const touchX = event.absoluteX;
            let mid = Dimensions.get("screen").width / 2;

            //if tap position is before the mid point, set video back by 10s
            if (touchX < mid) {
                videoRef.current.getStatusAsync().then((status) => {
                    const newPosition = Math.max(status.positionMillis - 10000, 0);
                    videoRef.current.setPositionAsync(newPosition);
                });
            }
            //if tap position is before the mid point, set video forward by 10s
            else {
                videoRef.current.getStatusAsync().then((status) => {
                    const newPosition = Math.min(
                        status.positionMillis + 10000,
                        status.durationMillis
                    );
                    videoRef.current.setPositionAsync(newPosition);
                });
            }
        });

    const singleTap = Gesture.Tap().onStart((event) => {
        setShowControls(!showControls);
        // Simulate show/hide controls behavior here
    });

    useEffect(() => {
        // Simulate fetching lessons by course
        const fakeLessons = [
            {
                lessonId: "1",
                lessonVideoUrl: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
                lessonTitle: "Lesson 1",
                lessonDescription: "Introduction to React Native 1",
                videoTotalDuration: "600",
                lessonThumbnailImageUrl: "https://example.com/thumbnail1.jpg",
            },
            {
                lessonId: "2",
                lessonVideoUrl: "https://example.com/video2.mp4",
                lessonTitle: "Lesson 2",
                lessonDescription: "Introduction to React Native 2",
                videoTotalDuration: "800",
                lessonThumbnailImageUrl: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            },
            // Add more lessons here
        ];
        setLessons(fakeLessons);
        setSelectedLesson(fakeLessons[0]);
    }, []);

    //sets the current time, if video is finished, moves to the next video
    const handlePlaybackStatusUpdate = (status) => {
        setCurrentTime(status.positionMillis);
        if (status.didJustFinish) {
            playNextVideo();
        }
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pauseAsync();
        } else {
            videoRef.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    const playNextVideo = () => {
        if (currentLessonIndex < lessons.length - 1) {
            setCurrentLessonIndex((prevIndex) => prevIndex + 1);
        }
    };

    const playPreviousVideo = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex((prevIndex) => prevIndex - 1);
        }
    };

    const togglePlaybackSpeed = () => {
        //gets the next playback speed index
        const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
        if (nextSpeedIndex < playbackSpeedOptions.length) {
            videoRef.current.setRateAsync(playbackSpeedOptions[nextSpeedIndex], true);
            setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
        }
        //if the last option i.e. 2x speed is applied. then moves to first option 
        else {
            videoRef.current.setRateAsync(playbackSpeedOptions[0], true);
            setPlaybackSpeed(playbackSpeedOptions[0]);
        }
    };

    const toggleMute = () => {
        videoRef.current.setIsMutedAsync(isMuted);
        setIsMuted(!isMuted);
    };

    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
            );
            setIsFullscreen(true);
        } else {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            setIsFullscreen(false);
        }
        setOrientation(await ScreenOrientation.getOrientationAsync());
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            {/* <Spinner visible={isLoading} size="large" /> */}
            {lessons.length > 0 && (
                <>
                    <GestureDetector gesture={Gesture.Exclusive(doubleTap, singleTap)}>
                        <Video
                            ref={videoRef}
                            source={{
                                uri: lessons[currentLessonIndex]?.lessonVideoUrl,
                            }}
                            rate={playbackSpeed}
                            isMuted={isMuted}
                            shouldPlay={isPlaying}
                            resizeMode="cover"
                            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                            style={{ flex: 1 }}
                        />
                    </GestureDetector>
                    {showControls && (
                        <VideoControls
                            onTogglePlayPause={togglePlayPause}
                            onPlayPreviousVideo={playPreviousVideo}
                            onPlayNextVideo={playNextVideo}
                            onToggleMute={toggleMute}
                            onTogglePlaybackSpeed={togglePlaybackSpeed}
                            onSeek={(value) => {
                                videoRef.current.setPositionAsync(+value);
                                setCurrentTime(+value);
                            }}
                            onToggleFullscreen={toggleFullscreen}
                            duration={+selectedLesson?.videoTotalDuration}
                            currentTime={currentTime}
                            rate={playbackSpeed}
                            isMuted={isMuted}
                            shouldPlay={isPlaying}
                            fullScreenValue={isFullscreen}
                        />
                    )}
                </>
            )}
            {/* //this section is only displayed when fullscreen is not active */}
            {orientation == 1 && (
                <View>
                    {/* Simulate other UI elements here */}
                    <Text>This is the VideoControlers screen</Text>

                </View>
            )}
        </GestureHandlerRootView>
    );
};

export default PlayLessonScreen;