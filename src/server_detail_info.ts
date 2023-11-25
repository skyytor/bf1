import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('server_detail_info')

export { getserverinfo, getServerDetails, timestamp }
async function getserverinfo(ctx: Context, config: Config, session: any, servername: string) {
    try {
        let result: any = await api.serverinfo(ctx, config, servername)
        if (result.error)
            return session.send(String(h('quote', { id: (session.messageId) })) + result)
        console.log(result.data.gameservers)
        let servertemp = []
        if (result.data.gameservers.length == 0) {
            session.send(String(h('quote', { id: session.messageId })) + '未搜索到相关服务器')
            return
        } else {
            for (let i of result.data.gameservers) {
                servertemp.push(`${i.name.substring(0, 20)}\n${i.mapNamePretty} ${i.slots.Soldier.current}/64(${i.slots.Queue.current})[${i.slots.Spectator.current}]`)
            }
            session.send(String(h('quote', { id: session.messageId })) +'\n' +servertemp.join('\n'))
        }
    } catch (error) {
        logger.info('获取服务器信息失败:', error)
    }
}

async function getServerDetails(ctx: Context, config: Config, session: any, servername: string) {
    try {
        let result1 = await api.serverinfo(ctx, config, servername)
        if (result1.error)
            return session.send(String(h('quote', { id: (session.messageId) })) + result1)
        
        if (result1.data.gameservers.length == 0) {
            session.send(String(h('quote', { id: session.messageId })) + '未获取到服务器信息，可能是名称错误')
            return
        } else if (result1.data.gameservers.length > 1) {
            session.send(
                String(h('quote', { id: session.messageId })) + '获取到多个服务器信息，请使用更详细的筛选条件')
            return
        }
        let result = await api.getServerDetails(ctx, config, result1.data.gameservers[0].gameId)
        console.log(result.data.rspInfo)
        let createdDate = await timestamp(Number(result.data.rspInfo.server.createdDate))
        let expirationDate = await timestamp(Number(result.data.rspInfo.server.expirationDate))
        let updatedDate = await timestamp(Number(result.data.rspInfo.server.updatedDate))
        if (result.data.platoonInfo == null) {
            session.send(String(h('quote', { id: session.messageId })) +
                `服务器名称:
${result.data.serverInfo.name}
${result.data.serverInfo.slots.Soldier.current}/64(${result.data.serverInfo.slots.Queue.current})[${result.data.serverInfo.slots.Spectator.current}] 当前地图:${result.data.serverInfo.mapNamePretty}
简介:
${result.data.serverInfo.description}
收藏数:${result.data.serverInfo.serverBookmarkCount}
管理数:${(result.data.rspInfo.adminList).length}/50 vip数:${(result.data.rspInfo.vipList).length}/50 
服务器内ban位:${(result.data.rspInfo.bannedList).length}/200
创建时间:${createdDate}
到期时间:${expirationDate}
更新时间:${updatedDate}
拥有者:${result.data.rspInfo.owner.displayName}
gameId:${result.data.serverInfo.gameId}
guid:${result.data.serverInfo.guid}`)
        } else {
            let platooncreatedDate = await timestamp(Number(result.data.platoonInfo.dateCreated))
            session.send(String(h('quote', { id: session.messageId })) +
                `服务器名称:
${result.data.serverInfo.name}
${result.data.serverInfo.slots.Soldier.current}/64(${result.data.serverInfo.slots.Queue.current})[${result.data.serverInfo.slots.Spectator.current}] 当前地图:${result.data.serverInfo.mapNamePretty}
简介:
${result.data.serverInfo.description}
收藏数:${result.data.serverInfo.serverBookmarkCount}
管理数:${(result.data.rspInfo.adminList).length}/50 vip数:${(result.data.rspInfo.vipList).length}/50 
服务器内ban位:${(result.data.rspInfo.bannedList).length}/200
创建时间:${createdDate}
到期时间:${expirationDate}
更新时间:${updatedDate}
拥有者:${result.data.rspInfo.owner.displayName}
gameId:${result.data.serverInfo.gameId}
guid:${result.data.serverInfo.guid}
战队:${result.data.platoonInfo.name}(${result.data.platoonInfo.tag})
简介:${result.data.platoonInfo.description} 
战队创建时间:${platooncreatedDate}`)
        }
    } catch (error) {
        logger.info('获取或处理服务器详细信息时出错')
        console.log(error)
        session.send('获取或处理服务器详细信息时出错')
    }
}

async function timestamp(timestamp: number) {
    try {
        return timestamp.toString().length == 10
            ? new Date(timestamp * 1000).toLocaleString('zh-CN')
            : new Date(timestamp).toLocaleString('zh-CN')
    } catch {
        logger.error('处理时间戳出错，可能是获取服务器详细信息时出错')
    }
}
