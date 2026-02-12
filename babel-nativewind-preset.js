/**
 * NativeWind v4 Babel preset without react-native-worklets/plugin.
 * The original preset from nativewind/babel includes
 * react-native-worklets/plugin for Reanimated 4+, but this app uses
 * Reanimated 3.x, so we define the preset manually.
 */
module.exports = function nativewindPreset() {
  return {
    plugins: [
      require('react-native-css-interop/dist/babel-plugin').default,
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
          importSource: 'react-native-css-interop',
        },
      ],
      // Note: react-native-worklets/plugin is intentionally NOT included
      // as it's for Reanimated 4+ and this app uses Reanimated 3.x
    ],
  };
};
