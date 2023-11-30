import { Context, Logger, h, Session } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('server_manager_tool')

export { kick, ban, unban, unvip, vip, addadmin, removeadmin, chooseLevel }

class bf1rsp {
    data: {
        gameId: string,
        personaId: string,
        serverId: string
    }
    error: null
}

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



async function rsp(ctx: Context, config: Config, session: Session, server_order: string, playername: string) {

    let group_temp = await ctx.database.get('bf1group', {
        group_qq: session.guildId
    })
    if (group_temp.length === 0) {
        session.send('该群聊未绑定过群组')
        throw Error('该群聊未绑定过群组')
    }

    let server_temp = await ctx.database.get('server', {
        belong_group: group_temp[0].groupname,
        server_order: server_order
    })

    let token = await ctx.database.get('account', {
        personaId: config.bf1_accounts_personaId_list[0]
    })

    let info = await api.get_personaId(ctx, playername, token[0].token)

    if (info)
        return {
            data: {
                gameId: server_temp[0].gameId,
                personaId: info[0].personaId,
                serverId: server_temp[0].serverId
            },
            error: null
        }
    else {
        session.send('无效的玩家id')
        throw Error('无效的玩家id')
    }

}

async function kick(ctx: Context, config: Config, session: Session, server_order: string, playername: string, reason: string = '違反規則') {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result = await api.kick(ctx, config, bf1rsp.data.gameId, bf1rsp.data.personaId, reason)
    session.send('成功踢出玩家' + playername)

}
async function ban(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result = await api.ban(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已在${server_order}中封禁了玩家${playername}`)

}

async function unban(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result = await api.unban(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已在${server_order}中解封了玩家${playername}`)

}

async function vip(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result: any = await api.vip(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已在${server_order}中为玩家${playername}添加vip`)

}
async function unvip(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result: any = await api.unvip(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已删除${server_order}中玩家${playername}的vip`)

}
async function addadmin(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result = await api.addadmin(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已在${server_order}中添加玩家${playername}为管理`)
}

async function removeadmin(ctx: Context, config: Config, session: any, server_order: string, playername: string) {

    let bf1rsp: bf1rsp = await rsp(ctx, config, session, server_order, playername)
    let result = await api.removeadmin(ctx, config, bf1rsp.data.serverId, bf1rsp.data.personaId)
    session.send(`已在${server_order}中取消玩家${playername}的管理`)

}
async function chooseLevel(ctx: Context, config: Config, session: any, server_order: string) {
    try {
        let group_temp = await ctx.database.get('bf1group', {
            group_qq: session.guildId
        })
        if (group_temp.length === 0) {
            session.send('该群聊未绑定过群组')
            throw Error('该群聊未绑定过群组')
        }

        let server_temp = await ctx.database.get('server', {
            belong_group: group_temp[0].groupname,
            server_order: server_order
        })
        if (server_temp.length === 0) {
            session.send('该群组没有' + server_order + '服')
        }
        let get_details = await api.getServerDetails(ctx, config, server_temp[0].gameId)
        let message = []
        message.push('当前服务器图池为:')
        for (let [index, item] of get_details.data.serverInfo.rotation.entries()) {
            console.log(item.mapPrettyName + ' ' + item.modePrettyName)
            message.push((index + 1) + ':' + item.mapPrettyName)
        }
        message.push('请选择发送序号来更换地图' + '\n此操作将在30秒后过期')
        await session.send(message.join('\n'))
        let index = await session.prompt(30000)
        if (index) {
            logger.info('当前更换的服务器的guid' + get_details.data.serverInfo.guid)
            let res = await api.chooseLevel(ctx, config, get_details.data.serverInfo.guid, index - 1)
            console.log(res)
            if (res.error)
                return session.send(res.error.error)
            session.send(
                '已尝试更换为' +
                get_details.data.serverInfo.rotation[index - 1].mapPrettyName +
                '\nguid:' + get_details.data.serverInfo.guid)
        }
        else {
            session.send('操作已过期')
        }
    } catch (error) {
        console.log(error)
        session.send('出错了，请再试一次')
    }

}