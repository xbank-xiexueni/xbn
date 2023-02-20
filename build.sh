# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "master" ]; then  # Run the "production" script in `package.json` on the "production" branch  # "production" should be replaced with the name of your Production branch
  yarn build:production

else  # Else run the dev script  npm run devfi
  yarn build:staging

fi