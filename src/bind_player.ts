import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('bind_player')

export { bf1bind, info }
async function bf1bind(ctx: Context, config: Config, session: any, playername: string) {
    try {
        if (playername == undefined)
            return session.send(String(h('quote', { id: session.messageId })) + '请指定你的id~')
        let token = await ctx.database.get('account', {
            personaId: config.bf1_accounts_personaId_list[0]
        })
        let info1: any = await api.get_personaId(ctx, playername, token[0].token)
        console.log(info1)
        if (!info1)
            return session.send('你输入了无效的玩家id')
        try {
            ctx.database.upsert('player', [{
                personaId: info1[0].personaId + '',
                qq: session.userId,
                displayName: info1[0].displayName,
            }])
        } catch (error) {
            session.send('绑定失败，当前已有人绑定该id')
        }

        session.send(String(h('quote', { id: session.messageId })) +
            `绑定成功,你的id为${info1[0].displayName}`)
    } catch (error) {
        console.log(error)
        logger.error('绑定玩家时发生错误，可能是获取个人信息时出现错误')
        session.send('绑定玩家时发生错误，可能是获取个人信息时出现错误')
    }
}

async function info(ctx: Context, session: any) {
    try {
        let getuserinfo = await ctx.database.get('player', {
            qq: session.userId
        })
        if (getuserinfo.length == 0)
            return session.send(String(h('quote', { id: session.messageId })) + '未获取到玩家数据，请先绑定id')
        session.send(String(h('quote', { id: session.messageId })) +
            `名称:${getuserinfo[0].displayName}\npersonaId:${getuserinfo[0].personaId}`)
        logger.info(`名称:${getuserinfo[0].displayName} personaId:${getuserinfo[0].personaId} `)
    } catch (err) {
        session.send(String(h('quote', { id: session.messageId })) + '获取玩家数据出错')
    }
}
