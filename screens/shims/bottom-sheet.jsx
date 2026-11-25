const React = require("react");
const RN = require("./react-native.jsx");
const { withFallback } = require("./stub.cjs");

function Sheet({ open, backgroundStyle, backdropComponent: Backdrop, handleComponent: Handle, footerComponent: Footer, style, children }) {
  if (!open) return null;
  return (
    <div className="rn-view rn-modal">
      {Backdrop ? <Backdrop animatedIndex={{ value: 0 }} animatedPosition={{ value: 0 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }} /> : null}
      <RN.View style={[{ position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "92%", borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: "hidden", backgroundColor: "#fff" }, backgroundStyle, style]}>
        {Handle === null ? null : Handle ? <Handle /> : <RN.View style={{ alignItems: "center", paddingTop: 10, paddingBottom: 6 }}><RN.View style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: "#D9D6E2" }} /></RN.View>}
        {children}
        {Footer ? <Footer animatedFooterPosition={{ value: 0 }} /> : null}
      </RN.View>
    </div>
  );
}

const BottomSheetModal = React.forwardRef(function BottomSheetModal(props, ref) {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);
  React.useImperativeHandle(ref, () => ({ present: () => setOpen(true), dismiss: close, close, forceClose: close, snapToIndex: () => setOpen(true), expand: () => setOpen(true), collapse: () => {}, snapToPosition: () => {} }));
  return <Sheet {...props} open={open} />;
});

const BottomSheet = React.forwardRef(function BottomSheet({ index = 0, ...props }, ref) {
  const [current, setCurrent] = React.useState(index);
  React.useEffect(() => setCurrent(index), [index]);
  const close = () => setCurrent(-1);
  React.useImperativeHandle(ref, () => ({ snapToIndex: setCurrent, expand: () => setCurrent(0), collapse: () => setCurrent(0), close, forceClose: close, snapToPosition: () => {} }));
  return <Sheet {...props} open={current >= 0} />;
});

const Passthrough = ({ children }) => children ?? null;
const Backdrop = ({ style, opacity = 0.5 }) => <div className="rn-view" style={{ position: "absolute", inset: 0, backgroundColor: `rgba(23,21,30,${opacity})`, ...(style ?? {}) }} />;

module.exports = withFallback({
  default: BottomSheet,
  BottomSheet,
  BottomSheetModal,
  BottomSheetManaged: React.forwardRef((props, ref) => <BottomSheet index={-1} {...props} ref={ref} />),
  BottomSheetModalProvider: Passthrough,
  BottomSheetView: RN.View,
  BottomSheetScrollView: RN.ScrollView,
  BottomSheetFlatList: RN.FlatList,
  BottomSheetTextInput: RN.TextInput,
  BottomSheetFooter: ({ children, style }) => <RN.View style={style}>{children}</RN.View>,
  BottomSheetBackdrop: Backdrop,
  useBottomSheetTimingConfigs: (config) => config,
  useBottomSheetSpringConfigs: (config) => config,
  useBottomSheet: () => ({ close: () => {}, dismiss: () => {}, snapToIndex: () => {}, expand: () => {}, collapse: () => {} }),
  useBottomSheetModal: () => ({ dismiss: () => {}, dismissAll: () => {} }),
});
