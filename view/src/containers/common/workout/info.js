import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Info = (props) => {
    return (
        <View style={styles.infoContainer}> 
            <View style={styles.titleContainer}> 
                <Text style={styles.titleText}> Workout Setup</Text>
            </View> 
            <View style={styles.listContainer}>
                <View>
                    <Text> workout list item 1</Text>
                </View>
                <View>
                    <Text> workout list item 2</Text>
                </View>
                <View>
                    <Text> workout list item 3</Text>
                </View>
            </View>
        </View>
    );
}

export default Info;

const styles = StyleSheet.create({
    infoContainer: {
        margin: 3,
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#7FDBFF'
    },
    titleText: {
        fontSize: 30,
        fontWeight: '500',
        color: 'black'
    },
    listContainer: {
        borderBottomWidth: 4,
        borderTopWidth: 2,
        borderRightWidth: 4,
        borderLeftWidth: 4,
        borderColor: 'black',
        padding: 5
    },
    titleContainer: {
        borderBottomWidth: 2,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderLeftWidth: 4,
        borderBottomColor: 'black',
        borderTopColor: 'black',
        borderRightColor: 'black',
        borderLeftColor: 'black',
        padding: 5
    }
});