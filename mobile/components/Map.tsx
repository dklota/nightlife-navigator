import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from 'react-native-maps';

export const Map = React.forwardRef((props: any, ref: any) => {
  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      {...props}
    >
      {props.children}
    </MapView>
  );
});

export const MapMarker = (props: any) => <Marker {...props}>{props.children}</Marker>;
export const MapCircle = (props: any) => <Circle {...props} />;
export { PROVIDER_GOOGLE };

const styles = StyleSheet.create({});
