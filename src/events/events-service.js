// EventsService set up for CRUD operations.
//add user ids to 'where'
//change getAllEvents to select user_id
const EventsService = {
    getAllEvents(knex, user_id) {
        return knex.select('*').from('events').where({user_id:user_id})
    },
    insertEvent(knex, newEvent) {
        return knex
            .insert(newEvent)
            .into('events')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id, user_id) {
        return knex.from('events').select('*').where({id:id,user_id:user_id}).first()
    },
    deleteEvent(knex, id, user_id) {
        return knex('events')
            .where({ id:id, user_id:user_id })
            .delete()
    },
    updateEvent(knex, id, newEventFields, user_id) {
        return knex('events')
            .where({ id:id, user_id:user_id })
            .update(newEventFields)
    }
}

module.exports = EventsService