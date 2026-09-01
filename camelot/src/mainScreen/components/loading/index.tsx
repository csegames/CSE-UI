/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import CULogoURL from '../../../images/cu-logo-metal.png';
import UCELogoURL from '../../../images/unchained-entertainment-white-logo.png';
import PoweredByURL from '../../../images/poweredby-stacked.png';
import LoadingScreenFactionlessURL from '../../../images/loading-screens/factionless-loading-screen-bg.png';
import LoadingSpriteURL from '../../../images/spritesheet-loading.png';

import { FittingView } from '../../../shared/components/FittingView';
import { SpriteSheetAnimator } from '../../../shared/components/SpriteSheetAnimator';
import '../../LoadingScreen-Styles.scss';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralHyphen, StringIDGeneralUnnamed } from '../../helpers/stringTableHelpers';
import { ZoneInfo } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { allMapDetails } from '../../helpers/mapHelpers';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { FactionDivider } from '../FactionDivider';
import { allFactionData, getFactionData } from '../../gameData/factionData';
import { ServerMessages } from '../serverMessages/ServerMessages';

// Styles
const Root = 'LoadingScreen-Root';
const HeaderRoot = 'LoadingScreen-Header-Root';
const FooterRoot = 'LoadingScreen-Footer-Root';
const HeaderFooterContent = 'LoadingScreen-HeaderFooter-Content';
const HeaderFooterColumn = 'LoadingScreen-HeaderFooter-Column';
const ZoneImage = 'LoadingScreen-ZoneImage';
const CornerImage = 'LoadingScreen-CornerImage';
const MapName = 'LoadingScreen-MapName';
const HeaderFooterDivider = 'LoadingScreen-HeaderFooter-Divider';
const MapDescription = 'LoadingScreen-MapDescription';
const ServerMessagesIcon = 'LoadingScreen-ServerMessages';

const TriRealm = 'LoadingScreen-TriRealm';
const Trademark = 'LoadingScreen-Trademark';
const PoweredBy = 'LoadingScreen-PoweredBy';
const LoadingWrapper = 'LoadingScreen-LoadingWrapper';
const LoadingMessage = 'LoadingScreen-LoadingMessage';
const LoadingIcon = 'LoadingScreen-LoadingIcon';
const LoadingIconSizer = 'LoadingScreen-LoadingIconSizer';

// Every asset used by the LoadingScreen must be cached.
// How sad would it be if the LoadingScreen wasn't loaded when we try to show it?
const factionURLSet = new Set<string>();
allFactionData.forEach((factionData) => {
  factionURLSet.add(factionData.edgeDecorativeBottomImage);
  factionURLSet.add(factionData.edgeDecorativeTopImage);
  factionURLSet.add(factionData.backgroundFullscreenImage);
});
requestAddImagesToCache(Root, [
  CULogoURL,
  UCELogoURL,
  PoweredByURL,
  LoadingSpriteURL,
  LoadingScreenFactionlessURL,
  ...factionURLSet.values()
]);

interface ReactProps {}

interface InjectedProps {
  initCompleted: boolean;
  loadingPhase: string | null;
  stringTable: Record<string, StringTableEntryDef>;
  zoneID: string;
  zones: Record<string, ZoneInfo>;
}

type Props = ReactProps & InjectedProps;

class ALoadingScreen extends React.PureComponent<Props> {
  public render() {
    const loadingPhase = this.getLoadingPhase();
    if (!loadingPhase) {
      return null;
    }

    const zone = this.props.zones[this.props.zoneID];
    const zoneURL = allMapDetails[zone?.Name]?.loadingScreenURL ?? LoadingScreenFactionlessURL;
    const factionID = allMapDetails[zone?.Name]?.factionID ?? Faction.Factionless;
    const factionData = getFactionData(factionID);

    // We would prefer to use the string in the string table with ID "LoadingPhaseInitializing",
    // but we do not have access to string table values during initialization
    const loadingPhaseString =
      loadingPhase === 'LoadingPhaseInitializing'
        ? 'Initializing UI'
        : getStringTableValue(loadingPhase, this.props.stringTable);

    return (
      <div className={Root}>
        <FactionBorder
          className={HeaderRoot}
          factionIDOverride={factionID}
          type={BorderType.Decorative}
          background={BorderBackground.None}
          includeLeft={false}
          includeRight={false}
          includeTop={false}
          style={{ backgroundImage: `url(${factionData.backgroundFullscreenImage})`, backgroundSize: 'cover' }}
        >
          <div className={HeaderFooterContent}>
            <img className={CornerImage} src={CULogoURL} />
            {zone && (
              <div className={HeaderFooterColumn}>
                <div className={MapName} style={{ color: factionData.mailSenderColor }}>
                  {getStringTableValue(
                    allMapDetails[zone?.Name]?.nameStringID ?? StringIDGeneralUnnamed,
                    this.props.stringTable
                  )}
                </div>
                <FactionDivider className={HeaderFooterDivider} />
                <div className={MapDescription}>
                  {getStringTableValue(
                    allMapDetails[zone?.Name]?.descriptionStringID ?? StringIDGeneralHyphen,
                    this.props.stringTable
                  )}
                </div>
              </div>
            )}
            <img className={CornerImage} src={UCELogoURL} />
          </div>
        </FactionBorder>
        <img className={ZoneImage} src={zoneURL} />
        <FactionBorder
          className={FooterRoot}
          factionIDOverride={factionID}
          type={BorderType.Decorative}
          background={BorderBackground.None}
          includeLeft={false}
          includeRight={false}
          includeBottom={false}
          style={{ backgroundImage: `url(${factionData.backgroundFullscreenImage})`, backgroundSize: 'cover' }}
        >
          <div className={HeaderFooterContent}>
            <div className={PoweredBy} />
            <div className={HeaderFooterColumn}>
              <h3 className={TriRealm}>{'A TriRealm™ MMORPG'}</h3>
              <div className={Trademark}>
                {'Camelot Unchained and TriRealm are trademarks of Unchained Entertainment, LLC.'}
              </div>
            </div>
            <div className={LoadingWrapper}>
              <FittingView className={LoadingIconSizer}>
                <SpriteSheetAnimator
                  styles={LoadingIcon}
                  backgroundUrl={LoadingSpriteURL}
                  numberOfRows={15}
                  numberOfColumns={13}
                  spriteHeight={300}
                  spriteWidth={300}
                  lastFrame={195}
                />
              </FittingView>
              <h3 className={LoadingMessage}>{loadingPhaseString}</h3>
              <ServerMessages className={ServerMessagesIcon} isDragCopy={false} openTop />
            </div>
          </div>
        </FactionBorder>
      </div>
    );
  }

  private getLoadingPhase(): string | null {
    if (this.props.loadingPhase) {
      return this.props.loadingPhase;
    }
    if (!this.props.initCompleted) {
      return 'LoadingPhaseInitializing';
    }
    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { initCompleted, loadingPhase, zoneID } = state.loading;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    initCompleted,
    loadingPhase,
    stringTable,
    zoneID,
    zones: state.zones.zones
  };
}

export const LoadingScreen = connect(mapStateToProps)(ALoadingScreen);
