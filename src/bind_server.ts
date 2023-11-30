import { Context, Logger, h, Session } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('bind_server')

export async function 创建群组(ctx: Context, session: Session, groupname, group_qq) {

    try {
        await ctx.database.create('bf1group', {
            groupname: groupname,
            group_qq: group_qq
        })
        session.send('已为' + group_qq + '创建群组' + groupname)
    } catch (error) {
        session.send('当前已有群组' + groupname)
    }
}

export async function 删除群组(ctx: Context, session: Session, groupname) {

    try {
        await ctx.database.remove('bf1group', {
            groupname: groupname,
        })
        session.send('已删除群组' + groupname)
    } catch (error) {
        session.send('当前已有群组' + groupname)
    }
}

export async function 绑服(ctx: Context, config: Config, session: Session, groupname, servername: string, server_order: string, gameid: string) {
    if (!servername) {
        session.send('请输入需要绑定服的名称~')
        return
    }
    if (!gameid) {
        session.send('请输入需要绑定服的gameid~')
        return
    }
    let info = await ctx.database.get('bf1group', {
        groupname: groupname
    })
    if (info.length == 0) {
        session.send(groupname + '群组尚未创建，请先创建~')
        return
    }
    let serverinfo = await ctx.database.get('server', {
        gameId: gameid
    })
    if (serverinfo.length > 0) {
        session.send('该gameid已绑定过服务器~')
        return
    }
    try {
        console.log(gameid)
        let result = await api.getServerDetails(ctx, config, gameid)
        if (typeof (result) == 'string') {
            session.send(result)
            return
        }

        if (serverinfo.length == 0) {
            await ctx.database.upsert('server', [{
                serverId: result.data.rspInfo.server.serverId,
                servername: servername,
                gameId: gameid,
                guid: result.data.serverInfo.guid,
                belong_group: groupname,
                server_order: server_order
            }])

            session.send(String(h('quote', { id: session.messageId })) +
                `已绑定服务器${servername}\ngameid为${gameid}`)
        } else
            session.send(String(h('quote', { id: session.messageId })) +
                `该gameid已绑定过名称${serverinfo[0].servername},如需重新绑定请先解绑`)
    } catch (error) {
        session.send('查询gameid出错，请确保是有效的gameid')
        console.log(error)
        return
    }
}

export async function 删服(ctx: Context, session: Session, servername: string) {
    let serverinfo = await ctx.database.get('server', {
        servername: servername,
    })
    if (serverinfo) {
        await ctx.model.remove('server', {
            servername: servername,
        })
        session.send(String(h('quote', { id: session.messageId })) +
            `已删除服务器${servername}`)
    }
    else logger.info('未查询到相关信息，可能是服务器名或gameid错误')
}

export async function 查服(ctx: Context, session: Session, gameid: string) {
    let serverinfo = await ctx.database.get('server', {
        gameId: gameid
    })
    console.log('正在查询')
    if (serverinfo.length == 0) {
        session.send('未查询到此gamid绑定的相关服务器')
    } else {
        session.send(String(h('quote', { id: session.messageId })) +
            `名称:${serverinfo[0].servername}\ngameid:${serverinfo[0].gameId} `)
    }
}

export async function get_group_servers(ctx: Context, config: Config, session: Session) {
    let result = await ctx.database.get('bf1group', {
        group_qq: session.guildId
    })
    if (result.length == 0) {
        session.send('该群聊未绑定过群组')
        return
    }
    let result1 = await ctx.database.get('server', {
        belong_group: result[0].groupname
    })
    console.log(result1)
    if (result) {
        const promises = []
        for (let i of result1)
            promises.push(await api.getServerDetails(ctx, config, i.gameId))
        let result2 = await Promise.all(promises)
        let servertemp = []
        for (let i of result2)
            servertemp.push(`${i.data.serverInfo.name.substring(0, 30)}\n${i.data.serverInfo.mapNamePretty} ${i.data.serverInfo.mapModePretty} ${i.data.serverInfo.slots.Soldier.current}/64(${i.data.serverInfo.slots.Queue.current})[${i.data.serverInfo.slots.Spectator.current}]`)
        session.send('-----\n' + servertemp.join('\n'))
    }
    else
        session.send('该群组未绑定过服务器')
}

