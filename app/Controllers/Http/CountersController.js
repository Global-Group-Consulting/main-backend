'use strict'

const Counters = use('App/Models/Counters')

class CountersController {
  async increment (field) {
    const currentValue = await Counters.findOrNew({ id: field }, { id: field, seq: 1000 })

    currentValue.seq += 1
    await currentValue.save()

    return currentValue.seq
  }

  async incrementContract () {
    return this.increment('contractNumber')
  }
}

module.exports = CountersController
