# EoY-Worldmap

# Deploying

* Install [Homebrew](http://brew.sh/) `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* Install [NVM](https://github.com/creationix/nvm) `brew install nvm`
* Install [Node 5](https://nodejs.org/en/) `nvm install 5 && nvm alias default 5`
* Install node modules `npm install`
* Copy a .env file from the .env.example `cp .env.example .env`
* Open the .env and fill in the keys (ask someone on #web Slack or pull them from another app `heroku config --app=positron-production | grep S3`)
* Run the deploy script `npm run deploy`
