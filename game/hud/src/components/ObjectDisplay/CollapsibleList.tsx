import * as React from 'react';
import styled from 'react-emotion';
import { toTitleCase } from '@csegames/camelot-unchained/lib/utils/textUtils';

import { States, DataMapper } from './types';
import ObjectDisplay from '.';

const Container = styled('div')`
`;

const Indicator = styled('span')`
  margin-right: 4px;
`;

const Title = styled('div')`
  font-size: 1.1em;
  padding: 5px;
  cursor: pointer;
  text-align: left;
  background-color: #111;
  border-top: 1px solid #444;
  margin-bottom: 4px;
  z-index: 1;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.5);
  &:hover {
    background-color: #1a1a1a;
  }
`;

const Content = styled('div')(
  {
    '::-webkit-scrollbar': {
      width: '5px',
      backgroundColor: '#111',
    },
    '::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
    '::-webkit-scrollbar-thumb': {
      backgroundColor: '#555',
      borderRadius: '5px',
    },
  },
  (props: { collapsed: boolean }) => {
    if (props.collapsed) {
      return {
        display: 'none',
      };
    } else {
      return {
        display: 'block',
      };
    }
  },
);

const Item = styled('div')`
  border-bottom: 1px solid #666;
  background: #1a1a1a;
  > div {
    margin-left: 22px;
  }
  &:before {
    float: left;
    content: '['attr(data-index)']';
    padding: 2px;
    font-size: 0.9em;
  }
`;

const Count = styled('span')`
  float: right;
  font-size: .9em;
  &:before {
    content: '[';
  }
  &:after {
    content: ']';
  }
`;

const Warn = styled('span')`
  color: orange;
  margin: 0px 5px;
`;

export interface Props {
  data: any;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  keyName: string;
  fullKey: string;
}

class CollapsibleList extends React.Component<Props, { collapsed: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }
  public render() {
    if (this.props.data == null) return null;

    // any warnings? -- check if any status are not online and put a warning on the title
    let warnings = false;
    if (this.props.dataMapping) {
      for (let i = 0; i < this.props.data.length; ++i) {
        const data = this.props.data[i];
        const keys = Object.keys(data);
        keys.forEach((key) => {
          const mapping = this.props.dataMapping && this.props.dataMapping[this.props.fullKey + '.' + key];
          if (mapping === 'status' || typeof mapping === 'object' && mapping.type === 'status') {
            const status = this.props.statusMapper && this.props.statusMapper(data[key]);
            if (status !== 'online') {
              warnings = true;
            }
          }
        });
        if (warnings) break;
      }
    }

    return (
      <Container collapsed={this.state.collapsed}>
        <Title
          onClick={this.toggleCollapsed}
          collapsed={this.state.collapsed}
        >
          <Indicator>{this.state.collapsed ? '+' : '-'}</Indicator>
          {toTitleCase(this.props.keyName)}
          {warnings ? <Warn><i className='fas fa-exclamation-triangle'></i></Warn> : null }
          <Count>{this.props.data.length}</Count>
        </Title>
        <Content collapsed={this.state.collapsed}>
          {
            this.props.data && this.props.data.map && this.props.data.map((item: any, index: number) => (
              <Item
                data-index={index}
                key={`${this.props.fullKey}[${index}]`}
              >
                <ObjectDisplay
                  data={item}
                  parentKey={this.props.fullKey}
                  dataMapping={this.props.dataMapping}
                  statusMapper={this.props.statusMapper}
                  key={index}
                />
              </Item>
            ))
          }
        </Content>
      </Container>
    );
  }

  private toggleCollapsed = () => {
    this.setState(state => ({ collapsed: !state.collapsed }));
  }
}

export default CollapsibleList;
