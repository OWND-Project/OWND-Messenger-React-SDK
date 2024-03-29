![OWND Project Logo](https://raw.githubusercontent.com/OWND-Project/.github/main/media/ownd-project-logo.png)

# OWND Project

The OWND Project is a non-profit project that aims to realize more trustworthy communication through the social implementation of individual-centered digital identities.

This project was created as part of the "Trusted Web" use case demonstration project promoted by the Digital Market Competition Headquarters, Cabinet Secretariat.

We will develop a white-label digital identity wallet that complies with international standards and a federated messaging application that supports E2E encryption as open source software, and discuss governance to ensure trust.

[OWND Project Briefing Material](https://github.com/OWND-Project/.github/blob/main/profile/ownd-project.pdf)

[Learn more about Trusted Web](https://trustedweb.go.jp/)

## Project List

### Digital Identity Wallet
- [OWND Wallet Android]()
- [OWND Wallet iOS]()

### Issuance of Verifiable Credentials
- [OWND Project VCI]()

### Messaging Services
- [OWND Messenger Server]()
- [OWND Messenger Client]()
- [OWND Messenger React SDK]()
  - It is a product of this repository.


# About the OWND Messenger React sdk setup

This repository is developed based on matrix-react-sdk. Please also check the README on the matrix-react-sdk side for module structure and development guidelines, if necessary.

https://github.com/matrix-org/matrix-react-sdk

If the development of the OWND Project reaches prosperity or in view of the situation of feature divergence from the upstream repository, we intend to define our own guidelines .


## Development

Ensure you have the latest LTS version of Node.js installed.

Using `yarn` instead of `npm` is recommended. Please see the Yarn 1 [install
guide](https://classic.yarnpkg.com/docs/install) if you do not have it
already. This project has not yet been migrated to Yarn 2, so please ensure
`yarn --version` shows a version from the 1.x series.

This module depends on
[`matrix-js-sdk`](https://github.com/matrix-org/matrix-js-sdk). To make use of
changes in the latter and to ensure tests run against the develop branch of
`matrix-js-sdk`, you should set up `matrix-js-sdk`:

```bash
git clone https://github.com/matrix-org/matrix-js-sdk
cd matrix-js-sdk
git checkout 0c7342cb20c51d049997597b5b96de1744bd7b66 # Workaround: We have not yet confirmed support for codes newer than this version.
yarn link
yarn install
```

Then check out this repository and pull in dependencies:

```bash
git clone https://github.com/datasign-inc/matrix-react-sdk
cd matrix-react-sdk
git checkout develop
yarn link matrix-js-sdk
yarn install
```

See the [help for `yarn link`](https://classic.yarnpkg.com/docs/cli/link) for
more details about this.

### Running tests

Ensure you've followed the above development instructions and then:

```bash
yarn test
```

### Running lint

To check your code complies with the project style, ensure you've followed the
above development instructions and then:

```bash
yarn lint
```

### Dependency problems

If you see errors (particularly "Cannot find module") running the lint or test
commands, and `yarn install` doesn't fix them, it may be because
yarn is not fetching git dependencies eagerly enough.

Try running this:

```bash
yarn cache clean && yarn install --force
```

Now the yarn commands should work as normal.

### End-to-End tests

We use Cypress and Element Web for end-to-end tests. See
[`docs/cypress.md`](docs/cypress.md) for more information.
