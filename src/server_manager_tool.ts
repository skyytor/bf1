import { Context, Logger, h, Session } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('server_manager_tool')
//没用上
let map = {
    "格拉巴山": "格拉巴山",
    "拉粑粑山": "格拉巴山",
    "格": "格拉巴山",
    "森林": "阿爾貢森林",
    "阿尔贡森林": "阿爾貢森林",
    "帝国": "帝國邊境",
    "帝國边境": "帝國邊境",
    "边境": "帝國邊境",
    "流血宴厅": "流血宴廳",
    "流血": "流血宴廳",
    "宴厅": "流血宴廳",
    "盐亭": "流血宴廳",
    "流": "流血宴廳",
    "圣嘉然": "聖康坦的傷痕",
    "圣": "聖康坦的傷痕",
    "圣康坦": "聖康坦的傷痕",
    "圣康坦的伤痕": "聖康坦的傷痕",
    "西奈": "西奈沙漠",
    "西奈沙漠": "西奈沙漠",
    "沙漠": "西奈沙漠",
    "亚眠 ": "亞眠",
    "亚 ": "亞眠",
    "苏伊士 ": "蘇伊士",
    "法歐堡": "法歐堡",
    "法欧堡": "法歐堡",
    "法": "法歐堡",
    "庞然暗影": "龐然闇影",
    "暗影": "龐然闇影",
    "庞然": "龐然闇影",
    "苏瓦松": "蘇瓦松",
    "决裂": "決裂",
    "法务克斯要塞": "法烏克斯要塞",
    "要塞": "法烏克斯要塞",
    "凡尔登高地": "凡爾登高地",
    "凡": "凡爾登高地",
    "凡尔登": "凡爾登高地",
    "登": "凡爾登高地",
    "尼维尔之夜": "尼維爾之夜",
    "尼哥之夜": "尼維爾之夜",
    "尼维尔": "尼維爾之夜",
    "攻占托尔": "攻佔托爾",
    "攻占": "攻佔托爾",
    "托尔": "攻佔托爾",
    "勃魯西洛夫关口": "勃魯西洛夫關口",
    "关口": "勃魯西洛夫關口",
    "阿尔比恩": "阿爾比恩",
    "阿尔": "阿爾比恩",
    "武普库夫山口": "武普庫夫山口",
    "山口": "武普庫夫山口",
    "噗噗噗噗山口": "武普庫夫山口",
    "加利西亚": "加利西亞",
    "加利": "加利西亞",
    "察里津": "察里津",
    "察": "察里津",
    "窝瓦河": "窩瓦河",
    "海丽丝峡": "海麗絲岬",
    "海峡": "海麗絲岬",
    "海丽": "海麗絲岬",
    "泽布吕赫": "澤布呂赫",
    "黑爾戈蘭灣": "黑爾戈蘭灣",
    "黑尔格兰湾": "黑爾戈蘭灣",
    "阿奇巴巴": "阿奇巴巴",
    "2788": "阿奇巴巴",
    "迫击巴巴": "阿奇巴巴",
    "索姆河": "索姆河",
    "索": "索姆河",
    "帕斯尚尔": "帕斯尚爾",
    "卡波雷托": "卡波雷托",
    "剃刀边缘": "剃刀边缘",
    "夜袭": "倫敦的呼喚：夜襲",
    "灾祸": "倫敦的呼喚：災禍",
}


export { kick, ban, unban, unvip, vip, addadmin, removeadmin, chooseLevel }

async function rsp(ctx: Context, config: Config, session: Session, servername: string, playername: string) {

    //验证服务器是否能搜索到且唯一
    let result1 = await api.serverinfo(ctx, config, servername)
    if (result1.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result1)
    if (result1.data.gameservers.length > 1)
        return session.send('搜索到多个服务器，请注意筛选条件')
    let gameId = result1.data.gameservers[0].gameId
    let token = await ctx.database.get('account', {
        personaId: config.bf1_accounts_personaId_list[0]
    })
    let info1: any = await api.get_personaId(ctx, playername, token[0].token)
    if (!info1)
        return session.send('你输入了无效的玩家id')
    return {
        gameId: gameId,
        token: token,
        personaId: info1[0].personaId
    }
}
async function kick(ctx: Context, config: Config, session: Session, servername: string, playername: string, reason: string = '違反規則') {
    try {
        let bf1rsp: any = await rsp(ctx, config, session, servername, playername)

        let result = await api.kick(ctx, config, bf1rsp.gameId, bf1rsp.personaId, reason)
        if (result.error)
            return session.send(String(h('quote', { id: (session.messageId) })) + result)
        session.send(String(h('quote', { id: (session.messageId) })) + '成功踢出玩家' + playername)
    } catch (error) {
        console.log(error)
        session.send('未预料的错误，请联系bot管理员')
    }

}

async function ban(ctx: Context, config: Config, session: any, servername: string, playername: string) {

    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)
    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result = await api.ban(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已在${servername}中封禁了玩家${playername}`)

}

async function unban(ctx: Context, config: Config, session: any, servername: string, playername: string) {

    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)
    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result = await api.unban(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已在${servername}中解封了玩家${playername}`)

}
async function vip(ctx: Context, config: Config, session: any, servername: string, playername: string) {

    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)
    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result: any = await api.vip(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已在${servername}中为玩家${playername}添加vip`)

}
async function unvip(ctx: Context, config: Config, session: any, servername: string, playername: string) {

    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)
    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result: any = await api.unvip(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已删除${servername}中玩家${playername}的vip`)

}
async function addadmin(ctx: Context, config: Config, session: any, servername: string, playername: string) {
    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)

    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result = await api.addadmin(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已在${servername}中添加玩家${playername}为管理`)

}

async function removeadmin(ctx: Context, config: Config, session: any, servername: string, playername: string) {
    let bf1rsp: any = await rsp(ctx, config, session, servername, playername)

    let result3 = await api.getServerDetails(ctx, config, bf1rsp.gameId)
    let result = await api.removeadmin(ctx, config, result3.data.rspInfo.server.serverId, bf1rsp.personaId)
    if (result.error)
        return session.send(String(h('quote', { id: (session.messageId) })) + result)
    session.send(String(h('quote', { id: (session.messageId) })) +
        `已在${servername}中取消玩家${playername}的管理`)
    console.log(result)
}
async function chooseLevel(ctx: Context, config: Config, session: any, servername: string) {
    try {
        let result1 = await api.serverinfo(ctx, config, servername)
        if (result1.error)
            return session.send(String(h('quote', { id: (session.messageId) })) + result1)
        if (result1.data.gameservers.length > 1)
            return session.send('搜索到多个服务器，请注意筛选条件')

        if ((result1.data.gameservers[0].slots.Soldier.current == 0) && (result1.data.gameservers[0].slots.Spectator.current == 0)) {
            session.send(String(h('quote', { id: (session.messageId) })) + '服务器未开启')
            return
        }
        console.log(result1.data.gameservers[0].guid)
        let result2 = await api.getServerDetails(ctx, config, result1.data.gameservers[0].gameId)
        console.log(result2.data.serverInfo.rotation)
        let message = []
        message.push('当前服务器图池为:')
        for (let [index, item] of result2.data.serverInfo.rotation.entries()) {
            console.log(item.mapPrettyName + ' ' + item.modePrettyName)
            message.push((index + 1) + ':' + item.mapPrettyName)
        }
        message.push('请选择发送序号来更换地图' + '\n此操作将在30秒后过期')
        await session.send(message.join('\n'))
        let index = await session.prompt(30000)
        if (index) {
            logger.info('当前更换的服务器的guid' + result1.data.gameservers[0].guid)
            await api.chooseLevel(ctx, config, result1.data.gameservers[0].guid, index - 1)
            session.send(String(h('quote', { id: (session.messageId) })) +
                '已尝试更换为' +
                result2.data.serverInfo.rotation[index - 1].mapPrettyName +
                '\nguid:' + result1.data.gameservers[0].guid)
        }
        else {
            session.send(String(h('quote', { id: (session.messageId) })) + '操作已过期')
        }
    } catch (error) {
        session.send(String(h('quote', { id: (session.messageId) })) + '出错了，请再试一次')
    }

}