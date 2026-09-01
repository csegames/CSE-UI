import * as React from 'react';
import { Credentials, logOut } from '../redux/authSlice';
import { Link } from './utils/Link';

import logo from '../images/UCE_logo.png';

import './Header.css';
import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { clearData } from '../redux/dataSlice';

interface Props {
  credentials: Credentials | null;
}

class AHeader extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    const { credentials } = this.props;
    const isAuthed = credentials != null;

    const renderVersion = (): React.ReactNode => {
      return <span className='version'>v{process.env.VERSION}</span>;
    };

    return (
      <div id='header'>
        <span className='title'>
          <img src={logo} /> UCE Sample Chat
        </span>
        {renderVersion()}
        {isAuthed && (
          <>
            <span className='screenName'>{credentials?.screenName}</span>
            <Link onClick={this.doLogOut.bind(this)} content='Logout' />
          </>
        )}
      </div>
    );
  }

  doLogOut(): void {
    this.props.dispatch(logOut());
    this.props.dispatch(clearData());
  }
}

const mapStateToProps = (state: RootState): Props => {
  const { credentials } = state.auth;
  return {
    credentials
  };
};

export const Header = connect(mapStateToProps)(AHeader);
