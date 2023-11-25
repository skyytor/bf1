import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('weapons')
export { weapon }

async function weapon(ctx: Context, config: Config, session: any, playerName?: string) {

    let personaId: string
    if (playerName) {
        const player = await ctx.database.get('player', { displayName: playerName })
        console.log(player)
        if (player.length > 0) {
            personaId = player[0].personaId
        } else {
            const token = await ctx.database.get('account', { personaId: config.bf1_accounts_personaId_list[0] })
            let info = await api.get_personaId(ctx, playerName, token[0].token)
            if (!info) {
                session.send('无效的玩家id~')
                return
            }
            personaId = info[0].personaId
        }
    } else {
        personaId = (await ctx.database.get('player', { qq: session.userId }))[0]?.personaId
        if (!personaId) {
            console.log(personaId)
            session.send('请先绑定你的id~')
            return
        }
    }
    try {
        const result = await api.weapon(ctx, config, personaId)
        const weapons = await weapons_sort(result)
        const message = weapons.slice(0, 3).map(weapon => `
${weapon.name}  
击杀:${weapon.stats.values.kills} kpm:${((weapon.stats.values.kills * 60) / weapon.stats.values.seconds).toFixed(2)}
命中率:${weapon.stats.values.accuracy}%  爆头率:${((weapon.stats.values.headshots / weapon.stats.values.kills) * 100).toFixed(0)}%
效率:${(weapon.stats.values.hits / weapon.stats.values.kills).toFixed(2)}  时长:${(weapon.stats.values.seconds / 3600).toFixed(2)}h
      `)
        session.send(message);
    } catch (error) {
        console.log(error)
        logger.error('处理武器数据时出错');
        session.send('处理武器数据时出错');
    }
}

async function weapons_sort(result: any) {
    let weapons: any[] = []
    for (let i of result.data) {
        for (let j of i.weapons) {
            if (Object.keys(j.stats.values).length > 0)
                weapons.push(j)
        }
    }
    weapons.sort((a: any, b: any) => b.stats.values.kills - a.stats.values.kills)
    return weapons
}
