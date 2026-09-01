# Sample Chat

This is a single-page web application that demonstrates how to correctly use the UCE chat v3 servers. There are a number of features that are currently unimplemented, including muting and moderation tools. The system also uses a channel selection box instead of parsing the chat line for room changes like our actual client does; this was a decision made to speed up implementation of the sample.

## Installation

1. Go to the `library/` folder in the terminal
2. Run `npm ci`
3. Go to the `samplechat/` folder in the terminal
4. Run `npm ci`

## Refreshing the generated protocl

1. Go to the `library/` folder in the terminal
2. Run `npm run gen:chat -- <base server url, e.g. https://chat.hatchery.camelotunchained.com>`

## Building

1. Go to the `library/` folder in the terminal
2. Run `npm pack`
3. Go to the `samplechat/` folder in the terminal
4. Run `npm run build`

## Running

1. Go to the `samplechat/` folder in the terminal
2. Copy `sample.env` to `.env`
3. Update `.env` to target the correct servers
4. Run `npm run start` to start a local web server
5. Use your OS browser to navigate to `http://localhost:9080/dist/index.html`
