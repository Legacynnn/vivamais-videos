const React = require("react");
const { css, flatten } = require("./style.cjs");
const { withFallback } = require("./stub.cjs");

const FRAME = { width: 402, height: 874, scale: 3, fontScale: 1 };
const InText = React.createContext(false);
const cx = (...names) => names.filter(Boolean).join(" ");
const state = { pressed: false, hovered: false, focused: false };
const resolve = (value) => (typeof value === "function" ? value(state) : value);

function domProps({ testID, nativeID, id, accessibilityLabel, "aria-label": aria, accessibilityRole, role }) {
  return { "data-testid": testID, id: nativeID ?? id, "aria-label": accessibilityLabel ?? aria, role: accessibilityRole ?? role };
}

function useNode(forwarded, onLayout) {
  const node = React.useRef(null);
  const handler = React.useRef(onLayout);
  handler.current = onLayout;
  React.useImperativeHandle(forwarded, () => {
    const el = node.current;
    if (!el) return null;
    const rect = () => el.getBoundingClientRect();
    el.measure ??= (callback) => {
      const box = rect();
      callback(el.offsetLeft, el.offsetTop, box.width, box.height, box.left, box.top);
    };
    el.measureInWindow ??= (callback) => {
      const box = rect();
      callback(box.left, box.top, box.width, box.height);
    };
    el.measureLayout ??= (_, callback) => el.measure(callback);
    el.scrollTo ??= () => {};
    el.scrollToEnd ??= () => {};
    el.setNativeProps ??= () => {};
    return el;
  });
  React.useLayoutEffect(() => {
    const el = node.current;
    if (!el || !handler.current) return undefined;
    const report = () => {
      const box = el.getBoundingClientRect();
      handler.current?.({ nativeEvent: { layout: { x: el.offsetLeft, y: el.offsetTop, width: box.width, height: box.height } } });
    };
    report();
    const observer = new ResizeObserver(report);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return node;
}

const View = React.forwardRef(function View({ className, style, children, onLayout, onPress, disabled, ...rest }, ref) {
  const node = useNode(ref, onLayout);
  const onClick = onPress && !disabled ? () => onPress({ nativeEvent: {} }) : undefined;
  return (
    <div ref={node} className={cx("rn-view", className)} style={css(resolve(style))} onClick={onClick} {...domProps(rest)}>
      {resolve(children)}
    </div>
  );
});

const Text = React.forwardRef(function Text({ className, style, children, numberOfLines, onLayout, ...rest }, forwarded) {
  const ref = useNode(forwarded, onLayout);
  const nested = React.useContext(InText);
  const clamp = numberOfLines ? { display: "-webkit-box", WebkitLineClamp: numberOfLines, WebkitBoxOrient: "vertical", overflow: "hidden" } : null;
  const Tag = nested ? "span" : "div";
  return (
    <Tag ref={ref} className={cx(nested ? "rn-text-in" : "rn-text", className)} style={{ ...css(style), ...clamp }} {...domProps(rest)}>
      <InText.Provider value={true}>{children}</InText.Provider>
    </Tag>
  );
});

const ScrollView = React.forwardRef(function ScrollView({ className, style, contentContainerStyle, contentContainerClassName, horizontal, children, onLayout, onContentSizeChange, ...rest }, forwarded) {
  const ref = useNode(forwarded, onLayout);
  return (
    <div ref={ref} className={cx("rn-view rn-scroll", horizontal && "rn-row", className)} style={css(style)} {...domProps(rest)}>
      <div className={cx("rn-view rn-scroll-content", horizontal && "rn-row", contentContainerClassName)} style={css(contentContainerStyle)}>
        {children}
      </div>
    </div>
  );
});

function source(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return source(value[0]);
  return value.uri ?? value.default ?? undefined;
}

const FIT = { cover: "cover", contain: "contain", stretch: "fill", center: "none", fill: "fill", "scale-down": "scale-down", none: "none" };

function objectPosition(value) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  const x = value.left ?? (value.right != null ? `right ${value.right}` : "50%");
  const y = value.top ?? (value.bottom != null ? `bottom ${value.bottom}` : "50%");
  return `${typeof x === "number" ? `${x}px` : x} ${typeof y === "number" ? `${y}px` : y}`;
}

function Image({ className, style, source: src, resizeMode, contentFit, contentPosition, onLoad, onLoadEnd, onError, ...rest }) {
  const flat = flatten(style);
  const fit = FIT[contentFit ?? resizeMode ?? flat.resizeMode ?? flat.objectFit ?? "cover"];
  const url = source(src);
  if (!url) return <div className={cx("rn-view", className)} style={css(style)} {...domProps(rest)} />;
  // An absolutely pinned <img> keeps its natural size in CSS, unlike RN, so stretch it explicitly.
  const pinned = flat.position === "absolute";
  const size = {
    ...(pinned && flat.width == null && flat.left != null && flat.right != null ? { width: "100%" } : {}),
    ...(pinned && flat.height == null && flat.top != null && flat.bottom != null ? { height: "100%" } : {}),
  };
  return <img className={cx("rn-image", className)} style={{ ...size, ...css(style), objectFit: fit, objectPosition: objectPosition(contentPosition) }} src={url} alt="" onLoad={(event) => { onLoad?.({ nativeEvent: { source: { width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight } } }); onLoadEnd?.(); }} onError={() => { onError?.({ nativeEvent: { error: "failed" } }); onLoadEnd?.(); }} {...domProps(rest)} />;
}

function TextInput({ className, style, value, defaultValue, placeholder, placeholderTextColor, secureTextEntry, multiline, ...rest }) {
  const text = value ?? defaultValue ?? "";
  const shown = text ? (secureTextEntry ? "•".repeat(String(text).length) : text) : placeholder;
  return (
    <div className={cx("rn-text rn-input", multiline && "rn-input-multi", className)} style={{ ...css(style), ...(text ? null : { color: placeholderTextColor ?? "#A29FB0" }) }} {...domProps(rest)}>
      {shown}
    </div>
  );
}

function Switch({ value, trackColor, thumbColor, style }) {
  const track = value ? (trackColor?.true ?? "#7E3BED") : (trackColor?.false ?? "#E6E4EC");
  return (
    <div className="rn-view" style={{ width: 51, height: 31, borderRadius: 16, backgroundColor: track, padding: 2, ...css(style) }}>
      <div style={{ width: 27, height: 27, borderRadius: 14, backgroundColor: thumbColor ?? "#fff", marginLeft: value ? 20 : 0, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function ActivityIndicator({ size, color = "#7E3BED", style }) {
  const px = size === "large" ? 36 : typeof size === "number" ? size : 20;
  return <div className="rn-view" style={{ width: px, height: px, borderRadius: px, border: `2px solid ${color}`, borderTopColor: "transparent", ...css(style) }} />;
}

const Modal = ({ visible = true, children }) => (visible ? <div className="rn-view rn-modal">{children}</div> : null);
const Nothing = () => null;
const noop = () => {};
const subscription = { remove: noop };
const absoluteFillObject = { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 };

module.exports = withFallback({
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground: ({ children, source: src, style, className }) => (
    <div className={cx("rn-view", className)} style={{ ...css(style), backgroundImage: `url(${source(src)})`, backgroundSize: "cover" }}>
      {children}
    </div>
  ),
  TextInput,
  Switch,
  ActivityIndicator,
  Modal,
  Pressable: View,
  TouchableOpacity: View,
  TouchableWithoutFeedback: ({ children }) => children,
  TouchableHighlight: View,
  SafeAreaView: View,
  KeyboardAvoidingView: View,
  FlatList: ({ data = [], renderItem, keyExtractor, ListHeaderComponent, ListFooterComponent, ListEmptyComponent, ...rest }) => {
    const part = (C) => (!C ? null : React.isValidElement(C) ? C : <C />);
    return (
      <ScrollView {...rest}>
        {part(ListHeaderComponent)}
        {data.length ? data.map((item, index) => <React.Fragment key={keyExtractor ? keyExtractor(item, index) : index}>{renderItem({ item, index })}</React.Fragment>) : part(ListEmptyComponent)}
        {part(ListFooterComponent)}
      </ScrollView>
    );
  },
  RefreshControl: Nothing,
  StatusBar: Object.assign(() => null, { setBarStyle: noop, setHidden: noop, setBackgroundColor: noop, setTranslucent: noop, pushStackEntry: noop, popStackEntry: noop, currentHeight: 0 }),
  StyleSheet: { create: (styles) => styles, flatten, hairlineWidth: 0.5, absoluteFill: absoluteFillObject, absoluteFillObject, compose: (a, b) => [a, b] },
  Platform: { OS: "ios", Version: 18, isPad: false, select: (options) => options.ios ?? options.native ?? options.default },
  Dimensions: { get: () => FRAME, addEventListener: () => subscription },
  PixelRatio: { get: () => 3, getFontScale: () => 1, roundToNearestPixel: (n) => Math.round(n * 3) / 3, getPixelSizeForLayoutSize: (n) => n * 3 },
  useWindowDimensions: () => FRAME,
  useColorScheme: () => "light",
  Appearance: { getColorScheme: () => "light", addChangeListener: () => subscription },
  I18nManager: { isRTL: false },
  Alert: { alert: noop },
  Linking: { openURL: noop, canOpenURL: async () => false, addEventListener: () => subscription },
  Keyboard: { dismiss: noop, addListener: () => subscription },
  BackHandler: { addEventListener: () => subscription },
  AppState: { currentState: "active", addEventListener: () => subscription },
  AccessibilityInfo: { isReduceMotionEnabled: async () => true, addEventListener: () => subscription, announceForAccessibility: noop },
  InteractionManager: { runAfterInteractions: () => ({ cancel: noop }) },
  LayoutAnimation: { configureNext: noop, Presets: {} },
  processColor: (color) => color,
});
