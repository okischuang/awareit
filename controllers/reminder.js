'use strict'

const db = require('../db')
const knex = db.knex

module.exports = function () {
  let internals = {}
  internals.addReminder = async (uid, stuffID, schedule = []) => {
    schedule.forEach(async (s) => {
      console.log(s)
      console.log({
        uid: uid,
        stuff_id: stuffID,
        schedule_time: s
      })
      await knex('reminder').insert({
        uid: uid,
        stuff_id: stuffID,
        schedule_time: s
      })
    })
  }
  return internals
}
