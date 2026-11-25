const RN = require("./react-native.jsx");
const { withFallback } = require("./stub.cjs");

const shared = (initial) => {
  const box = { value: initial, get: () => box.value, set: (next) => void (box.value = typeof next === "function" ? next(box.value) : next), addListener() {}, removeListener() {}, modify() {} };
  return box;
};
const attempt = (fn, fallback) => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

function interpolate(value, input, output, extrapolate) {
  const clamp = extrapolate === "clamp" || extrapolate?.extrapolateLeft === "clamp" || extrapolate === 1;
  let i = 1;
  while (i < input.length - 1 && value > input[i]) i += 1;
  let t = (value - input[i - 1]) / (input[i] - input[i - 1] || 1);
  if (clamp) t = Math.min(1, Math.max(0, t));
  return output[i - 1] + (output[i] - output[i - 1]) * t;
}

const identity = (value) => value;
const Animated = { View: RN.View, Text: RN.Text, ScrollView: RN.ScrollView, Image: RN.Image, FlatList: RN.FlatList, createAnimatedComponent: identity };

module.exports = withFallback({
  default: Animated,
  ...Animated,
  createAnimatedComponent: identity,
  useSharedValue: shared,
  useDerivedValue: (fn) => shared(attempt(fn, 0)),
  useAnimatedStyle: (fn) => attempt(fn, {}),
  useAnimatedProps: (fn) => attempt(fn, {}),
  useAnimatedRef: () => ({ current: null }),
  useAnimatedScrollHandler: () => () => {},
  useAnimatedReaction: () => {},
  useScrollViewOffset: () => shared(0),
  useScrollOffset: () => shared(0),
  useReducedMotion: () => true,
  useAnimatedKeyboard: () => ({ height: shared(0), state: shared(0) }),
  withTiming: identity,
  withSpring: identity,
  withDecay: () => 0,
  withDelay: (_, value) => value,
  withRepeat: identity,
  withSequence: (...values) => values[values.length - 1],
  cancelAnimation: () => {},
  runOnJS: identity,
  runOnUI: identity,
  interpolate,
  interpolateColor: (_, __, output) => output[0],
  Extrapolation: { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" },
  ReduceMotion: { System: "system", Always: "always", Never: "never" },
  makeMutable: shared,
});
