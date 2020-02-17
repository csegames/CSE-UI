/**
 * Get rids of the missing requestAnimationFrame polyfill warning.
 *
 * @link https://reactjs.org/docs/javascript-environment-requirements.html
 * @copyright 2004-present Facebook. All Rights Reserved.
 */

import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import '@csegames/library/lib/_baseGame';
import '@csegames/library/lib/hordetest';

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

// global._devGame = {
//   trigger: () => {},
//   isPublicBuild: true,
//   graphQL: {
//     query,
//     subscribe,
//     host: graphQLHost,
//     defaultOptions: defaultGraphQLOptions,
//   },
// }

// global.game = {
//   ...global._devGame,
// };

// function graphQLHost() {
//   return '/graphql';
// }

// function defaultGraphQLOptions() {
//   return {
//     url: '',
//     requestOptions: {
//       headers: {
//         Authorization: 'Bearer ' + '',
//         CharacterID: '',
//       },
//     },
//   };
// }
