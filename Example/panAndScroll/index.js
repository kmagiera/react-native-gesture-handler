import React, { PureComponent } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  ScrollView,
  State,
} from 'react-native-gesture-handler';

import { USE_NATIVE_DRIVER } from '../config';
import { LoremIpsum } from '../common';

const windowWidth = Dimensions.get('window').width;
const circleRadius = 30;

export class TapOrPan extends PureComponent {
  constructor(props) {
    super(props);
    this._touchX = new Animated.Value(windowWidth / 2 - circleRadius);
    this._translateX = Animated.add(
      this._touchX,
      new Animated.Value(-circleRadius)
    );
    this._onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            x: this._touchX,
          },
        },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );
  }

  _onTapHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      // Once tap happened we set the position of the circle under the tapped spot
      this._touchX.setValue(nativeEvent.x);
    }
  };

  render() {
    return (
      <TapGestureHandler
        id="tap"
        waitFor="pan"
        onHandlerStateChange={this._onTapHandlerStateChange}
        shouldCancelWhenOutside>
        <PanGestureHandler
          id="pan"
          minDeltaX={20}
          onGestureEvent={this._onPanGestureEvent}
          shouldCancelWhenOutside>
          <View style={styles.horizontalPan}>
            <Animated.View
              style={[
                styles.circle,
                {
                  transform: [
                    {
                      translateX: this._translateX,
                    },
                  ],
                },
              ]}
            />
          </View>
        </PanGestureHandler>
      </TapGestureHandler>
    );
  }
}

export default class Example extends PureComponent {
  render() {
    return (
      <ScrollView waitFor={['tap', 'pan']}>
        <LoremIpsum words={150} />
        <TapOrPan />
        <LoremIpsum words={150} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  horizontalPan: {
    backgroundColor: '#f48fb1',
    height: 150,
    justifyContent: 'center',
    marginVertical: 10,
  },
  circle: {
    backgroundColor: '#42a5f5',
    borderRadius: circleRadius,
    height: circleRadius * 2,
    width: circleRadius * 2,
  },
});
