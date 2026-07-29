module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { unstable_transformImportMeta: true }],
    ],
    plugins: [
      "expo-router/babel",
      // If you use reanimated, keep it LAST:
      // "react-native-reanimated/plugin",
    ],
  };
};
