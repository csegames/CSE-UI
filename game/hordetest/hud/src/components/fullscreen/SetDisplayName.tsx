/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useRef } from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { webAPI } from '@csegames/library/lib/hordetest';

import { Button } from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 500;
  text-transform: uppercase;
  font-family: Colus;
  color: white;
  text-align: center;
  margin-bottom: 40px;
`;

const ErrorText = styled.div`
  font-size: 22px;
  margin-top: 20px;
  text-align: center;
  font-style: italic;
  color: #ff3300;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

const ButtonStyles = css`
  width: fit-content;
  height: fit-content;
  margin: 40px 10px 0 10px;
  font-size: 22px;
  padding: 15px;
`;

const Input = styled.input`
  height: 25px;
  width: 200px;
  background-color: black;
  margin: 2px;
  border: 0;
  padding: 20px 20px;
  outline: none;
  border: 2px solid #4D4D4D;
  border-color: #4D4D4D;
  color: white;
  transition: border-color 0.2s;
  font-size: 1.2em;

  &:focus {
    border-color: #52CFFD;
  }
`;

const Cancel = styled.a`
  font-size: 1.1em;
  color: #acacac;
`;

const query = gql`
{
  myUser {
    id
    created
    lastLogin
  	displayName
    backerLevel
  }
}
`;

export function SetDisplayName(props: {}) {
  const [state, setState] = useState({
    waitingOnRequest: false,
    lastError: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  async function setDisplayname() {
    const wantName = inputRef.current.value;
    try {
      setState(s => ({
        ...s,
        waitingOnRequest: true,
      }));
      var result = await webAPI.DisplayNameAPI.SetDisplayName(webAPI.defaultConfig, wantName);
      if (result.ok) {
        // done, we'll close this.
        setTimeout(() => {
          setState({
            waitingOnRequest: false,
            lastError: '',
          });
          game.trigger('hide-middle-modal');
        }, 500);
      } else {
        let lastError = 'An unknown error occurred, please try again.'
        try {
          lastError = result.json<any>().FieldCodes[0].Message
        } catch {}
        setState(s => ({
          ...s,
          waitingOnRequest: false,
          lastError,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <GraphQL query={{ query }}>
      {(graphql: GraphQLResult<any>) => {
        const name = graphql && graphql.data && graphql.data.myUser.displayName;
        return (
          <Container>
            <Title>Choose Your Name</Title>
              <Input ref={inputRef} type='text' name='display-name' placeholder={name} />
              <ErrorText>{state.lastError}</ErrorText>
              <ButtonsContainer>
                <Button disabled={state.waitingOnRequest} text='Continue' type='blue' onClick={setDisplayname} styles={ButtonStyles} />
              </ButtonsContainer>
              {name && <Cancel href='#' onClick={() => game.trigger('hide-middle-modal')}>cancel</Cancel>}
          </Container>
        );
      }}
    </GraphQL>
  );
}

