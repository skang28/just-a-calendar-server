const path = require('path')
const express = require('express')
const EventsService = require('./events-service')
const jwtAuth = require('../jwt-auth/jwt-auth')

const eventsRouter = express.Router()
const jsonParser = express.json()
eventsRouter.use(jwtAuth.requireAuth)

// router for events endpoint. set up for get, post, patch, and delete
eventsRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        EventsService.getAllEvents(knexInstance, req.user.id)
          .then(event => {
            res.json(event)
          })
          .catch(next)
      })
      .post(jsonParser, (req, res, next) => {
        const { title, location, start_date_time, end_date_time, description } = req.body
        const newEvent = { title, location, start_date_time, end_date_time, description }
            
        for (const [key, value] of Object.entries(newEvent)) {
          if (typeof value === 'string') {
            newEvent[key] = value.trim()
          }
        }
    
        for (const [key, value] of Object.entries(newEvent)) {
          if (!value)
            return res.status(400).json({
              error: { message: `Uh oh! You are missing '${key}' in your submission. Please ensure you fill out all fields!` }
            })
        }

        if (start_date_time > end_date_time) {
          return res.status(400).json({
            error: { message: `Uh oh! You cannot have the start time/date after the end time/date!`}
          })
        }
        
        newEvent.user_id = req.user.id
        EventsService.insertEvent(
          req.app.get('db'),
          newEvent
        )
          .then(event => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${event.id}`))
              .json(event)
          })
          .catch(next)
      })
    
      eventsRouter
      .route('/:event_id')
      .all((req, res, next) => {
        EventsService.getById(
          req.app.get('db'),
          req.params.event_id,
          req.user.id
        )
          .then(event => {
            if (!event) {
              return res.status(404).json({
                error: { message: `event doesn't exist` }
              })
            }
            res.event = event
            next()
          })
          .catch(next)
      })
      .get((req, res, next) => {
        res.json(res.event)
      })
      .delete((req, res, next) => {
        EventsService.deleteEvent(
          req.app.get('db'),
          req.params.event_id,
          req.user.id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })
      .patch(jsonParser, (req, res, next) => {
        const { title, location, start_date_time, end_date_time, description } = req.body
        const eventToUpdate = { title, location, start_date_time, end_date_time, description }
    
        const numberOfValues = Object.values(eventToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
          return res.status(400).json({
            error: {
              message: `Request body must content either 'title', 'content', and 'date posted'`
            }
          })
        
        if (start_date_time > end_date_time) {
          return res.status(400).json({
            error: { message: `Uh oh! You cannot have the start time/date after the end time/date!`}
          })
        }
          

        eventToUpdate.user_id = req.user.id
        EventsService.updateEvent(
          req.app.get('db'),
          req.params.event_id,
          eventToUpdate,
          req.user.id
        )
          .then(numRowsAffected => {
            res.status(204).end()
          })
          .catch(next)
      })

module.exports = eventsRouter