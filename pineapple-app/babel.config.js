module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      // The animation plugin has to be the last one
      "react-native-reanimated/plugin",
      "module:react-native-dotenv",
    ],
  };
};
