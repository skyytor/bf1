import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('vehicles')
export { vehicle }
async function vehicle(ctx: Context, config: Config, session: any, playername: string) {
    if (playername == undefined) {
        let info: Array<any> = await ctx.database.get('player', {
            qq: session.userId
        })
        if (!info) {
            session.send(
                '请先使用"#绑定 你的id"指令绑定你的id或使用"#战绩 你的id"来查询'
            )
            return
        } else {
            console.log(info[0].personaId)
            try {
                let result = await api.vehicle(ctx, config, info[0].personaId)
                console.log(result.data)
                let vehicles = await vehicles_sort(result)
                let message = []
                for (let i = 0; i < 3; i++) {
                    message.push(`
${vehicles[i].name}
击杀:${vehicles[i].stats.values.kills} 摧毁数:${vehicles[i].stats.values.destroyed}
kpm:${((vehicles[i].stats.values.kills * 60) / vehicles[i].stats.values.seconds).toFixed(2)} 时长:${(vehicles[i].stats.values.seconds / 3600).toFixed(1)}H
`)
                }
                session.send(message)
            } catch {
                logger.info('处理武器数据时出错,可能是获取的api错误')
                session.send('处理武器数据时出错')
            }
        }
    } else {
        try {
            let info = await ctx.database.get('player', {
                displayName: playername
            })
            let result: any
            if (info.length == 0) {
                let token = await ctx.database.get('account', {
                    personaId: config.bf1_accounts_personaId_list[0]
                })
                let info1: any = await api.get_personaId(
                    ctx,
                    playername,
                    token[0].token
                )
                if (!info1) {
                    session.send('你输入了无效的玩家id')
                    return
                }
                result = await api.vehicle(ctx, config, info1[0].personaId)
            } else {
                console.log(info[0].personaId)
                result = await api.vehicle(ctx, config, info[0].personaId)
            }
            let vehicles = await vehicles_sort(result)
            console.log(vehicles)
            let message = []
            for (let i = 0; i < 3; i++) {
                message.push(`
${vehicles[i].name}
击杀:${vehicles[i].stats.values.kills} 摧毁数:${vehicles[i].stats.values.destroyed}
kpm:${((vehicles[i].stats.values.kills * 60) / vehicles[i].stats.values.seconds).toFixed(2)} 时长:${(vehicles[i].stats.values.seconds / 3600).toFixed(1)}H
`)
            }
            session.send(message)
        } catch (error) {
            console.log(error)
        }
    }
}

export async function vehicles_sort(result: any) {
    let vehicles = []
    let info = result.data
    for (let i of info) {
        for (let j of i.vehicles) {
            if (Object.keys(j.stats.values).length == 0) {
                continue
            }
            vehicles.push(j)
        }
    }
    vehicles.sort((a, b) => {
        return b.stats.values.kills - a.stats.values.kills
    })
    return vehicles
}
