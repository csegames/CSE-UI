/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { Dispatch } from 'redux';
import { hideOverlay, Overlay } from '../../redux/navigationSlice';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../helpers/stringTableHelpers';

const Container = 'CreditsScreen-Container';
const ContainerBg = 'CreditsScreen-ContainerBg';
const Ray = 'CreditsScreen-Ray';
const CreditsText = 'CreditsScreen-CreditsText';
const SubTitle = 'CreditsScreen-SubTitle';
const Item = 'CreditsScreen-Item';
const Role = 'CreditsScreen-Role';
const HideButtonPosition = 'CreditsScreen-HideButtonPosition';
const Thanker = 'CreditsScreen-Thanker';
const SingleLineItem = 'CreditsScreen-SingleLineItem';
const CreditsTextDelayed = 'CreditsScreen-CreditsTextDelayed';

const Rune = 'CreditsScreen-Rune';

const StringIDCreditsTeamTitle = 'CreditsTeamTitle';
const StringIDCreditsLeftTitle = 'CreditsLeftTitle';
const StringIDCreditsTestersTitle = 'CreditsTestersTitle';
const StringIDCreditsSpecialThanksTitle = 'CreditsSpecialThanksTitle';
const StringIDCreditsBabiesTitle = 'CreditsBabiesTitle';
const StringIDCreditsMarkThanksTitle = 'CreditsMarkThanksTitle';
const StringIDCreditsHide = 'CreditsHide';

interface ReactProps {}
interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface CreditPerson {
  name: string;
  role: string;
}

const people: CreditPerson[] = [
  { name: 'Alex Arnot', role: 'Co-Lead Designer' },
  { name: 'Andrew Beck', role: 'Internal Systems Administrator' },
  { name: 'Andrew Davies', role: 'QA Tester' },
  { name: 'Anna Luu', role: 'Director of HR' },
  { name: 'Anthony Sermania', role: 'Engineer' },
  { name: 'Arman Jornoush', role: 'Character Artist' },
  { name: 'Brady Jessup', role: 'Junior Client Engineer' },
  { name: 'Brian Ward', role: 'Senior OPS/QA/CM' },
  { name: 'Bull Durham', role: 'Senior Tools Engineer' },
  { name: 'Chris Douglas', role: 'Senior 3D Environment Artist' },
  { name: 'Christina Carr', role: 'Lead Gameplay Engineer' },
  { name: 'Colin Sipherd', role: 'Senior Networking Engineer' },
  { name: 'David Szilagyi', role: 'Concept Artist' },
  { name: 'Derek Glissman-Thomas', role: 'Level Designer' },
  { name: 'Drew Beck', role: 'IT Engineer' },
  { name: 'Eben Schumacher', role: 'Concept Artist' },
  { name: 'Elizabeth Lowry', role: 'Tools Engineer' },
  { name: 'Evan Norton', role: 'Junior UI Engineer' },
  { name: 'Evan Wang', role: '3D Artist' },
  { name: 'George Davison', role: 'Technical Director' },
  { name: 'Ian Schmidt', role: 'Junior UI Engineer' },
  { name: 'James Koo', role: 'Lead UI Artist' },
  { name: 'James Sweazea', role: 'Junior Engineer' },
  { name: 'Jane Morgan', role: 'Associate Producer' },
  { name: 'Jason Ely', role: 'Senior Server Engineer' },
  { name: 'Jeff Maisonneuve', role: 'Animator/Rigger' },
  { name: 'Jesse Dilts', role: 'Senior UI Engineer' },
  { name: 'Joe Janca', role: 'Lead Animator' },
  { name: 'Jon Young', role: 'Lead Modeler' },
  { name: 'Just A. Bear', role: 'Game Director' },
  { name: 'Kaitlyn Burkhart', role: 'Associate Producer' },
  { name: 'Karl Patrick', role: 'Senior Server Engineer' },
  { name: 'Ken Webster', role: 'Lead Audio Designer/Producer' },
  { name: 'Lou Andreev', role: 'Rendering Architect' },
  { name: 'Mark Jacobs', role: 'CEO/Creative Director' },
  { name: 'Michael Naumov', role: 'Gameplay Engineer' },
  { name: 'Michelle Davies', role: 'Art Director/Lead Concept Artist' },
  { name: 'Mike Barr', role: 'Senior Producer' },
  { name: 'Mike Crossmire', role: 'Senior VFX Artist' },
  { name: 'Mike Dickheiser', role: 'Senior Engineer' },
  { name: 'Nathan Huft', role: '3D Prop Artist' },
  { name: 'Rob Argue', role: 'Senior Server Engineer' },
  { name: 'Robert Baltzer', role: 'Environment Artist' },
  { name: 'Sandra Pavulaan', role: 'Animator' },
  { name: 'Scott Trolan', role: 'Animator' },
  { name: 'Sean Siemens', role: 'Senior Server Engineer' },
  { name: 'Ted Bigham', role: 'Senior Engineer' },
  { name: 'Tim Mills', role: 'Lead DevOps/Senior Engineer' },
  { name: 'Travis Parsley', role: 'Community Manager' },
  { name: 'Tuan Bui', role: 'Senior Tools Engineer' },
  { name: 'Walt Rieker', role: 'QA Tester' },
  { name: 'Wen Lin', role: 'Concept Artist' },
  { name: 'Will Blankenship', role: 'Senior Tools Engineer' },
  { name: 'Wylie Rea', role: 'Client Engineer' }
];

interface CreditSubPerson {
  name: string;
  role: string;
}

const peopleLeft: CreditSubPerson[] = [
  { name: 'Andrew Jackson', role: 'Frontend UI Engineer' },
  { name: 'Andrew Meggs', role: 'CTO/Lead Software Architect' },
  { name: 'Andrew Phelan', role: 'Modeler' },
  { name: 'Arne Michaelsen', role: 'Engineer' },
  { name: 'Ash Kain', role: 'Producer' },
  { name: 'Ben Pielstick', role: 'Co-Lead Designer' },
  { name: 'Brad Hallisey', role: 'Senior Engineer' },
  { name: 'Brys Sepulveda', role: 'Senior Server Engineer' },
  { name: 'Caleb Fisher', role: 'Gameplay Engineer' },
  { name: 'Charles Ribemont', role: 'Senior Web Administrator' },
  { name: 'Charlotte Racioppo', role: 'Associate Producer' },
  { name: 'Cheyne Anderson', role: 'Client and Pipeline Engineer' },
  { name: 'Christopher Junior', role: 'Designer' },
  { name: 'Cory Demerau', role: 'Junior Engineer' },
  { name: 'Daniel Beck', role: 'Lead Audio Designer/Producer' },
  { name: 'Daniel Murker', role: 'Senior Engineer' },
  { name: 'David Hancock', role: 'Engineer' },
  { name: 'Dionne Phua', role: 'Artist' },
  { name: 'Elvin Hernandez', role: 'Illustrator' },
  { name: 'Gabe Ortega', role: 'Engineer' },
  { name: 'James Brown', role: 'Senior UI/Web Engineer' },
  { name: 'Jon Farinelli', role: 'Producer' },
  { name: 'Joseph Burrage', role: 'Modeler/Material Artist' },
  { name: 'Judd Cohen', role: 'Gameplay Engineer' },
  { name: 'Kara Stover', role: 'Jr. Creative Director' },
  { name: 'Lee Wilson', role: 'Senior Engineer' },
  { name: 'Marc Hernandez', role: 'Senior Server Engineer' },
  { name: 'Mark Chae', role: 'Server Ops Engineer' },
  { name: 'Matt Fleming', role: 'Designer' },
  { name: 'Matt Meehan', role: 'Senior Engineer' },
  { name: 'Matthew Lauritzen', role: 'Senior Gameplay Engineer' },
  { name: 'Max Porter', role: 'Co-writer/Editor' },
  { name: 'Michael Jacobs', role: 'Lead QA Tester' },
  { name: 'Mike Waver', role: 'Modeler' },
  { name: 'Ryan Alemania', role: 'Senior Designer' },
  { name: 'Samantha Ng', role: 'Producer' },
  { name: 'Scout Rigney', role: 'Artist' },
  { name: 'Sierra Boyette', role: 'Modeler' },
  { name: 'Terry Coleman', role: 'Senior Producer' },
  { name: 'Tina Fulton', role: 'Concept Artist' },
  { name: 'Tyler Rockwell', role: 'Environmental Artist/Content Manager' }
];

const testers: string[] = [
  'Apollon (Lord of Translations & Discord Denoiser)',
  'Dirtcarver',
  'DonnieT',
  'Drakzon',
  'FreK',
  'iog',
  'Joe Zimmerman',
  'Matthew Shannon',
  'MongrelSun',
  'Player <Faelords>',
  'RealLifeGobbo',
  'Rytmo',
  'Salidry',
  'Taledhar',
  'Treville (Master Builder, Destroyer of the Norse, Lord of All Cubes, Annihilator of Arthurians, Giver of Names!)',
  'Umbar',
  'UnknownRH',
  'zhewMatt "Nomos" Lust'
];

interface SpecialThanks {
  name: string;
  thanker: string;
}

const specialThanks: SpecialThanks[] = [
  { name: 'My Wife, Lizzy, and our Crimelord of a Cat, Gimble', thanker: 'Andrew B.' },
  { name: 'Rachel', thanker: 'Anthony S.' },
  { name: 'Brittany, Mom & Dad, for all your love and support', thanker: 'Brady J.' },
  { name: 'Julia, Reyes, Devin', thanker: 'Brian W' },
  { name: 'Ali, Fletcher, Maris, and Mark', thanker: 'Charles “Bull” D.' },
  { name: 'Helen, Dad & Mom, Franco & Lesley, Chris, Emily & Paul, and Tuna and Minnow', thanker: 'Dave S.' },
  { name: 'Oona', thanker: 'Evan N.' },
  { name: 'Gloria, Madelyn, Mason, and Miles', thanker: 'James K.' },
  { name: 'Simone, Bro, Scott, Adriane, Bill, Mister Blank, Mom & Dad', thanker: 'James S.' },
  { name: 'Emilia for her love and support, and Wyrm for all the fuzz', thanker: 'Jane M.' },
  { name: 'Beth, Titus and Ayana', thanker: 'Jeff M.' },
  { name: 'Goaty McGoatface (in memoriam)', thanker: 'Jesse D.' },
  { name: 'Jenny, Elsa, Megan, and Daisy', thanker: 'Karl P.' },
  { name: 'Noelle and Mom, for your tremendous support all these years!', thanker: 'Ken W.' },
  { name: 'Ami, Paula, Elyse, Sups, thank you for everything!', thanker: 'Lou A.' },
  { name: 'Michael, Kobe, Sydney - for your playtesting, feedback, and endless ideas!', thanker: 'Mike D.' },
  { name: 'Mama & Tato', thanker: 'Mike N.' },
  { name: 'Stella, Mom & Dad', thanker: 'Nathan H.' },
  { name: 'Taylor, Nolan, and Teddard', thanker: 'Rob A.' },
  { name: 'Lizzy, Addie, and Pat', thanker: 'Scott T.' },
  { name: 'Katharine, Ma & Pa, JP, Dillon, Gregory, Katie, Xan, and the Womacks', thanker: 'Travis P.' },
  { name: 'My parents, Selena', thanker: 'Wen L.' },
  {
    name: 'Ayaka, Momo, Lily, Sue & Jeff, Kyoko & Yuji Shibayama, and Riku; for all your love and support over the years!',
    thanker: 'Will B.'
  }
];

const babies: string[] = ['Amelia', 'Joshua', 'Mason & Miles', 'Nolan', 'Rowan'];

const markThanks: string[] = [
  'James Dunstan',
  'Andrew L. Farkas',
  'Gary Fuhrman',
  'Janet, Michael, and Bo Jacobs',
  'Karen J. Lauder',
  'William P. Lauder',
  'Michael Margarite',
  'Neil Shapiro',
  '',
  'And a thank you to all of our investors, big and small, who have believed in us over the years!',
  '',
  'And, last but certainly not least, an enormous thank you to all of our amazing people (and those that',
  'supported them) who, because of their hard work, dedication, and effort, made Unchained',
  'Entertainment possible.  Whether they are still with Unchained or not, I thank them all for their',
  'contributions and I wish them nothing but the best now and in the future!!!',
];

class ACreditsScreen extends React.Component<Props> {
  public render() {
    // credits are split into a delayed and non-delayed block
    // this is because putting them in one giant list causes display issues at high resolutions where
    // some of the elements stretch vertically
    return (
      <div className={Container}>
        <div className={HideButtonPosition}>
          <Button
            type={'double-border'}
            text={getStringTableValue(StringIDCreditsHide, this.props.stringTable)}
            onClick={this.hideCreditsScreen.bind(this)}
            disabled={false}
          />
        </div>
        <div className={ContainerBg}>
          <div className={`${Ray} ray1`} />
          <div className={`${Ray} ray2`} />
          <div className={`${Ray} ray3`} />
          <div className={`${Ray} ray4`} />

          <div className={CreditsText}>
            <div className={SubTitle}>{getStringTableValue(StringIDCreditsTeamTitle, this.props.stringTable)}</div>
            {this.getTeamMembers()}
            <div className={SubTitle}>{getStringTableValue(StringIDCreditsLeftTitle, this.props.stringTable)}</div>
            {this.getLeftMembers()}            
          </div>

          <div className={CreditsTextDelayed}>
            <div className={SubTitle}>{getStringTableValue(StringIDCreditsTestersTitle, this.props.stringTable)}</div>
            {this.getTesters()}
            <div className={SubTitle}>
              {getStringTableValue(StringIDCreditsSpecialThanksTitle, this.props.stringTable)}
            </div>
            {this.getSpecialThanks()}
            <div className={SubTitle}>{getStringTableValue(StringIDCreditsBabiesTitle, this.props.stringTable)}</div>
            {this.getBabies()}
            <div className={SubTitle}>
              {getStringTableValue(StringIDCreditsMarkThanksTitle, this.props.stringTable)}
            </div>
            {this.getMarkThanks()}
          </div>

          <div className={`${Rune} rune1`}>1</div>
          <div className={`${Rune} rune2`}>2</div>
          <div className={`${Rune} rune3`}>3</div>
          <div className={`${Rune} rune4`}>4</div>
          <div className={`${Rune} rune5`}>5</div>
          <div className={`${Rune} rune6`}>6</div>
          <div className={`${Rune} rune7`}>7</div>
          <div className={`${Rune} rune8`}>8</div>
          <div className={`${Rune} rune9`}>9</div>
        </div>
      </div>
    );
  }

  private getMarkThanks(): JSX.Element[] {
    return markThanks.map((thanks) => {
      return <div className={SingleLineItem}>{thanks}</div>;
    });
  }

  private getBabies(): JSX.Element[] {
    return babies
      .sort((a, b) => a.localeCompare(b))
      .map((baby) => {
        return <div className={SingleLineItem}>{baby}</div>;
      });
  }

  private getSpecialThanks(): JSX.Element[] {
    return specialThanks
      .sort((a, b) => a.thanker.localeCompare(b.thanker))
      .map((specialThank) => {
        return (
          <div className={SingleLineItem}>
            {specialThank.name}
            <span className={Thanker}> –{specialThank.thanker}</span>
          </div>
        );
      });
  }

  private getTesters(): JSX.Element[] {
    return testers
      .sort((a, b) => a.localeCompare(b))
      .map((tester) => {
        return <div className={SingleLineItem}>{tester}</div>;
      });
  }

  private getLeftMembers(): JSX.Element[] {
    return peopleLeft
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((peopleLeft) => {
        return (
          <div className={Item}>
            {peopleLeft.name}
            <div className={Role}>{peopleLeft.role}</div>
          </div>
        );
      });
  }

  private getTeamMembers(): JSX.Element[] {
    return people
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((person) => {
        return (
          <div className={Item}>
            {person.name}
            <div className={Role}>{person.role}</div>
          </div>
        );
      });
  }

  private hideCreditsScreen() {
    this.props.dispatch(hideOverlay(Overlay.Credits));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const CreditsScreen = connect(mapStateToProps)(ACreditsScreen);
