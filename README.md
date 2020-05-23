# Just a Calendar

[Live app](https://just-a-calendar-app.skang28.now.sh/)

## Summary
Just a Calendar is an app that brings a fresh take on the classic calendar app. This app aims to bring all the essential functionality that all calendar apps offer without all the extra fluff. The user can create, edit, and delete events on the calendar. The user can view the calendar in 3 different views, daily, weekly, and monthly. Simplicity is the theme.

1. Home page is the default view of the app, and shows the calendar in its monthly view. This view also shows upcoming events for the user on the left. This list can be seen on all three views, monthly, weekly, and daily.

2. The weekly view page shows only the current week and any events in that week.

3. The daily view page shows only the current day of the week and any events occuring on that day.

4. The user can create or edit an event through the event form page.



## API Documentation

### Authentication
#### POST /auth
Creates an authentication request for user login, and creates an authentication token for successful logins.

### Events
#### GET /events
Retrieves all events stored in database specific to user currently logged in.

#### POST /events
Creates a new event specific to user currently logged in.

#### PATCH /events
Updates an event chosen by user.

#### DELETE /events
Deletes a selected event.

### Users
#### POST /users
Creates a new user account with validation on username and password.


## Technology Used
HTML, CSS, Javascript, React