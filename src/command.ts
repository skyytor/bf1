import { Context, Logger, h, Session, } from 'koishi'
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
import { } from '@koishijs/plugin-help'
const bf = new Logger('command')

export { command }

async function command(ctx: Context, config: Config) {
    //每周活动
    ctx.command('每周活动/在线人数')
        .action(async ({ session }, ...args) => {
            await bf1stat(ctx, config, session)
        })

    ctx.command('每周活动/交换')
        .action(async ({ session }, ...args) => {
            await exchange(ctx, config, session)
        })

    ctx.command('每周活动/行动')
        .action(async ({ session }, ...args) => {
            await campaign(ctx, config, session)
        })
    //服务器相关
    ctx.command('服务器相关/服务器 <服务器名称:text>')
        .action(async ({ session }, ...args) => {
            if (!args[0])
                await get_group_servers(ctx, config, session)
            else
                await getserverinfo(ctx, config, session, args[0])
        })

    ctx.command('服务器相关/玩家列表 <server_order:text>')
        .action(async ({ session }, ...args) => {
            /* if (!args[0])
                return  '缺少服务器名称~' */
            return await playerlist13(ctx, config, session, '')
        })


    ctx.command('服务器相关/添加管理 <server_order> <playername>', { authority: 3 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '你要给' + args[0] + '的谁上管理呢~'
            await addadmin(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/移除管理 <server_order> <playername>', { authority: 3 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '你要下' + args[0] + '谁的管理呢~'
            await removeadmin(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/kick <server_order> <playername> [reason]', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '缺少玩家名称呢~'
            await kick(ctx, config, session, args[0], args[1], args[2])
        })

    ctx.command('服务器相关/ban <servername> <playername>', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '缺少玩家名称呢~'
            await ban(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/unban <servername> <playername>', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '缺少玩家名称呢~'
            await unban(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/vip <servername> <playername>', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '缺少玩家名称呢~'
            await vip(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/unvip <servername> <playername>', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            if (!args[1])
                return '缺少玩家名称呢~'
            await unvip(ctx, config, session, args[0], args[1])
        })

    ctx.command('服务器相关/换图 <servername>', { authority: 2 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            await chooseLevel(ctx, config, session, args[0])
        })

    ctx.command('服务器相关/服务器详细信息 <servername:text>')
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服务器名称~'
            await getServerDetails(ctx, config, session, args[0])
        })
    //玩家信息
    ctx.command('玩家信息/绑定 <playername>')
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少玩家名称呢~'
            await bf1bind(ctx, config, session, args[0])
        })

    ctx.command('玩家信息/信息 <playername>')
        .action(async ({ session }, ...args) => {
            await info(ctx, session)
        })

    ctx.command('玩家信息/天眼查 <playername>')
        .action(async ({ session }, ...args) => {
            await id_verify(ctx, config, session, args[0])
        })

    //群组管理
    ctx.command('群组管理/创建群组 <groupname> <group_qq>', { authority: 4 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少群组名~'
            if (!args[1])
                return '未提供需要绑定的群号~'
            await 创建群组(ctx, session, args[0], args[1])
        })

    ctx.command('群组管理/删除群组 <groupname>', { authority: 4 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少群组名~'
            await 删除群组(ctx, session, args[0])
        })

    ctx.command('群组管理/绑服 <servername> <gameid>', { authority: 4 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服名~'
            if (!args[1])
                return '未提供需要绑定的gameid~'
            await 绑服(ctx, config, session, args[0], args[1], args[2], args[3])
        })

    ctx.command('群组管理/删服 <servername>', { authority: 4 })
        .action(async ({ session }, ...args) => {
            if (!args[0])
                return '缺少服名~'
            await 删服(ctx, session, args[0])
        })

    ctx.command('群组管理/群组信息  <groupname:text>')
        .action(async ({ session }, ...args) => {
            //await 查服(ctx, config, session, args[0])
            return '功能还没做'
        })
    //战绩相关
    ctx.command('战绩相关/战绩 <playername>')
        .action(async ({ session }, ...args) => {
            //return await stat(ctx, config, session, args[0])
            return '该功能暂时不可用'
        })

    ctx.command('战绩相关/最近 <name>')
        .alias('recent')
        .action(async ({ session }, ...args) => {
            //oprecent(ctx, session, args[0])
            return '该功能暂时不可用'
        })

    ctx.command('战绩相关/武器 <playername>')
        .action(async ({ session }, ...args) => {
            await weapon(ctx, config, session, args[0])
        })

    ctx.command('战绩相关/载具 <playername>')
        .action(async ({ session }, ...args) => {
            await vehicle(ctx, config, session, args[0])
        })

    //更新remid
    ctx.command('updateremid <remid>', { authority: 5, hidden: true })
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
            //collect_serverinfo(ctx, config)
            /* for (let i = 0; i < 50; i++){
                ctx.database.remove('bf1_dau',{id:i})
            } */
            //let info = (await ctx.database.get('test', { id: 1 }))[0]
            //let obj = eval(`( ${info.file} )`)
            //将string格式转换成object对象
            //console.log(obj)
            api.self()
        })

    ctx.command('echo <name>')
        .action((_, message) => message)

}

