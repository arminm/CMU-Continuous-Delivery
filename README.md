# Fantastic4 SSNoC

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


![](https://s-media-cache-ak0.pinimg.com/236x/d9/8a/99/d98a99d92253adf6c694e014ea3ee9af.jpg)

## To install bower

Run `$sudo npm install -g bower`. Since bower needs admin permission, its not included in package.json.

## Run the app

1. You must execute `$ npm install` and `$ bower install` to make sure you have all the library dependencies to run the app. ( We are using npm for back-end dependencies and bower for front-end dependencies. Note that node_modules and public/libs/ folders are ignored by git.)

2. Execute DB={dev, prod, test} npm start for starting the server in the appropriate mode.

## Run tests

1. Run the server in test mode.

2. Execute npm test 
