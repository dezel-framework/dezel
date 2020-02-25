/* disable-sort-imports */

/// <reference path="global.d.ts" />

import './global'

/*
 * Decorators
 */

export { ref } from './decorator/ref'
export { bound } from './decorator/bound'
export { state } from './decorator/state'
export { watch } from './decorator/watch'
export { bridge } from './native/bridge'
export { native } from './native/native'

/*
 * JSX
 */

export { createElement } from './jsx/createElement'

/*
 * Core
 */

export { Dezel } from './core/Dezel'

/*
 * Device
 */

export { Device } from './device/Device'

/*
 * Platform
 */

export { Platform } from './platform/Platform'

/*
 * Event
 */

export { Emitter } from './event/Emitter'
export { Event } from './event/Event'
export { EventOptions } from './event/Event'
export { Touch } from './event/Touch'
export { TouchEvent } from './event/TouchEvent'
export { TouchEventOptions } from './event/TouchEvent'

/*
 * Gesture
 */

export { GestureManager } from './gesture/GestureManager'
export { GestureDetector } from './gesture/GestureDetector'
export { GestureDetectorOptions } from './gesture/GestureDetector'
export { TapGestureDetector } from './gesture/TapGestureDetector'
export { PanGestureDetector } from './gesture/PanGestureDetector'

/*
 * View
 */

export { Reference } from './view/Reference'
export { Collection } from './view/Collection'
export { View } from './view/View'
export { ViewInsertEvent } from './view/View'
export { ViewMoveToWindowEvent } from './view/View'
export { ViewMoveToParentEvent } from './view/View'
export { ViewRedrawEvent } from './view/View'
export { ViewTransitionOptions } from './view/View'
export { ImageView } from './view/ImageView'
export { TextView } from './view/TextView'
export { WebView } from './view/WebView'
export { SpinnerView } from './view/SpinnerView'
export { Window } from './view/Window'
export { AnimationDurationRegistry } from './view/View'
export { AnimationEquationRegistry } from './view/View'
export { Fragment } from './view/Fragment'

/*
 * Layout
 */

export { Header } from './layout/Header'
export { Footer } from './layout/Footer'
export { Content } from './layout/Content'

/*
 * Form
 */

export { Form } from './form/Form'
export { Field } from './form/Field'
export { TextArea } from './form/TextArea'
export { TextAreaChangeEvent } from './form/TextArea'
export { TextInput } from './form/TextInput'
export { TextInputChangeEvent } from './form/TextInput'

/*
 * Component
 */

export { Slot } from './component/Slot'
export { Text } from './component/Text'
export { Image } from './component/Image'
export { Label } from './component/Label'
export { Spinner } from './component/Spinner'
export { Component } from './component/Component'
export { Button } from './component/Button'
export { NavigationBar } from './component/NavigationBar'
export { NavigationBarButton } from './component/NavigationBarButton'
export { NavigationBarBackButton } from './component/NavigationBarBackButton'
export { NavigationBarCloseButton } from './component/NavigationBarCloseButton'
export { List } from './component/List'
export { ListBeforeSelectEvent } from './component/List'
export { ListSelectEvent } from './component/List'
export { ListDeselectEvent } from './component/List'
export { ListManager } from './component/ListManager'
export { ListItem } from './component/ListItem'
export { SegmentedBar } from './component/SegmentedBar'
export { SegmentedBarBeforeSelectEvent } from './component/SegmentedBar'
export { SegmentedBarSelectEvent } from './component/SegmentedBar'
export { SegmentedBarDeselectEvent } from './component/SegmentedBar'
export { SegmentedBarButton } from './component/SegmentedBarButton'
export { TabBar } from './component/TabBar'
export { TabBarBeforeSelectEvent } from './component/TabBar'
export { TabBarSelectEvent } from './component/TabBar'
export { TabBarDeselectEvent } from './component/TabBar'
export { TabBarButton } from './component/TabBarButton'
export { Tappable } from './component/Tappable'
export { Pannable } from './component/Pannable'
export { Dots } from './component/Dots'

/*
 * Screen
 */

export { Screen } from './screen/Screen'
export { ScreenBeforeEnterEvent } from './screen/Screen'
export { ScreenBeforeLeaveEvent } from './screen/Screen'
export { ScreenEnterEvent } from './screen/Screen'
export { ScreenLeaveEvent } from './screen/Screen'
export { ScreenBeforePresentEvent } from './screen/Screen'
export { ScreenBeforeDismissEvent } from './screen/Screen'
export { ScreenPresentEvent } from './screen/Screen'
export { ScreenDismissEvent } from './screen/Screen'
// export { SwitcherBeforeSelectEvent } from './screen/ScreenSwitcher'
// export { SwitcherSelectEvent } from './screen/ScreenSwitcher'
// export { SwitcherDeselectEvent } from './screen/ScreenSwitcher'

/*
 * Segues
 */

export { Segue } from './screen/Segue'
export { FadeSegue } from './screen/Segue.Fade'
export { SlideSegue } from './screen/Segue.Slide'
export { CoverSegue } from './screen/Segue.Cover'
export { StaticSegue } from './screen/Segue.Static'
export { SegueRegistry } from './screen/SegueRegistry'

/*
 * Dialog
 */

export { Alert } from './dialog/Alert'
export { AlertOptions } from './dialog/Alert'
export { AlertButton } from './dialog/AlertButton'
export { AlertButtonOptions } from './dialog/AlertButton'

/*
 * Data
 */

export { Data } from './data/Data'
export { DataOptions } from './data/Data'

/*
 * Application
 */

export { Application } from './application/Application'
export { ApplicationKeyboardEvent } from './application/Application'
export { ApplicationOpenResourceURLEvent } from './application/Application'
export { ApplicationOpenUniversalURLEvent } from './application/Application'

/*
 * Default animations durations / equations.
 */

import { AnimationDurationRegistry } from './view/View'
import { AnimationEquationRegistry } from './view/View'

AnimationDurationRegistry.set('slow', 750)
AnimationDurationRegistry.set('fast', 250)

AnimationEquationRegistry.set('default', [0.25, 0.1, 0.25, 1.0])
AnimationEquationRegistry.set('linear', [0.0, 0.0, 1.0, 1.0])
AnimationEquationRegistry.set('ease-in', [0.42, 0.0, 1.0, 1.0])
AnimationEquationRegistry.set('ease-out', [0.0, 0.0, 0.58, 1.0])
AnimationEquationRegistry.set('ease-in-out', [0.42, 0, 0.58, 1.0])