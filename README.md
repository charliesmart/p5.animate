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

The `animate` function requires two arguments: a string representing a unique name for the animation, and a variable containing its initial value. At this point, `animate` will just return the value of its second argument.

When the value of `animate`'s second argument changes, it will begin returning values transitioning between the previous value of the argument and the new value. Here's a simple example:

```javascript
var val = 0;

function draw() {

  background(255);

  // We assign the result of animation() to a new variable...
  var animationVal = animation('myAnimation', val);

  // ...and use that variable for the x and y coordinates of a rect
  rect(animationVal, animationVal, 50, 50);
}

function mouseClicked() {
  // On click, the value of val is set to 100. The animation will begin tweening, and
  // animationVal will smoothly increment between 0 and 100 every time the draw loop
  // runs. The default time for this is 500 milliseonds.
  val = 100;
}
```


## License

This library is free to use under the MIT license. Please see [LICENSE.md](https://github.com/charliesmart/p5.animate/blob/master/LICENSE.md) for more information.

## Acknowledgments

Easing functions based on [Robert Penner's](http://robertpenner.com/easing/) easing functions.
