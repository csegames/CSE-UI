import * as React from 'react';
import styled from 'react-emotion';

import { States, DataMapper } from './types';
import ObjectDisplay from '.';

const Container = styled('section')`
`;

const Title = styled('div')`
  font-size: 1.1em;
  padding: 5px;
  text-align: left;
  background-color: #111;
  border-top: 1px solid #444;
  margin-bottom: 4px;
  z-index: 1;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.5);
  cursor: pointer;
`;

const Indicator = styled('span')`
  float: left;
  margin: 0px 5px;
`;

export interface Props {
  data: any;
  fullKey: string;
  dataMapping?: DataMapper;
  statusMapper?: (value: any) => States;
  title: string;
}

export interface State {
  collapsed: boolean;
}

class StatusObject extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }
  public render() {
    return (
      <Container>
        <Title
          onClick={this.toggleCollapsed}
        >
          <Indicator>{this.state.collapsed ? '+' : '-'}</Indicator>
          {this.props.title.toTitleCase()}
        </Title>
        {
          this.state.collapsed ? null :
          <ObjectDisplay
            data={this.props.data}
            parentKey={this.props.fullKey}
            dataMapping={this.props.dataMapping}
            statusMapper={this.props.statusMapper}
          />
        }
      </Container>
    );
  }

  private toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
}

export default StatusObject;
