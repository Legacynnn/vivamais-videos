const React = require("react");
const { css } = require("./style.cjs");
const { withFallback } = require("./stub.cjs");

const SKIP = new Set(["pointerEvents", "onPress", "onLayout", "testID", "accessibilityLabel", "accessible", "collapsable"]);
const el = (tag) =>
  function SvgElement({ children, style, ...props }) {
    const attrs = {};
    for (const [key, value] of Object.entries(props)) if (!SKIP.has(key) && value !== undefined && typeof value !== "function" && typeof value !== "object") attrs[key] = value;
    if (props.transform && typeof props.transform === "string") attrs.transform = props.transform;
    return React.createElement(tag, { ...attrs, style: style ? css(style) : undefined }, children);
  };

const Svg = el("svg");
module.exports = withFallback({
  default: Svg,
  Svg,
  Path: el("path"),
  Circle: el("circle"),
  Ellipse: el("ellipse"),
  Rect: el("rect"),
  Line: el("line"),
  Polyline: el("polyline"),
  Polygon: el("polygon"),
  G: el("g"),
  Defs: el("defs"),
  LinearGradient: el("linearGradient"),
  RadialGradient: el("radialGradient"),
  Stop: el("stop"),
  ClipPath: el("clipPath"),
  Mask: el("mask"),
  Text: el("text"),
  TSpan: el("tspan"),
  Use: el("use"),
  Pattern: el("pattern"),
  Filter: el("filter"),
  FeGaussianBlur: el("feGaussianBlur"),
});
