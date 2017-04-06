import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

class Welcome extends Component {
    render() {
        return (
            <ScrollableTabView
                tabBarPosition="overlayBottom"
                initalPage={2}
                renderTabBar={() => <ScrollableTabBar />}
            >
                <View tabLabel="Setup">
                    <Text> Setup </Text>
                </View>
                <View tabLabel="Workouts">
                    <Text> Workouts </Text>
                </View>
                <View tabLabel="Home">
                    <Text> Home </Text>
                </View>
                <View tabLabel="Calendar">
                    <Text> Calendar </Text>
                </View>
                <View tabLabel="Stats">
                    <Text> Stats </Text>
                </View>
            </ScrollableTabView>
        );
    }
}

export default Welcome;



