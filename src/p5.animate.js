/**
 * p5.animate.js
 * By Charlie Smart
 * twitter: @charliersmart
 * github:  charliesmart
 * web:     charliesmart.info
 */

(function(p5) {

  'use strict';

  // Object to store all animations by name
  var _animations = {};

  // Type of timing to use. Options are frames or seconds.
  var _timing = SECONDS;

  //------------------------------------------------
  // Public API
  //------------------------------------------------

  /**
   * If an animation object with the given name doesn't exist, this method calls
   * the private _newAnimation function to create one. Then it calls the
   * _runAnimation function to update the animation and return its current
   * value.
   *
   * @param  {Function} type Animation type function name.
   * @param  {String} name   Unique animation name.
   * @param  {Number} val    Current value for the animation.
   * @param  {Object} c      Optional configuration object.
   * @return {Number}        Current animation value.
   */
  p5.prototype.animate = function(name, val, type, config) {
    if(!(_animationExists(name))) {
      _newAnimation(name, val, type, config);
    }

    var val = _runAnimation(name, val);
    return val;
  };

  /**
   * Setter and getting for the _timing variable. Allows the user to set whether
   * animations are run based on seconds or frames. If no argument is passed
   * it returns the name of the current timing function. If a valid timing is
   * passed, it sets it. Otherwise, it logs an error.
   *
   * @param {Function} timing Timing function. Values are SECONDS or FRAMES
   * @return {String}  If no argument is passed, it returns the name of the current
   * timing function.
   */
  p5.prototype.animationTiming = function(timing) {
    if (arguments.length < 1) return _timing.name;

    if (timing === FRAMES || timing === SECONDS) {
      _timing = timing;
    } else {
      console.error(timing.name + ' is not a valid timing type.');
    }
  };

  /**
   * Return the object containing all current animation objects
   * @return {Object} Object containing animation objects
   */
  p5.prototype.getAnimations = function() {
    return _animations;
  }

  /**
   * Checks whether any animations are running at the end of the draw loop. If
   * they are, it keeps the loop running. If all animations are finished, it
   * calls noLoop() to stop looping.
   *
   * @return {Boolean} True if looping, false if not
   */
  p5.prototype.loopControler = function() {
    looping = false;

    for (var i = 0; i < _animations.length; i++) {
      if (_animations[i].active === true) {
        looping = true;
      }
    }

    looping === true ? loop() : noLoop();
    return looping;
  }

  // Animation type lazy function should go here

  //------------------------------------------------
  // Private helper functions
  //------------------------------------------------

  /**
   * Checks if animation of given name already exists in the _animations object.
   * Returns true if it exists and false if it does not.
   * @param  {String} name Animation name
   * @return {Boolean}     Boolean indicating whether the animation exists
   * @private
   */
  function _animationExists(name) {
    return (typeof _animations[name] !== 'undefined');
  }

  /**
   * Creates a new animation object and adds it as a key/value pair to the
   * _animations object, where the key is the animation name and the value
   * is this animation object.
   *
   * @param  {Function} type Animation type function name.
   * @param  {String} name   Unique animation name.
   * @param  {Number} val    Current value for the animation.
   * @param  {Object} c      Optional configuration object.
   * @return {Number}        Current animation value.
   * @private
   */
  function _newAnimation(name, val, type, config) {
    // Set config to an empty object if an argument is not passed
    config = config || {};

    // Create the animation object
    var animationObject = {
      type:          type || 'number',
      currentValue:  val,
      targetValue:   val,
      previousValue: val,
      origin:        config.origin       || [0, 0], //These are default values
      shapeMode:     config.shapeMode    || LINES,
      endShapeMode:  config.endShapeMode || CLOSE,
      easing:        config.easing       || OUT_QUAD,
      duration:      config.duration     || 400,
      delay:         config.delay        || 0,
      waitFor:       config.waitFor      || null,
      startTiming:     null,
      active:        false,
    };

    // Add it to _animations
    _animations[name] = animationObject;
  }

  /**
   * If animation target value has changed, update animation and return new value.
   * @param  {String} name Unique name for the animation
   * @param  {Number} val  Target value for animation
   * @return {Number}      Current value for the animation
   * @private
   */
  function _runAnimation(name, val) {
    var a = _animations[name];

    // If the a new target value has been passed, update the animations object
    // to reflect the change.
    if (val !== a.targetValue) {
      a.targetValue   = val;
      a.previousValue = a.currentValue;

      a.active = true;
      a = _setStartTiming(a);
    }

    if (a.active) {
      // If waiting for another animation to finish, run this animation with a
      // easing value of 0, which means the animation has not started.
      if (!!a.waitFor && animations[a.waitFor].active) {
        a = _setStartTiming(a);
        a.currentValue = _animationTypes[a.type](a.currentValue, a.targetValue, a.previousValue, 0);
        return a.currentValue;
      }

      var easing = _timing(a);

      a.currentValue = _animationTypes[a.type](a.currentValue, a.targetValue, a.previousValue, easing);
      if (easing >= 1) {
        a.active = false;
      }
      return a.currentValue;

    } else {
      return a.currentValue;
    }
  }

  /**
   * Set the start time of the animation to either the current time or to 0
   * frames based on the timing mode set by the user.
   *
   * @param {Object} a The animation object
   * @return {Object}  The animation object
   * @private
   */
  function _setStartTiming(a) {
    if (_timing === SECONDS) {
      a.startTiming = new Date();
    } else {
      a.startTiming = 0;
    }

    return a;
  }

  /**
   * Calculates time elapsed since animation start in seconds, accounting for
   * optional delay.
   *
   * @param {Object} a Animation Object
   * @return Current easing value
   * @private
   */
  function SECONDS(a) {

    // Check how much time has elapsed
    var currentTime = new Date(),
        timeDif     = currentTime - a.startTiming;

    // If there is a delay, return 0 until that much time elapses
    if (timeDif < a.delay) {
      return 0;
    }

    if (timeDif - a.delay >= a.duration) {
      return 1;
    }

    // Normalize the time difference to range (0, 1)
    var adjustedTimeDif = (timeDif - a.delay) / a.duration;

    // Pass the adjusted time to the current easing function and return result
    return a.easing(adjustedTimeDif);
  }

  /**
   * Calculates time elapsed since animation start in frames, accounting for
   * optional delay.
   *
   * TODO: Figure out a better naming for a.startTiming, since it isn't really
   * the start of frames. When measuring in frames, it keeps track of frames
   * elapsed. Mabybe split them into two seperate properties?
   *
   * @param {Object} a Animation Object
   * @return Current easing value
   * @private
   */
  function FRAMES(a) {
    // If there is a delay, return 0 until that many frame elapse
    if (a.startTiming < a.delay) {
      return 0;
    }

    if (timeDif - delay >= a.duration) {
      return 1;
    }

    // Normalize the time elapsed frames to range (0, 1)
    var adjustedFrameDif = (a.startTiming - a.delay) / a.duration;

    // Pass the adjusted time to the current easing function and return result
    return a.easing(adjustedTimeDif);
  }

  //------------------------------------------------
  // Animation types
  //------------------------------------------------

  var _animationTypes = {}

  _animationTypes.number = function(c, t, p, e) {
    return p + (t - p) * e;
  }

  //------------------------------------------------
  // Easing functions
  //------------------------------------------------

  function LINEAR(t)       { return t }
  function IN_QUAD(t)      { return t * t }
  function OUT_QUAD(t)     {return t * (2 - t)}
  function IN_OUT_QUAD(t)  { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t}
  function IN_CUBIC(t)     { return t * t * t }
  function OUT_CUBIC(t)    { return (--t) * t * t + 1 }
  function IN_OUT_CUBIC(t) { return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }
  function IN_QUART(t)     { return t * t * t * t }
  function OUT_QUART(t)    { return 1 - (--t) * t * t }
  function IN_OUT_QUART(t) { return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }
  function IN_QUINT(t)     { return t * t * t * t * t }
  function OUT_QUINT(t)    { return 1 + (--t) * t * t * t * t }
  function IN_OUT_QUINT(t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }

})(p5);
