const path = require('path');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');
const { withNativeWind } = require('nativewind/metro');

const projectRoot = __dirname;
const config = getSentryExpoConfig(projectRoot, { includeWebReplay: false });

const STUB = path.join(projectRoot, 'webcap/stub.js');
const NATIVE_ONLY = [/^react-native-pdf/, /^react-native-maps/, /^@whereby\.com\//, /^react-native-onesignal/, /^onesignal-/, /^@react-native-google-signin\//, /^react-native\/Libraries\//];
const prev = config.resolver.resolveRequest;
config.resolver.resolveRequest = (ctx, name, platform) => {
  if (platform === 'web' && NATIVE_ONLY.some((re) => re.test(name))) return { type: 'sourceFile', filePath: STUB };
  return prev ? prev(ctx, name, platform) : ctx.resolveRequest(ctx, name, platform);
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
