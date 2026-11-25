const React = require("react");
const RN = require("./react-native.jsx");
const { css } = require("./style.cjs");
const { withFallback, deep } = require("./stub.cjs");

const INSETS = { top: 59, bottom: 34, left: 0, right: 0 };
const noop = () => {};

function SafeAreaView({ edges, style, className, children, ...rest }) {
  const all = !edges;
  const pad = { paddingTop: all || edges.includes("top") ? INSETS.top : 0, paddingBottom: all || edges.includes("bottom") ? INSETS.bottom : 0 };
  return (
    <RN.View className={className} style={[pad, style]} {...rest}>
      {children}
    </RN.View>
  );
}

function LinearGradient({ colors = [], locations, start = { x: 0.5, y: 0 }, end = { x: 0.5, y: 1 }, style, className, children, ...rest }) {
  const angle = (Math.atan2(end.x - start.x, start.y - end.y) * 180) / Math.PI;
  const stops = colors.map((color, i) => (locations ? `${color} ${locations[i] * 100}%` : color)).join(", ");
  return (
    <div className={["rn-view", className].filter(Boolean).join(" ")} style={{ ...css(style), backgroundImage: `linear-gradient(${angle}deg, ${stops})` }} data-testid={rest.testID}>
      {children}
    </div>
  );
}

const router = { push: noop, replace: noop, back: noop, navigate: noop, dismiss: noop, dismissAll: noop, dismissTo: noop, setParams: noop, canGoBack: () => true, canDismiss: () => true, prefetch: noop };
const params = () => globalThis.__vmsFixture?.params ?? {};
const Passthrough = ({ children }) => children ?? null;

const idle = { data: undefined, error: null, isLoading: false, isPending: false, isFetching: false, isError: false, isSuccess: true, isRefetching: false, isFetched: true, status: "success", fetchStatus: "idle", refetch: async () => ({}), fetchNextPage: noop, hasNextPage: false, isFetchingNextPage: false };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function answer(options = {}) {
  const fixture = globalThis.__vmsFixture ?? {};
  const key = options.queryKey ?? [];
  const hit = (fixture.queries ?? []).find((entry) => same(key.slice(0, entry.key.length), entry.key));
  (globalThis.__vmsQueryLog ??= new Map()).set(JSON.stringify(key), Boolean(hit));
  if (!hit) return fixture.loading ? { ...idle, isLoading: true, isPending: true, isSuccess: false, status: "pending" } : idle;
  return { ...idle, data: options.select ? options.select(hit.data) : hit.data };
}

function answerInfinite(options) {
  const result = answer({ ...options, select: undefined });
  const data = result.data === undefined ? { pages: [], pageParams: [] } : result.data.pages ? result.data : { pages: [result.data], pageParams: [undefined] };
  return { ...result, data: options?.select ? options.select(data) : data };
}

const mutation = { mutate: noop, mutateAsync: async () => ({}), reset: noop, isPending: false, isError: false, isSuccess: false, isIdle: true, status: "idle", data: undefined, error: null, variables: undefined };
const client = { invalidateQueries: async () => {}, setQueryData: noop, getQueryData: () => undefined, prefetchQuery: async () => {}, cancelQueries: async () => {}, removeQueries: noop, refetchQueries: async () => {}, resetQueries: async () => {}, clear: noop };

module.exports = {
  safeArea: withFallback({
    SafeAreaView,
    SafeAreaProvider: Passthrough,
    useSafeAreaInsets: () => INSETS,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 402, height: 874 }),
    initialWindowMetrics: { insets: INSETS, frame: { x: 0, y: 0, width: 402, height: 874 } },
  }),
  linearGradient: withFallback({ LinearGradient, default: LinearGradient }),
  expoImage: withFallback({ Image: RN.Image, ImageBackground: RN.ImageBackground, default: RN.Image }),
  expoRouter: withFallback({
    router,
    useRouter: () => router,
    useNavigation: () => ({ ...router, setOptions: noop, addListener: () => noop, goBack: noop, getParent: () => null, getState: () => ({ routes: [], index: 0 }), isFocused: () => true }),
    useLocalSearchParams: params,
    useGlobalSearchParams: params,
    usePathname: () => globalThis.__vmsFixture?.pathname ?? "/",
    useSegments: () => [],
    useFocusEffect: noop,
    useIsFocused: () => true,
    Link: ({ children }) => children ?? null,
    Redirect: () => null,
    Stack: Object.assign(Passthrough, { Screen: () => null }),
    Tabs: Object.assign(Passthrough, { Screen: () => null }),
    Slot: Passthrough,
  }),
  query: withFallback({
    useQuery: answer,
    useSuspenseQuery: answer,
    useInfiniteQuery: answerInfinite,
    useQueries: ({ queries = [] } = {}) => queries.map(answer),
    useMutation: () => mutation,
    useQueryClient: () => client,
    useIsFetching: () => 0,
    useIsMutating: () => 0,
    QueryClient: class {
      constructor() {
        Object.assign(this, client);
      }
    },
    QueryClientProvider: Passthrough,
    keepPreviousData: (previous) => previous,
    queryOptions: (options) => options,
    skipToken: Symbol("skipToken"),
  }),
  nativewind: withFallback({ cssInterop: (component) => component, remapProps: (component) => component, useColorScheme: () => ({ colorScheme: "light", setColorScheme: noop, toggleColorScheme: noop }), vars: (values) => values, styled: (component) => component }),
  uitextview: withFallback({ UITextView: RN.Text, default: RN.Text }),
  keyboard: withFallback({ KeyboardAwareScrollView: RN.ScrollView, KeyboardAvoidingView: RN.View, KeyboardStickyView: RN.View, KeyboardProvider: Passthrough, useKeyboardHandler: noop, useReanimatedKeyboardAnimation: () => ({ height: { value: 0, get: () => 0 }, progress: { value: 0, get: () => 0 } }) }),
  gesture: withFallback({ GestureHandlerRootView: RN.View, GestureDetector: Passthrough, ScrollView: RN.ScrollView, FlatList: RN.FlatList, Pressable: RN.View, Gesture: deep }),
  legendList: withFallback({ LegendList: RN.FlatList, AnimatedLegendList: RN.FlatList, default: RN.FlatList }),
  generic: withFallback({}),
};
