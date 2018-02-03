'use strict'

const db = require('../db')
const Stuff = require('./stuff')()
const Reminder = require('./reminder')()
const _ = require('underscore')

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
  internals.updateAction = async (uid, nowAction, data) => {
    try {
      let hasAction = await db.knex('user_action_state').where({
        uid: uid
      })
      if (Array.isArray(hasAction) && hasAction[0] && hasAction[0].uid === uid) {
        let newData = _.extend(hasAction[0].data, data)
        console.log(newData)
        await db.knex('user_action_state').where({
          uid: uid
        }).update({
          last_action: nowAction,
          data: newData
        })
      } else {
        console.log('new record')
        let ret = await db.knex('user_action_state').insert({
          uid: uid,
          last_action: nowAction,
          data: data
        })
        console.log(ret)
      }

      // find next action key_name
      let qAction = 'select key_name from action_key_order a where a.order_id=( \
        select min(order_id) from action_key_order \
        where key_name=\'' + nowAction + '\') + 1'
      let action = await db.knex.raw(qAction)
      console.log(action.rows[0].key_name)
      return action.rows[0].key_name || ''
    } catch (error) {
      console.log(error)
    }
  }
  internals.addHistory = async (uid) => {
    // get last action state
    let action = await db.knex('user_action_state').where({
      uid: uid
    }).select('*')
    //console.log(action)
    // add stuff
    let schedules = action[0].data.schedules
    let stuffID = await Stuff.addStuff(uid, action[0].data.stuff_name)
    let stuffPosition = action[0].data.stuff_position
    let tags = action[0].data.tags
    let location = action[0].data.location

    await Reminder.addReminder(uid, stuffID[0], schedules)

    let insertData = {
      stuff_id: stuffID[0],
      stuff_position: stuffPosition,
      uid: uid,
      tags: tags,
      location: location
    }
    let hid = await db.knex('history')
    .insert(insertData).returning('id')

    return Object.assign(
      {
        hid: hid[0],
        stuff_name: action[0].data.stuff_name
      }, insertData)
  }
  internals.getAllHistory = async (uid) => {
    let allHistory = await db.knex('history').where({
      uid: uid
    })
    return allHistory
  }
  internals.getStuffHistory = async (uid, stuffID) => {
    try {
      let history = await db.knex('history').where({
        uid: uid,
        stuff_id: stuffID
      })
      console.log(history)
      return history
    } catch (error) {
      console.error(error)
    }
  }
  return internals
}
