/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-31 15:19:10
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-31 15:20:08
 */

export default {

  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    padding: '10px',
    borderBottom: '2px solid #777',
  },

  list: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflowY: 'scroll',
  },

  listHeader: {
    display: 'flex',
    color: '#777',
    fontWeight: 'bold',
    minHeight: '2em',
    padding: '5px',
  },

  listSection: {
    display: 'flex',
    padding: '5px',
    minHeight: '2em',
    ':nth-child(even)': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  },

  item: {
    flex: '1 1 auto',
    margin: '0 5px',
  },


  // modifiers for elements
  name: {
    minWidth: '100px',
  },

  rank: {
    maxWidth: '200px',
  },

  joined: {
    maxWidth: '150px',
  },

  more: {
    maxWidth: '10px',
    cursor: 'pointer',
    flex: '0 0 auto'
  },
};
