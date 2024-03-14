import * as React from 'react';

const Container = 'GenericToaster-Container';
const Title = 'GenericToaster-Title';
const Description = 'GenericToaster-Description';

interface Props {
  title: string;
  description: string;
}

export class GenericToaster extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Container}>
        <div className={Title}>{this.props.title}</div>
        <div className={Description}>{this.props.description}</div>
      </div>
    );
  }
}
