import Hammer from 'hammerjs';

import { Direction } from './constants';
import { GesturePropError } from './Errors';
import GestureHandler from './GestureHandler';
import { isnan } from './utils';

class FlingGestureHandler extends GestureHandler {
  get name() {
    return 'swipe';
  }

  get shouldEnableGestureOnSetup() {
    return true;
  }

  onMainEvent(event) {
    this._sendEvent({
      ...event,
      eventType: Hammer.INPUT_MOVE,
      isFinal: false,
      isFirst: true,
    });
    this.isGestureRunning = false;
    this.hasGestureFailed = false;
    this._sendEvent({
      ...event,
      eventType: Hammer.INPUT_END,
      isFinal: true,
    });
  }

  onRawEvent(ev) {
    super.onRawEvent(ev);
    if (this.hasGestureFailed) {
      return;
    }
    // Hammer doesn't send a `cancel` event for taps.
    // Manually fail the event.
    if (ev.isFinal) {
      setTimeout(() => {
        if (this.isGestureRunning) {
          this._cancelEvent(ev);
        }
      });
    } else if (!this.hasGestureFailed && !this.isGestureRunning) {
      // Tap Gesture start event
      const gesture = this.hammer.get(this.name);
      if (gesture.options.enable(gesture, ev)) {
        this.onStart(ev);
        this._sendEvent(ev);
      }
    }
  }

  _getHammerConfig() {
    return {
      pointers: this.config.numberOfPointers,
      direction: this.getDirection(),
    };
  }

  _getTargetDirections(direction) {
    const directions = [];
    if (direction & Direction.RIGHT) {
      directions.push(Hammer.DIRECTION_RIGHT);
    }
    if (direction & Direction.LEFT) {
      directions.push(Hammer.DIRECTION_LEFT);
    }
    if (direction & Direction.UP) {
      directions.push(Hammer.DIRECTION_UP);
    }
    if (direction & Direction.DOWN) {
      directions.push(Hammer.DIRECTION_DOWN);
    }
    // const hammerDirection = directions.reduce((a, b) => a | b, 0);
    return directions;
  }

  getDirection() {
    const { direction } = this.getConfig();

    let directions = [];
    if (direction & Direction.RIGHT) {
      directions.push(Hammer.DIRECTION_HORIZONTAL);
    }
    if (direction & Direction.LEFT) {
      directions.push(Hammer.DIRECTION_HORIZONTAL);
    }
    if (direction & Direction.UP) {
      directions.push(Hammer.DIRECTION_VERTICAL);
    }
    if (direction & Direction.DOWN) {
      directions.push(Hammer.DIRECTION_VERTICAL);
    }
    directions = [...new Set(directions)];

    if (directions.length === 0) return Hammer.DIRECTION_NONE;
    if (directions.length === 1) return directions[0];
    return Hammer.DIRECTION_ALL;
  }

  isGestureEnabledForEvent(
    {
      minPointers,
      maxPointers,
      numberOfPointers,
      maxDist,
      maxDeltaX,
      maxDeltaY,
      maxDistSq,
      shouldCancelWhenOutside,
    },
    recognizer,
    { maxPointers: pointerLength, deltaX: dx, deltaY: dy, ...props }
  ) {
    const validPointerCount = pointerLength === numberOfPointers;
    if (!validPointerCount && this.isGestureRunning) {
      return { failed: true };
    }
    return { success: validPointerCount };
  }

  // The event object that is returned
  parseNativeEvent({
    translationX,
    translationY,
    velocityX,
    velocityY,
    x,
    y,
    absoluteX,
    absoluteY,
  }) {
    return {
      translationX,
      translationY,
      velocityX,
      velocityY,
      x,
      y,
      absoluteX,
      absoluteY,
    };
  }

  updateGestureConfig({ numberOfPointers = 1, direction, ...props }) {
    if (isnan(direction) || typeof direction !== 'number') {
      throw new GesturePropError('direction', direction, 'number');
    }
    // this.validateConfig(this.config)
    return super.updateGestureConfig({
      numberOfPointers,
      direction,
      ...props,
    });
  }

  createNativeGesture({ manager, props }) {
    manager.add(
      new Hammer.Swipe({
        pointers: props.minPointers,
      })
    );
  }
}

export default FlingGestureHandler;
