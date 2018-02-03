'use strict'

const db = require('../db')
const knex = db.knex

module.exports = function () {
  let internals = {}
  internals.addReminder = async (uid, stuffID, schedule = []) => {
    console.log(schedule)
    console.log('--')
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
  internals.getAllReminder = async () => {
    // select r.id, r.uid, u.uname, r.schedule_time, us.name, h.stuff_position from reminder r 
    // left join user_stuff us on r.uid=us.uid and r.stuff_id=us.id
    // inner join users u on r.uid=u.uid 
    // inner join history h on r.uid=h.uid and r.stuff_id=h.stuff_id
    // where r.schedule_time >= '2018-02-03 05:16:20.000' and r.schedule_time <= '2018-02-03 05:16:26.000'
    // order by r.schedule_time asc;
    let now = Date.now()
    let timeRange = new Date(now - 1000).toISOString()
    let timeRange1 = new Date(now + 1000).toISOString()
    let raw = 'select r.id, r.uid, u.uname, r.schedule_time, us.name, h.stuff_position, h.created from reminder r \
    inner join user_stuff us on r.uid=us.uid and r.stuff_id=us.id \
    inner join users u on r.uid=u.uid \
    inner join history h on r.uid=h.uid and r.stuff_id=h.stuff_id \
    where r.schedule_time >= \'' + timeRange + '\'' + ' and r.schedule_time <= \'' + timeRange1 + '\''
    ' order by r.schedule_time asc'

    console.log(raw)

    let ret = await knex.raw(raw)
    // let ret = await knex('reminder r')
    //   .join('user_stuff us', 'r.uid', '=', 'us.uid')
    //     .andOn('r.stuff_id', '=', 'us.id')
    //   .join('users u', 'r.uid', '=', 'u.uid')
    //   .where('r.schedule_time', '>=', new Date(now + 3000))
    //   .orderBy('r.schedule_time', 'asc')
    return ret.rows
  }
  return internals
}
