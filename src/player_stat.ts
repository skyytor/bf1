import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
import { stat_rendering } from './render'
const logger = new Logger('player_stat')

let classkey = {
    "Support": "支援",
    "Scout": "斟茶",
    "Assault": "土鸡",
    "Medic": "庸医",
    "Pilot": "飞机佬",
    "Tanker": "载具狗",
    "Cavalry": "弼马温"
}

export async function stat(ctx: Context, config: Config, session: any, playername: string) {
    if (!playername) {
        let info: any = await ctx.database.get('player', {
            qq: session.userId
        })
        if (info.length == 0) {
            session.send('请先使用"#绑定 你的id"指令绑定你的id或使用"#战绩 你的id"来查询')
            return
        }
        else {
            try {
                let result: any = await api.stat(ctx, config, info[0].personaId)
                const keys = Object.keys(classkey)
                const hasKey = keys.indexOf(result.result.favoriteClass) > -1
                if (hasKey)
                    result.result.favoriteClass = classkey[result.result.favoriteClass]
                let self = {
                    userName: info[0].userName,
                    rank: result.result.basicStats.rank ?? 0,
                    timePlayed: (result.result.basicStats.timePlayed / 3600).toFixed(2) ?? 0,
                    kd: (result.result.basicStats.kills / result.result.basicStats.deaths).toFixed(2),
                    Win_rate: (100 * result.result.basicStats.wins / (result.result.basicStats.wins + result.result.basicStats.losses)).toFixed(2),
                    kpm: result.result.basicStats.kpm,
                    spm: result.result.basicStats.spm,
                    skill: result.result.basicStats.skill,
                    favoriteClass: result.result.favoriteClass,
                    longestHeadShot: result.result.longestHeadShot,
                    kills: result.result.basicStats.kills,
                    deaths: result.result.basicStats.deaths,
                    wins: result.result.basicStats.wins,
                    losses: result.result.basicStats.losses,
                    highestKillStreak: result.result.highestKillStreak,
                    accuracyRatio: (result.result.accuracyRatio * 100).toFixed(2),
                    headShotsRatio: (result.result.headShots / result.result.basicStats.kills * 100).toFixed(2)
                }
                return stat_rendering(ctx, session, self)
            } catch (error) {
                logger.error('处理战绩1时出错')
                console.log(error)
                session.send('处理战绩1时出错')
            }
        }
    }
    else {
        try {
            let info = await ctx.database.get('player', {
                displayName: playername
            })
            let result: any
            if (info.length == 0) {

                let token = await ctx.database.get('account', {
                    personaId: config.bf1_accounts_personaId_list[0]
                })
                let info1: any = await api.get_personaId(ctx, playername, token[0].token)
                if (!info1) {
                    session.send('你输入了无效的玩家id')
                    return
                }
                result = await api.stat(ctx, config, info1[0].personaId)
            }
            else {
                result = await api.stat(ctx, config, info[0].personaId)
            }
            const keys = Object.keys(classkey)
            const hasKey = keys.indexOf(result.result.favoriteClass) > -1
            if (hasKey)
                result.result.favoriteClass = classkey[result.result.favoriteClass]
            let self = {
                userName: playername,
                rank: result.result.basicStats.rank ?? 0,
                timePlayed: (result.result.basicStats.timePlayed / 3600).toFixed(2) ?? 0,
                kd: (result.result.basicStats.kills / result.result.basicStats.deaths).toFixed(2),
                Win_rate: (100 * result.result.basicStats.wins / (result.result.basicStats.wins + result.result.basicStats.losses)).toFixed(2),
                kpm: result.result.basicStats.kpm,
                spm: result.result.basicStats.spm,
                skill: result.result.basicStats.skill,
                favoriteClass: result.result.favoriteClass,
                longestHeadShot: result.result.longestHeadShot,
                kills: result.result.basicStats.kills,
                deaths: result.result.basicStats.deaths,
                wins: result.result.basicStats.wins,
                losses: result.result.basicStats.losses,
                highestKillStreak: result.result.highestKillStreak,
                accuracyRatio: (result.result.accuracyRatio * 100).toFixed(2),
                headShotsRatio: (result.result.headShots / result.result.basicStats.kills * 100).toFixed(2)
            }
            return stat_rendering(ctx, session, self)
        } catch (error) {
            logger.error('处理战绩2时出错')
            console.log(error)
            session.send('处理战绩2时出错')
        }
    }
}

