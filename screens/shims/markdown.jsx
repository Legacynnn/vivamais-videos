const React = require("react");
const RN = require("./react-native.jsx");
const { withFallback } = require("./stub.cjs");

function inline(text, style) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <RN.Text key={index} style={style.strong}>
        {part.slice(2, -2)}
      </RN.Text>
    ) : (
      part
    )
  );
}

function Markdown({ children, style = {} }) {
  const blocks = String(children ?? "").trim().split(/\n{2,}/);
  return (
    <RN.View>
      {blocks.map((block, index) => {
        const margin = { marginTop: index ? 10 : 0 };
        const items = block.split("\n").filter((line) => /^\s*[-*] /.test(line));
        if (items.length && items.length === block.split("\n").length)
          return (
            <RN.View key={index} style={[style.bullet_list, margin]}>
              {items.map((line, item) => (
                <RN.Text key={item} style={[style.body, style.list_item]}>
                  {"• "}
                  {inline(line.replace(/^\s*[-*] /, ""), style)}
                </RN.Text>
              ))}
            </RN.View>
          );
        const heading = block.match(/^(#{1,3}) (.*)/);
        if (heading) return <RN.Text key={index} style={[style.body, style[`heading${heading[1].length}`]]}>{inline(heading[2], style)}</RN.Text>;
        return (
          <RN.Text key={index} style={[style.body, style.paragraph, margin]}>
            {inline(block, style)}
          </RN.Text>
        );
      })}
    </RN.View>
  );
}

module.exports = withFallback({ default: Markdown, Markdown, MarkdownIt: () => ({}) });
