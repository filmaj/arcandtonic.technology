# arcandtonic.technology

This is an example app that uses the [arc.codes] serverless framework together
with the [tonic.technology] JS frontend framework. It also blatantly steals the
`.mjs` loading approach from [@kristoferjoseph](https://github.com/kristoferjoseph)'s
[arc-example-templates](github.com/kristoferjoseph/arc-example-templates) project
for use inside [arc.codes] apps.

## Requirements

- node.js

## Getting Started

    npm install
    npm start

... then load the url it tells you.

## Tests

To run the linter: `npm run lint`.

To run the end-to-end tests, your system must have the latest Chrome browser
installed and you must run `npm install` first. Then run `npm run
test:integration`.

To run both of the above tasks, run `npm test`.

[arc.codes]: https://arc.codes
[tonic.technology]: https://tonic.technology
