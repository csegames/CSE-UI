import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';
import * as CONFIG from './config';

export const Button = styled('div')`
  ${CSS.ALLOW_MOUSE}
  text-align: center;
  text-transform: uppercase;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
  margin: 0 3px;
  font-size: 9px;
  background-image: url(images/settings/button-off.png);
  font-family: 'Caudex', serif;
  letter-spacing: 2px;
  position: relative;
  background-size: 100% 100%;
  &:hover {
    color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
    background-image: url(images/settings/button-on.png);
    ::before {
      content: '';
      position: absolute;
      background-image: url(images/settings/button-glow.png);
      width: 100%;
      height: 100%;
      left: 1px;
      background-size: cover;
    }
  }
`;
