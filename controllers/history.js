'use strict'

const db = require('../db')
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
  internals.updateAction = async (uid, lastAction, data) => {
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
          last_action: lastAction,
          data: newData
        })
      } else {
        console.log('new record')
        let ret = await db.knex('user_action_state').insert({
          uid: uid,
          last_action: lastAction,
          data: data
        })
        console.log(ret)
      }
      // find next action key_name
      let qAction = 'select key_name from action_key_order a where a.order_id=( \
        select min(order_id) from action_key_order \
        where key_name=\'' + lastAction + '\') + 1'
      let action = await db.knex.raw(qAction)
      console.log(action.rows[0].key_name)
    } catch (error) {
      console.log(error)
    }
  }

  return internals
}
