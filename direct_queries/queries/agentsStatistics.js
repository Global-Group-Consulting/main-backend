/**
 *
 * Il Totale di:
 *
 * - provvigioni reinvestite
 * - provvigioni ritirate
 * - i brite agente generati
 * - rendite richieste
 * - deposito prelevati
 *
 * Periodo di riferimento: 1 Gennaio - 30 settembre 2023
 */

const { ObjectId } = require('mongodb')
const { connect } = require('../utils/mongo_connection')
const { exportCsv } = require('../utils/export_csv');

(async () => {
    const db = await connect('ggc_production')
    const userIds = [
        ObjectId('5fc8d7b6d9c4e80021cb21f9'),
        ObjectId('5fc62c0fc9edb900217d84b3'),
        ObjectId('5fc4a525a5a62400217a2e3f'),
        ObjectId('5fc941164a594a00211ea962'),
        ObjectId('5fc63aafc9edb900217d84db'),
        ObjectId('632030ea59a22400217733c5'),
        ObjectId('5fc9e6e91292050021460d85')
    ]
    
    const addMonthField = {
        '$addFields': {
            'month': {
                '$month': '$created_at'
            }
        }
    }
    
    const usersData = await db.collection('users').find({
        _id: {
            $in: userIds
        }
    }).toArray()
    
    /**
     * @type {{_id: {user: ObjectId, commissionType: string}, amount: number}[]}
     */
    const commissions = await db.collection('commissions').aggregate([
        {
            '$match': {
                'userId': {
                    '$in': userIds
                },
                'commissionType': {
                    '$in': [
                        'commissionsCollected',
                        'commissionsToReinvest'
                    ]
                },
                'created_at': {
                    '$gte': new Date('2023-01-01T00:00:00.000+0000'),
                    '$lte': new Date('2023-09-30T00:00:00.000+0000')
                }
            }
        }, addMonthField,
        {
            '$group': {
                '_id': {
                    'user': '$userId',
                    'commissionType': '$commissionType',
                    'month': '$month'
                },
                'amount': {
                    '$sum': {$abs: "$amountChange"}
                }
            }
        }
    ]).toArray()
    
    /**
     * @type {{_id: {user: ObjectId, movementType: number}, amount: number}[]}
     */
    const movements = await db.collection('movements').aggregate([
        {
            '$match': {
                'userId': {
                    '$in': userIds
                },
                'movementType': {
                    '$in': [4, 5]
                },
                'cancelRef': {
                    '$exists': false
                },
                'created_at': {
                    '$gte': new Date('2023-01-01T00:00:00.000+0000'),
                    '$lte': new Date('2023-09-30T00:00:00.000+0000')
                }
            }
        },
        addMonthField,
        {
            '$group': {
                '_id': {
                    'user': '$userId',
                    'movementType': '$movementType',
                    'month': '$month'
                },
                'amount': {
                    '$sum': {$abs: "$amountChange"}
                }
            }
        }
    ]).toArray()
    
    /**
     * @type {{_id: {user: ObjectId, type: string}, amount: number}[]}
     */
    const agentBrites = await db.collection('agent_brites').aggregate([
        {
            '$match': {
                'userId': {
                    '$in': userIds
                },
                'type': 'from_withdrawl',
                'created_at': {
                    '$gte': new Date('2023-01-01T00:00:00.000+0000'),
                    '$lte': new Date('2023-09-30T00:00:00.000+0000')
                }
            }
        },
        addMonthField,
        {
            '$group': {
                '_id': {
                    'user': '$userId',
                    'type': '$type',
                    'month': '$month'
                },
                'amount': {
                    '$sum': '$amount'
                }
            }
        }
    ]).toArray()
    
    const mergedData = userIds.map(userId => {
        const _user = usersData.find(u => u._id.equals(userId))
        const _commissions = commissions.filter(c => c._id.user.toString() === userId.toString())
        const _movements = movements.filter(m => m._id.user.equals(userId))
        const _agentBrites = agentBrites.filter(a => a._id.user.equals(userId))
        
        const months = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        
        return {
            user: {
                firstName: _user?.firstName,
                lastName: _user?.lastName,
            },
            userId: userId.toString(),
            ...months.reduce((acc, month) => {
                acc["mese_" + month] = {
                    provvigioni_reinvestite: _commissions.find(c => c._id.commissionType === 'commissionsToReinvest' && c._id.month === month)?.amount || 0,
                    provvigioni_ritirate: _commissions.find(c => c._id.commissionType === 'commissionsCollected' && c._id.month === month)?.amount || 0,
                    brite_agente_generati: _agentBrites.find(c => c._id.type === 'from_withdrawl' && c._id.month === month)?.amount || 0,
                    rendite_riscosse: _movements.find(c => c._id.movementType === 4 && c._id.month === month)?.amount || 0,
                    deposito_prelevati: _movements.find(c => c._id.movementType === 5 && c._id.month === month)?.amount || 0
                }
                
                // arrotondo i decimali
                Object.keys(acc["mese_" + month]).forEach(key => {
                    acc["mese_" + month][key] = acc["mese_" + month][key].toFixed(2)
                })
                
                return acc
            }, {})
        }
    })
    
    exportCsv(mergedData, 'agentsStatistics_2023-01_2023_09.csv')
})()
