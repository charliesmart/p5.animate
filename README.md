[![Build Status](https://travis-ci.org/charliesmart/p5.animate.svg?branch=master)](https://travis-ci.org/charliesmart/p5.animate)

# p5.animate

This lightweight library makes it easy to get started with animations in p5.js.
It handles otherwise annoying things like timing, easing, delays, ordering, and more. All in simple syntax similar to basic p5.js.

[Download minified](https://raw.githubusercontent.com/charliesmart/p5.animate/master/src/p5.animate.min.js)

[Download un-minified](https://raw.githubusercontent.com/charliesmart/p5.animate/master/src/p5.animate.js)

## Installation

Download either the minified or un-minified version of p5.animate and add it to the index.html file of your p5 sketch using a script tag, after the tag for p5.js.

```html
<script type="text/javascript" src="/path/to/p5.js"></script>
<script type="text/javascript" src="/path/to/p5.animate.min.js"></script>
```

## Using p5.animate

Here is a basic overview of how to use p5.animate. Scroll down for full API documentation.

### Basic animation

The `animate` function is used to tween between two numbers. It requires two arguments: a string representing a unique name for the animation, and a variable containing its initial value. Its basic purpose is to tween between to values.

```javascript
var num = 100;
var currentValue = animate('myAnimation', num);
```

In this example, if the value of `num` never changes, `animate` will always return `100` (the initial value of num). However, if the value of `num` is changed to `200`, then every time `animate` is called over the next 500ms, it will return a number between `100` and `200` proportional to the time elapsed.

Here's an example of how that might work:

```javascript
var num = 0;

function draw() {

  background(255);

  // We assign the result of animation() to a new variable...
  var position = animate('myAnimation', num);

  // ...and use that variable for the x and y coordinates of a rect
  rect(position, position, 50, 50);
}

function mouseClicked() {
  // Until the mouse is clicked, animation() will alays return 0. However, here we
  // set the value of num to 100 when the mouse is clicked. Once that change is
  // made, animation() will begin returning number between 0 and 100 over the next
  // 500ms. The timing and easing can both be changed. More on that later.
  val = 100;
}
```

### Built in callbacks

`animate` can take a third argument: a callback function that handles thins like rotation, translation, scaling, and colors for you. The default callback is `NUMBER`, which just returns the current tween value. Here's an example of using the `SCALE` callback to transition scale.

```javascript
var scaleVal = 1;

function draw() {

  background(255);

  // Here, we pass a third 'SCALE' argument. This represents a callback function
  // that does the following:
  // scale(currentTweenValue);

  // Since this handles the p5 transformation for us, we don't need to assign the
  // return value to a variable.
  animate('scaleAnimation', scaleVal, SCALE);

  // When the value of scaleVal changes to 2, this will grow
  rect(0, 0, 50, 50);
}

function mouseClicked() {
  // scaleVal become 2 on click
  scaleVal = 2;
}
```

## License

This library is free to use under the MIT license. Please see [LICENSE.md](https://github.com/charliesmart/p5.animate/blob/master/LICENSE.md) for more information.

## Acknowledgments

Easing functions based on [Robert Penner's](http://robertpenner.com/easing/) easing functions.
