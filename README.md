# team-corner-vue

> Team Corner Frontend

Team corner is a tool to upload, view and analyse hurling stats data generated from the popular statistics app Statapult.

## Pre-requisites

Requires the backend keystone application to be up and running https://github.com/murphypetercl/team-corner-keystone. To connect, set the VUE_APP_BACKEND_GRAPHQL environment variable.

Requires a MongoDB database.

Set environment variables to specify your club and team e.g.
```
VUE_APP_ORGANIZATION="My GAA Club"
VUE_APP_TEAM="My Team"
```

## Build Setup

``` bash
# install dependencies
npm install

# Start application
npm start
```
