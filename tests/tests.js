describe('animationTiming([type])', function() {
  it('returns "SECONDS" when called first without an argument.', function() {
    var timing = animationTiming();
    expect(timing).toEqual('SECONDS');
  });

  it('returns "FRAMES" when called without an argument after being called with argument FRAMES', function() {
    animationTiming(FRAMES);
    var timing = animationTiming();
    expect(timing).toEqual('FRAMES');
  });

  it('does not change timing when invalid argument is passed', function() {
    animationTiming(SECONDS);
    var timing = animationTiming();
    expect(timing).toEqual('SECONDS');

    // Set to invalid value
    animationTiming(QWERTY);
    var timing = animationTiming();
    expect(timing).toEqual('SECONDS');
  })
});
