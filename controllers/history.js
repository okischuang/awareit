'use strict'

const db = require('../db')

module.exports = function () {
  let internals = {}
  internals.addUser = async (uid, name) => {
    try {
      let ret = await db.knex('users').insert({
        name: name,
        uid: uid
      })
      console.log(ret)
    } catch (error) {
      console.error(error)
    }
  }
  internals.updateAction = async (uid, lastAction, data) => {
    try {
      let hasAction = await db.knex('user_action_state').where({
        uid: uid,
        last_action: lastAction
      }).select('uid')
      console.log(hasAction)
    } catch (error) {
      
    }
  }

  return internals
}
