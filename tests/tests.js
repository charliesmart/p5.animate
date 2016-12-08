describe('animationTiming([type])', {
  it('returns "SECONDS" when called first without an argument.', function() {
    expect(
      animationTiming();
    ).toEqual('SECONDS');
  });

  it('returns "FRAMES" when called without an argument after being called with argument FRAMES', function() {
    animationTiming(FRAMES);
    expext(
      animationTiming();
    ).toEqual('FRAMES');
  });
});
