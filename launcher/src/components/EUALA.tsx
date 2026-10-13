import React from 'react';

const EUALARoot = 'EUALA-Root';

export class EUALA extends React.Component {
  public render(): React.ReactNode {
    return (
      <div className={EUALARoot}>
        <div>
          <a href='https://www.unchained-entertainment.com/euala' target='_blank'>
            Unchained Entertainment End User Access and Licence Agreement
          </a>
        </div>
        <div>
          <a href='https://www.unchained-entertainment.com/privacy' target='_blank'>
            Unchained Entertainment Privacy Policy
          </a>
        </div>
      </div>
    );
  }
}
