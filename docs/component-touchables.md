---
id: component-touchables
title: Touchables
sidebar_label: Touchables
---
Gesture Handler library provides an implementation of RN's touchable components that are based on [native buttons](component-buttons.md) and does not rely on JS responder system utilized by RN. Our touchable implementation follows the same API and aims to be a drop-in replacement for touchables available in React Native.

React Native's touchables API could be found here:
 - [Touchable Highlight](https://facebook.github.io/react-native/docs/touchablehighlight)
 - [Touchable Opacity](https://facebook.github.io/react-native/docs/touchableopacity)
 - [Touchable Highlight](https://facebook.github.io/react-native/docs/touchablehighlight)
 - [Touchable Without Feedback](https://facebook.github.io/react-native/docs/touchablewithoutfeedback)
 
 All major touchable properties (except from `pressRetentionOffset`) have been adopted and should behave in a similar way as with RN's touchables. 
 
 The motivation for using RNGH touchables as a replacement for these imported from React Native is to follow native behavior more strictly.
 These touchables and their feedback behavior are deeply integrated with native
 gesture ecosystem and could be connected with other native components (e.g. `ScrollView`) and Gesture Handlers easily and in a more predictable way, which 
 follows native apps' behavior.
 
 Our intention was to make switch for these touchables as simple as possible. In order to use RNGH's touchables you
 need only to change imports of touchables.
 
 ### Example:
 
 ```javascript
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native'
```

has to be replaced with:

 ```javascript
import {
  TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback
} from 'react-native-gesture-handler'
```

For more deep comparison of these implementation, see our [touchables example](https://github.com/kmagiera/react-native-gesture-handler/blob/master/Example/touchables/index.js)




 