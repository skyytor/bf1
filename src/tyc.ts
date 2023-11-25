import { Context, Logger, h, Session } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('tyc')

export { tyc, id_verify }
//查询personaId，服主，管理，vip，ban数（暂时无法实现），查询bfeac，bfban是否封禁，查询战绩软件浏览量
async function id_verify(ctx: Context, config: Config, session: Session, playername) {
    if (!playername) {
        let info = await ctx.database.get('player', {
            qq: session.userId
        })
        if (!info) {
            session.send(String(h('quote', { id: (session.messageId) })) + '请先使用"#绑定 你的id"指令绑定你的id或使用"#天眼查 你的id"来查询')
            return
        } else {
            try {
                //session.send('改功能查询较慢，请耐心等待，如出错请再试一次')
                await tyc(ctx, config, session, info[0].displayName)
            } catch (error) {
                logger.info('处理天眼查数据时出错,可能是获取的api错误')
                session.send('处理天眼查数据时出错')
                console.log(error)
            }
        }
    } else {
        try {
            //session.send(String(h('quote', { id: (session.messageId) })) +'该功能查询较慢，请耐心等待，如出错请再试一次')
            await tyc(ctx, config, session, playername)

        } catch (error) {
            console.log(error)
        }
    }
}

async function tyc(ctx: Context, config: Config, session, playername) {

    let token = await ctx.database.get('account', {
        personaId: config.bf1_accounts_personaId_list[0]
    })
    let personaId_temp: any
    personaId_temp = await api.get_personaId(ctx, playername, token[0].token)
    console.log(personaId_temp)
    if (typeof (personaId_temp) == 'string') {
        session.send(personaId_temp)
        return
    }
    if (!personaId_temp) {
        session.send('你输入了无效的玩家id')
        return
    }
    let last_play_time = await utcToChinaTime(personaId_temp[0].lastAuthenticated)
    if (!personaId_temp) {
        session.send(String(h('quote', { id: (session.messageId) })) + '未查询到玩家！')
        return
    }
    let tyc_msg = await Promise.all([
        api.bfeac_api(ctx, playername),
        api.bfban_api(ctx, personaId_temp[0].personaId),
        api.recent_history(ctx, config, personaId_temp[0].personaId),
        api.is_playing(ctx, config, personaId_temp[0].personaId),
        api.record_getReport(ctx, config, personaId_temp[0].personaId)
    ])

    console.log('--------------')
    console.log(tyc_msg[4])
    console.log('--------------')
    //未处理是0，已封禁是1，证据不足是2，自证通过是3，自证中是4，刷枪是5
    let eac_msg: string = 'BFEAC记录'
    switch (tyc_msg[0]?.data?.[0].current_status ?? -1) {
        case -1:
            eac_msg += '(无)'
            break
        case 0:
            eac_msg += '(未处理)，案件链接:https://bfeac.com/#/case/'
            break
        case 1:
            eac_msg += '(已封禁)，案件链接:https://bfeac.com/#/case/'
            break
        case 2:
            eac_msg += '(证据不足)，案件链接:https://bfeac.com/#/case/'
            break
        case 3:
            eac_msg += '(自证通过)，案件链接:https://bfeac.com/#/case/'
            break
        case 4:
            eac_msg += '(自证中)，案件链接:https://bfeac.com/#/case/'
            break
        case 5:
            eac_msg += '(刷枪)，案件链接:https://bfeac.com/#/case/'
            break
    }
    eac_msg += tyc_msg[0].data?.[0].case_id ?? ''
    //未处理是0，实锤是1，待自证是2，moss自证是3，无效举报是4，讨论中是5，需要更多管理投票是6，刷枪是8
    let bfban_msg = 'BFBAN记录'
    switch (tyc_msg[1].personaids[personaId_temp[0].personaId].status ?? -1) {
        case -1:
            bfban_msg += '(无)'
            break
        case 0:
            bfban_msg += '(未处理)'
            break
        case 1:
            bfban_msg += '(实锤)'
            break
        case 2:
            bfban_msg += '(待自证)'
            break
        case 3:
            bfban_msg += '(moss自证)'
            break
        case 4:
            bfban_msg += '(无效举报)'
            break
        case 5:
            bfban_msg += '(讨论中)'
            break
        case 6:
            bfban_msg += '(需要更多管理投票)'
            break
        case 8:
            bfban_msg += '(刷枪)'
            break
    }
    bfban_msg += tyc_msg[1].personaids[personaId_temp[0].personaId].url ?? ''
    let recent_msg = []
    if (tyc_msg[2].data?.length < 4 ?? false) {
        for (let i = 0; i < tyc_msg[2].data.length; i++) {
            console.log(tyc_msg[2].data[i].name)
            recent_msg.push(tyc_msg[2].data[i].name.substring(0, 30))
        }
    } else if (tyc_msg[2].data?.length > 0 ?? false) {
        for (let i = 0; i < 3; i++) {
            console.log(tyc_msg[2].data[i].name)
            recent_msg.push(tyc_msg[2].data[i].name.substring(0, 30))
        }
    } else {
        console.log('未查询到最近游玩服务器')
        recent_msg.push('未查询到最近游玩服务器')
    }

    let record_msg = `战绩软件查询结果：
浏览量:${tyc_msg[4].data.data.browse} 外挂标记:${tyc_msg[4].data.data.hacker}
怀疑标记:${tyc_msg[4].data.data.doubt}`
    session.send(`
玩家名称：${playername}
personaId:${personaId_temp[0].personaId}
上次游玩时间:${last_play_time}
${eac_msg}
${bfban_msg}
${record_msg}
${recent_msg}
    `)
}

async function utcToChinaTime(utcTimeStr: string) {
    const utcDate = (new Date(`${utcTimeStr.replace('T', ' ')} GMT`))
    const cnDateString = utcDate.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    return cnDateString
}