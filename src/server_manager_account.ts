//写服管账号配置
import { Context, Logger, h, sleep } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('server_manager_account')

export { update_remid, refresh_self }

async function update_remid(ctx: Context, config: Config, session: any, remid: string) {
    try {

        //通过remid获取返回remid，sid，authcode
        let result_get_account = await api.get_account(ctx, { remid: remid })
        if (!result_get_account) {
            session.send('remid失效')
            return
        }
        //通过remid或sid获取返回token，token可以用来根据名字查找personaId
        let result_get_token = await api.get_token(ctx, {
            sid: result_get_account.sid
        })
        //通过authcode获取返回sessionId和personaId
        let result_get_sessionId = await api.get_sessionId(ctx, result_get_account.authCode)
        ctx.database.upsert('account', [{
            personaId: result_get_sessionId.personaId,
            remid: result_get_account.remid,
            sid: result_get_account.sid,
            sessionId: result_get_sessionId.sessionId,
            authcode: result_get_account.authCode,
            token: result_get_token,

        }])
        await sleep(500)

        //api.playerinfo读取的是数据库的sessionId，故不能合并到一块upsert,还有不能太快，，否则第一次读不到数据库的sessionId
        let result_get_displayName = await api.playerinfo(ctx, config, [result_get_sessionId.personaId])
        console.log('123')
        console.log(result_get_displayName)
        ctx.database.upsert('account', [{
            personaId: result_get_sessionId.personaId,
            display_name: result_get_displayName.data[result_get_sessionId.personaId].displayName
        }])
        session.send(String(h('quote', { id: session.messageId })) + '更新成功')
    } catch (error) {
        console.log('出错了')
    }
}

async function refresh_self(ctx: Context, personaId: string) {
    try {
        let get_account_all = await ctx.database.get('account', {
            personaId: personaId
        })
        if (get_account_all.length == 0)
            return logger.info('未配置服管账号')

        else if (get_account_all[0].remid == '')
            return logger.info('服管账号' + get_account_all[0].personaId + '未配置remid,请使用updateremid来配置服管账号')


        //尝试使用传入sid刷新，返回sid和authcode.如果失败则传入remid刷新，返回remid，sid，authcode
        try {
            let get_account_cookies = await api.get_account(ctx, { sid: get_account_all[0].sid })
            //根据remid，sid获取sessionId
            let get_account_sessionId = await api.get_sessionId(ctx, get_account_cookies.authCode)
            let result_get_token = await api.get_token(ctx, { sid: get_account_cookies.sid })
            ctx.database.upsert('account', [{
                personaId: personaId,
                sid: get_account_cookies.sid,
                authcode: get_account_cookies.authCode,
                sessionId: get_account_sessionId.sessionId,
                token: result_get_token
            }])
            logger.info('personaId' + personaId)
            logger.info('sid' + get_account_cookies.sid)
            logger.info('authCode' + get_account_cookies.authCode)
            logger.info('sessionId' + get_account_sessionId.sessionId)
            logger.info('token' + result_get_token)
        } catch (error) {
            logger.info('使用sid更新失败,尝试使用remid更新')
            let get_account_cookies = await api.get_account(ctx, { remid: get_account_all[0].remid })
            let get_account_sessionId = await api.get_sessionId(ctx, get_account_cookies.authCode)
            let result_get_token = await api.get_token(ctx, { sid: get_account_cookies.sid })
            ctx.database.upsert('account', [{
                personaId: personaId,
                remid: get_account_cookies.remid,
                sid: get_account_cookies.sid,
                authcode: get_account_cookies.authCode,
                sessionId: get_account_sessionId.sessionId,
                token: result_get_token
            }])
        }
    } catch (error) {
        logger.info('自动刷新session时出错:位置:服管账号.ts refresh_self函数')
        console.log(error)
    }
}
