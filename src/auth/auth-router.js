const express = require('express')
const AuthService = require('./auth-service')

const authRouter = express.Router()
const jsonBodyParser = express.json()

// login router for user login. set up for post. account and password are authenticated
authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { account_name, account_password } = req.body
    const loginUser = { account_name, account_password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.account_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          })

        return AuthService.comparePasswords(loginUser.account_password, dbUser.account_password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              })

            const sub = dbUser.account_name
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            })
          })
      })
      .catch(err => {
        console.log("ERROR", err);
        next(err);
      });
  })

module.exports = authRouter