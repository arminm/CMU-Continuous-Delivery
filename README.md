# Fantastic4 SSNoC [![Circle CI](https://circleci.com/gh/cmusv-fse/FSE-F15-SA5-SSNoC/tree/master.svg?style=svg&circle-token=08f4da2fb946d2334b3e4a7d9417f6cdb26beed7)](https://circleci.com/gh/cmusv-fse/FSE-F15-SA5-SSNoC/tree/master)

A Survivable Social Network on a Chip!

## GitHub

PLEASE create a new branch for your work and avoid working on the master branch.

You can use `$ git checkout -b NAME_OF_NEW_BRANCH` when on `master` to create a new branch.

Before you commit anything, make sure you're on the right branch (Check with `$ git branch`) and then commit and push. 

When pushing your changes, use: `$ git push origin NAME_OF_YOUR_BRANCH`

## Database

We use `db-migrate` to *create* and update the schema of the database.
(if you don't have `db-migrate` installed globally, you can run `$ npm install -g db-migrate`)

1. Creating the database: `$ db-migrate db dev` for development or `$ db-migrate db production` for production. `$ db-migrate db test` is also available for testing purposes. (You can find these in `database.json`)

2. Migrating Up/Down: `$ db-migrate up` will build your database tables, and `down` will reverse it. If you are adding new migrations, make sure you test `down` as well by `$ db-migrate down -c 1` (which goes down 1 step).

3. Creating Migrations: `$ db-migrate create [name of migration]` (e.g. `$ db-migrate create add-user` or `$ db-migrate create update-message`)

More info on `db-migrate`: [Documentation](http://db-migrate.readthedocs.org/en/latest/), [GitHub](https://github.com/db-migrate/node-db-migrate)

## To install bower

Run `$sudo npm install -g bower`. Since bower needs admin permission, its not included in package.json.

## Run the app

1. You must execute `$ npm install` and `$ bower install` to make sure you have all the library dependencies to run the app. ( Use option 5 when asked during bower install. We are using npm for back-end dependencies and bower for front-end dependencies. Note that node_modules and public/libs/ folders are ignored by git.)

2. Execute `$ DB={dev, prod, test} npm start` for starting the server in the appropriate mode.

## Run tests

1. Run the server in test mode.

2. Execute `$ npm test` 

## Maintenance mode

Maintenance mode is added for performance testing to lock down the server and allow only 1 user to send API calls with an `access_key`. Here's how it works:

1. *TURN ON*: "Lock" the server by sending: `POST /maintenance?access_key=<user's username>` (e.g. POST /maintenance?access_key=armin`)

2. *USE*: Make ANY call *BUT* provide `access_key=<user's username>` as a query parameter! (e.g. `GET /users?access_key=armin`)

3. *TURN OFF*: "Unlock" the server by sending: `DELETE /maintenance?access_key=<user's username>` and server will go back to normal service.

NOTE: When the server is locked, only the calls with the right `access_key` will go through. All other calls will get a `503` status (for unavailable) and a rendered `maintenance.jade` page.


![](https://s-media-cache-ak0.pinimg.com/236x/d9/8a/99/d98a99d92253adf6c694e014ea3ee9af.jpg)
