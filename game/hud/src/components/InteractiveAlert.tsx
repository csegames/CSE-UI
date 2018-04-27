/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// import * as React from 'react';
// import { IGroupInvite, client } from '@csegames/camelot-unchained';
// // import { StyleSheet } from 'aphrodite';
// // import { merge } from 'lodash';
// // import * as className from 'classnames';

// import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
// import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
// import { CUQuery, CUSubscription } from '@csegames/camelot-unchained/lib/graphql';

// // import Slider from './Slider';
// // import { acceptInvite, declineInvite } from '../services/session/invites';

// // const defaultStyle: InteractiveAlertStyle = {
// //   container: {
// //     position: 'fixed',
// //     top: '0',
// //     width: '500px',
// //     height: '100px',
// //     marginLeft: '-250px',
// //     left: '50%',
// //     background: '#646464',
// //   },

// //   message: {
// //     textAlign: 'center',
// //     padding: '10px',
// //     color: '#ececec',
// //   },

// //   invite: {

// //   },

// //   button: {
// //     cursor: 'pointer',
// //     display: 'inline-block',
// //     position: 'relative',
// //     width: '120px',
// //     height: '32px',
// //     lineHeight: '32px',
// //     borderRadius: '2px',
// //     fontSize: '0.9em',
// //     backgroundColor: '#fff',
// //     color: '#646464',
// //     transition: 'box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
// //     transitionDelay: '0.2s',
// //     boxShadow: '0 2px 5px 0 rgba(0, 0, 0, 0.26)',
// //   },

// //   acceptButton: {
// //     backgroundColor: '#4285f4',
// //     color: '#fff',
// //   },

// //   declineButton: {

// //   },

// // };


// export interface InteractiveAlertStyle {
//   container: React.CSSProperties;
//   message: React.CSSProperties;
//   invite: React.CSSProperties;
//   button: React.CSSProperties;
//   acceptButton: React.CSSProperties;
//   declineButton: React.CSSProperties;
// }

// export interface Alert {
//   render: () => any;
// }

// export default (props: {
//   dispatch: (action: any) => any;
//   invites: IGroupInvite[];
//   style?: Partial<InteractiveAlertStyle>;
// }) => {

//   // const ss = StyleSheet.create(merge(defaultStyle, props.style || {}));

//   // const alerts: Alert[] = [];

//   // if (props.invites && props.invites.length > 0) {
//   //   props.invites.forEach((i) => {
//   //     alerts.push({
//   //       render: () => {
//   //         return (
//   //           <div className={css(ss.invite)}>
//   //             <h6>{i.ForGroup} has invited you to a {groupType[i.ForGroup]}.</h6>
//   //             <em>Invite code: {i.Code}</em>
//   //             <div className={className(css(ss.button, ss.acceptButton))}
//   //               onClick={() => props.dispatch(acceptInvite(i))}>
//   //               Accept
//   //             </div>
//   //             <div
//   //               className={className(css(ss.button), css(ss.declineButton))}
//   //               onClick={() => props.dispatch(declineInvite(i))}>
//   //               Decline
//   //             </div>
//   //           </div>
//   //         );
//   //       },
//   //     });
//   //   });
//   // }

//   // if (alerts.length === 0) return <div style={{ display: 'none' }}></div>;

//   return (
//     <GraphQL
//       query={`
//         {
//           myInteractiveAlerts {
//             category
//             targetID
//             ... on TradeAlert {
//               otherEntityID
//               otherName
//               kind
//             }
//           }
//         }
//       `}
//       subscription={{
//         query: `
//           subscription {
//             interactiveAlerts {
//               category
//               targetID
//               ... on TradeAlert {
//                 otherEntityID
//                 otherName
//                 kind
//               }
//             }
//           }`,
//         url: `${client.webAPIHost}/graphql`.replace('http', 'ws'),
//         initPayload: {
//           shardID: client.shardID,
//           loginToken: client.loginToken,
//           characterID: client.characterID,
//         },
//       }}
//       subscriptionHandler={(result: SubscriptionResult<Pick<CUSubscription, 'interactiveAlerts'>>,
//                             data: Pick<CUQuery, 'myInteractiveAlerts'>) => {
//         console.log(JSON.stringify(result));
//         if (result.data && result.data.interactiveAlerts) {
//           const alerts = data.myInteractiveAlerts || [];
//           alerts.push(result.data.interactiveAlerts);
//           return alerts;
//         }
//         return data;
//       }}
//     >
//       { (result: GraphQLResult<Pick<CUQuery, 'myInteractiveAlerts'>>) => (
//         <div style={{ display: 'none' }}></div>
//         // <div className={css(ss.container)}>
//         //   <Slider>
//         //     {alerts.map((a: Alert, index: number) => {
//         //       return (
//         //         <div className={css(ss.message)} key={`alert_${index}`}>
//         //           {a.render()}
//         //         </div>
//         //       );
//         //     })}
//         //   </Slider>
//         // </div>
//       )
//       }
//     </GraphQL>
//   );
// };
