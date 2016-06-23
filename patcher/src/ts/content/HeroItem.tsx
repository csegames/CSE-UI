/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface HeroItemProps {
  content: string
}

export interface HeroItemState {
}

class HeroItem extends React.Component<HeroItemProps, HeroItemState> {

  constructor(props: HeroItemProps) {
    super(props);
  }

  render() {
    return <div dangerouslySetInnerHTML={{__html: `${this.props.content}`}}></div>;
  }
}

export default HeroItem;
