import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Map = React.forwardRef((props: any, ref: any) => {
    return (
        <View style={[props.style, styles.webMap]} ref={ref}>
            <Text style={styles.webMapText}>Map View (Not available on web)</Text>
            <Text style={styles.webMapSubtext}>Coordinates: {props.initialRegion?.latitude.toFixed(4)}, {props.initialRegion?.longitude.toFixed(4)}</Text>
            {props.children}
        </View>
    );
});

export const MapMarker = (props: any) => {
    // We can't easily render markers on a mock map, 
    // but we can render the children if they are UI elements
    return <View style={styles.markerMock}>{props.children}</View>;
};

export const MapCircle = (props: any) => null;
export const PROVIDER_GOOGLE = 'google';

const styles = StyleSheet.create({
    webMap: {
        backgroundColor: '#0f0f1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    webMapText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    webMapSubtext: {
        color: '#aaa',
        fontSize: 14,
        marginTop: 8,
    },
    markerMock: {
        position: 'absolute',
    }
});
