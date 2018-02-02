'use strict'

const db = require('../db')

module.exports = function () {
  let internals = {}
  let getUserStuff = async (uid, id) => {
    if (uid === undefined) {
      console.log(new Error('no uid'))
      return null
    }
    // query stuff by id
    if (typeof id === 'number') {
      
    } else {
      let ret = await db.knex('user_stuff')
      .join('users', 'user_stuff.uid', 'users.uid')
      .select('user_stuff.name')
      let stuffList = ret.map((stuff) => {
        return stuff.name
      })
      console.log('All stuff: ' + stuffList)
      return stuffList
    }
  }

  let addStuff = async (uid, name) => {
    let stuffID = await db.knex('user_stuff').returning('id')
    .insert({
      uid: uid,
      name: name
    })
    return stuffID
  }

  internals.getUserStuff = getUserStuff
  internals.addStuff = addStuff
  return internals
}
