import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Setup from './containers/common/workout/workoutSetup';


class Main extends Component {
    render() {
        return (
            <ScrollableTabView
                tabBarPosition="bottom"
                initalPage={2}
                renderTabBar={() => <ScrollableTabBar />}
            >
                <Setup tabLabel="Setup" />
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
                    <Text> More </Text>
                </View>
            </ScrollableTabView>
        );
    }
}

export default Main;



