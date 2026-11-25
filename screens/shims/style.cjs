const UNITLESS_PX = new Set(["lineHeight"]);
const DROP = new Set(["elevation", "borderCurve", "tintColor", "shadowColor", "shadowOffset", "shadowOpacity", "shadowRadius", "includeFontPadding", "textAlignVertical", "fontVariant", "writingDirection", "pointerEvents", "overlayColor", "resizeMode", "objectFit", "experimental_backgroundImage"]);
const RENAME = { paddingStart: "paddingLeft", paddingEnd: "paddingRight", marginStart: "marginLeft", marginEnd: "marginRight", start: "left", end: "right", borderStartWidth: "borderLeftWidth", borderEndWidth: "borderRightWidth", borderTopStartRadius: "borderTopLeftRadius", borderTopEndRadius: "borderTopRightRadius", borderBottomStartRadius: "borderBottomLeftRadius", borderBottomEndRadius: "borderBottomRightRadius" };
const PAIR = { paddingHorizontal: ["paddingLeft", "paddingRight"], paddingVertical: ["paddingTop", "paddingBottom"], marginHorizontal: ["marginLeft", "marginRight"], marginVertical: ["marginTop", "marginBottom"], inset: ["top", "right", "bottom", "left"], insetInline: ["left", "right"], insetBlock: ["top", "bottom"] };

function flatten(style) {
  if (!style) return {};
  if (typeof style === "function") return {};
  if (Array.isArray(style)) return Object.assign({}, ...style.map(flatten));
  return style;
}

const unit = (value) => (typeof value === "number" ? `${value}px` : value);

function transform(list) {
  if (typeof list === "string") return list;
  return list
    .flatMap((entry) => Object.entries(entry))
    .map(([name, value]) => {
      if (name === "matrix") return `matrix(${value.join(",")})`;
      if (/^(translate|perspective)/.test(name)) return `${name}(${unit(value)})`;
      if (/^(rotate|skew)/.test(name)) return `${name}(${typeof value === "number" ? `${value}rad` : value})`;
      return `${name}(${value})`;
    })
    .join(" ");
}

function rgba(color, opacity) {
  const hex = typeof color === "string" && /^#[0-9a-f]{6}$/i.test(color) ? color.slice(1) : null;
  if (!hex) return color ?? "rgba(0,0,0,0.2)";
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r},${g},${b},${opacity})`;
}

function css(input) {
  const style = flatten(input);
  const out = {};
  for (const [rawKey, value] of Object.entries(style)) {
    if (value === undefined || value === null || typeof value === "function") continue;
    if (typeof value === "object" && !Array.isArray(value) && rawKey !== "shadowOffset") continue;
    const key = RENAME[rawKey] ?? rawKey;
    if (DROP.has(key)) continue;
    if (PAIR[key]) for (const side of PAIR[key]) out[side] ??= value;
    else if (key === "transform") out.transform = transform(value);
    else if (key === "flex" && typeof value === "number") out.flex = value > 0 ? `${value} 1 0%` : value === 0 ? "0 0 auto" : "0 1 auto";
    else if (UNITLESS_PX.has(key)) out[key] = unit(value);
    else if (key === "fontWeight") out.fontWeight = String(value);
    else if (key === "aspectRatio") out.aspectRatio = String(value);
    else if (key === "transformOrigin" && Array.isArray(value)) out.transformOrigin = value.map(unit).join(" ");
    else out[key] = value;
  }
  if (style.shadowOpacity && !out.boxShadow) {
    const offset = style.shadowOffset ?? { width: 0, height: 0 };
    out.boxShadow = `${offset.width ?? 0}px ${offset.height ?? 0}px ${style.shadowRadius ?? 0}px ${rgba(style.shadowColor, style.shadowOpacity)}`;
  }
  return out;
}

module.exports = { css, flatten };
