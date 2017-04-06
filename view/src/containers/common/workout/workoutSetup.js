import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import axios from 'axios';
import Info from './info';

class Setup extends Component {
    componentDidMount() {
        axios.get('http://localhost:3000/workout')
            .then(workouts => {
                console.log(workouts);
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <Info />
            </View> 
        );
    }
}

export default Setup;

const styles = StyleSheet.create({
    container: {
        borderColor: 'red',
        borderWidth: 15,
        backgroundColor: '#7FDBFF',
        flex: 1,
        alignItems: 'center'
    }
});