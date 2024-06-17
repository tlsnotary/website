# Privacy and Scaling Explorations
Main branch served at: https://appliedzkp.org/

This is the React re-write of the PSE website, formally just a landing page.

## Get Started with Development

`npm install`

`npm run dev` serves a development server at [http://localhost:8080](http://localhost:8080)

The app live under `/app`.

## How to contribute

### Have an idea?

Create an [issue](https://github.com/AtHeartEngineering/pse_landingpage/issues/new) and tell us the idea!

### Want to contribute?

Feel free to fork this repo and make a pull request to the `dev` branch. 

### Build and deployment process

1. When a pull request or push is made to the `dev` branch, github actions builds a static/production version of the site to the `gh-pages-dev` branch.
2. Once changes have been verified on the `gh-pages-dev` branch, the `dev` branch is merged into `master` where github actions builds and deploys a production version of the site to `gh-pages`
3. `gh-pages` is served at [http://projects.appliedzkp.org](http://projects.appliedzkp.org)
