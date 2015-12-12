# EoY-Worldmap

Run index.html. Hovers now working!

Known issues/needed fixes: <br>
1. Format play button <br>
2. Play animation still accelerates and decelerates <br>
3. Play animation should be pause-able <br>
4. Text wrapping for city descriptions <br>
5. Format slider scale <br>
6. Styling issues: certain fonts, colors don't seem to be working right <br>
7. Heading as per Owen's design

# Deploying

* Install [Homebrew](http://brew.sh/) `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
* Install [NVM](https://github.com/creationix/nvm) `brew install nvm`
* Install [Node 5](https://nodejs.org/en/) `nvm install 5 && nvm alias default 5`
* Install node modules `npm install`
* Copy a .env file from the .env.example `cp .env.example .env`
* Open the .env and fill in the keys (ask someone on #web Slack or pull them from another app `heroku config --app=positron-production | grep S3`)
* Run the deploy script `npm run deploy`
