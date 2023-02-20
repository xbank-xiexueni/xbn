# !/bin/bash

if [ "$CF_PAGES_BRANCH" == "production" ]; then  # Run the "production" script in `package.json` on the "production" branch  # "production" should be replaced with the name of your Production branch
  yarn build --mode production

else  # Else run the dev script  npm run devfi
  yarn build --mode staging

fi