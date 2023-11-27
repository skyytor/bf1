import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
import { } from './player_recent'
import { bf1stat, campaign, exchange } from './weekly_impact'
import { addadmin, ban, chooseLevel, kick, removeadmin, unban, unvip, vip } from './server_manager_tool'
import { getServerDetails, getserverinfo } from './server_detail_info'
import { bf1bind, info } from './bind_player'
import { get_group_servers, 创建群组, 查服, 绑服, 删服, 删除群组 } from './bind_server'
import { stat } from './player_stat'
import { refresh_self, update_remid } from './server_manager_account'
import { vehicle } from './vehicles'
import { weapon } from './weapons'
import { id_verify } from './tyc'
import { playerlist13 } from './player_list'
import { collect_serverinfo } from './update_server'
const bf = new Logger('command')

export { command }

async function command(ctx: Context, config: Config) {
    //每周活动
    ctx.command('每周活动/bf1stat')
        .alias('在线人数')
        .alias('bf1')
        .action(async ({ session }, ...args) => {
            await bf1stat(ctx, config, session)
        })

    ctx.command('每周活动/exchange')
        .alias('交换')
        .action(async ({ session }, ...args) => {
            await exchange(ctx, config, session)
        })

    ctx.command('每周活动/campaign')
        .alias('行动')
        .action(async ({ session }, ...args) => {
            await campaign(ctx, config, session)
        })
    //服务器相关
    ctx.command('服务器相关/serverinfo <servername:text>')
        .alias('服务器')
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
            await getserverinfo(ctx, config, session, args[0])
            
        })

    ctx.command('服务器相关/playerlist <servername:text>')
        .alias('玩家列表')
        .action(async ({ session }, ...args) => {
            /* if (!args[0])
                return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~' */
            return await playerlist13(ctx, config, session, '')
})

//失效了，不知道是什么原因
ctx.command('服务器相关/addadmin <servername> <playername>', { authority: 3 })
    .alias('上管理')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '你要给' + args[0] + '的谁上管理呢~'
        await addadmin(ctx, config, session, args[0], args[1])
    })
//失效了，不知道是什么原因
ctx.command('服务器相关/removeadmin <servername> <playername>', { authority: 3 })
    .alias('下管理')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '你要下' + args[0] + '谁的管理呢~'
        await removeadmin(ctx, config, session, args[0], args[1])
    })

ctx.command('服务器相关/kick <servername> <playername> [reason]', { authority: 2 })
    .alias('kick')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await kick(ctx, config, session, args[0], args[1], args[2])
    })

ctx.command('服务器相关/ban <servername> <playername>', { authority: 2 })
    .alias('ban')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await ban(ctx, config, session, args[0], args[1])
    })

ctx.command('服务器相关/unban <servername> <playername>', { authority: 2 })
    .alias('unban')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await unban(ctx, config, session, args[0], args[1])
    })

ctx.command('服务器相关/vip <servername> <playername>', { authority: 2 })
    .alias('vip')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await vip(ctx, config, session, args[0], args[1])
    })

ctx.command('服务器相关/unvip <servername> <playername>', { authority: 2 })
    .alias('unvip')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await unvip(ctx, config, session, args[0], args[1])
    })

ctx.command('服务器相关/换图 <servername>', { authority: 2 })
    .alias('chooselevel')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        await chooseLevel(ctx, config, session, args[0])
    })

ctx.command('服务器相关/getServerDetails <servername:text>')
    .alias('详细信息')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服务器名称~'
        await getServerDetails(ctx, config, session, args[0])
    })
//玩家信息
ctx.command('玩家信息/bind <playername>')
    .alias('绑定')
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少玩家名称呢~'
        await bf1bind(ctx, config, session, args[0])
    })

ctx.command('玩家信息/info <playername>')
    .action(async ({ session }, ...args) => {
        await info(ctx, session)
    })

ctx.command('玩家信息/天眼查 <playername>')
    .alias('tyc')
    .action(async ({ session }, ...args) => {
        await id_verify(ctx, config, session, args[0])
    })

//群组管理
ctx.command('群组管理/mysrevers', { authority: 1 })
    .alias('f')
    .action(async ({ session }, ...args) => {
        await get_group_servers(ctx, config, session)
    })

ctx.command('群组管理/创建群组 <groupname> <group_qq>', { authority: 4 })
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少群组名~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '未提供需要绑定的群号~'
        await 创建群组(ctx, config, session, args[0], args[1])
    })

ctx.command('群组管理/删除群组 <groupname>', { authority: 4 })
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少群组名~'
        await 删除群组(ctx, config, session, args[0])
    })

ctx.command('群组管理/绑服 <servername> <gameid>', { authority: 4 })
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服名~'
        if (!args[1])
            return String(h('quote', { id: (session.messageId) })) + '未提供需要绑定的gameid~'
        await 绑服(ctx, config, session, args[0], args[1], args[2])
    })

ctx.command('群组管理/删服 <servername>', { authority: 4 })
    .action(async ({ session }, ...args) => {
        if (!args[0])
            return String(h('quote', { id: (session.messageId) })) + '缺少服名~'
        await 删服(ctx, config, session, args[0])
    })

ctx.command('群组管理/群组信息  <groupname:text>')
    .action(async ({ session }, ...args) => {
        //await 查服(ctx, config, session, args[0])
        return '功能还没做'
    })
//战绩相关
ctx.command('战绩相关/战绩 <playername>')
    .alias('stat')
    .action(async ({ session }, ...args) => {
        return await stat(ctx, config, session, args[0])
    })

ctx.command('战绩相关/最近 <name>')
    .alias('recent')
    .action(async ({ session }, ...args) => {
        //oprecent(ctx, session, args[0])
        session.send('该功能正在重写')
    })

ctx.command('战绩相关/武器 <playername>')
    .alias('weapon')
    .action(async ({ session }, ...args) => {
        await weapon(ctx, config, session, args[0])
    })

ctx.command('战绩相关/载具 <playername>')
    .alias('vehicle')
    .action(async ({ session }, ...args) => {
        await vehicle(ctx, config, session, args[0])
    })

//更新remid
ctx.command('updateremid <remid>', { authority: 5, hidden: true })
    .alias('更新remid')
    .action(async ({ session }, ...args) => {
        await update_remid(ctx, config, session, args[0])
    })

ctx.command('help')
    .alias('帮助')
    .action(async ({ session }, ...args) => {
        session.send(h.image(`file:///${__dirname}/help.jpg`))
    })

ctx.command('test <name>')
    .action(async ({ session }, ...args) => {
        collect_serverinfo(ctx,config)

    })

ctx.command('echo <name>')
    .action((_, message) => message)
}
