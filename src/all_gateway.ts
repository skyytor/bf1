import { Context, Session, Logger } from 'koishi'
import { Config } from './index'
export { gametools_url, bili22_url, easb_url }
export { account, player, server, bf1group, bf1_dau, test, self_account }
export { headers, params, datas, filterJson }
export { get_account, get_sessionId, get_token, get_personaId, post }

const logger = new Logger('api')

interface account {
    id: number
    remid: string
    sid: string
    sessionId: string
    personaId: string
    authcode: string
    token: string
    display_name: string
    set_account_remid: (remid: string) => void
    set_account_sid: (sid: string) => void
    set_account_sessionId: (sessionId: string) => void
    set_account_personaId: (personaId: string) => void
}

interface player {
    qq: string
    displayName: string
    personaId: string
}

interface server {
    serverId: string
    servername: string
    gameId: string
    guid: string
    belong_group: string
    server_order: string
}

interface bf1group {
    groupname: string
    group_qq: string
}

interface bf1_dau {
    id: number
    time: Date
    all_dau: number
    asia_dau: number
    europe_dau: number
    official_dau: number
    private_dau: number

}

interface test {
    id: number
    file: JSON
}



let self_account: account = {
    id: null,
    remid: null,
    sid: null,
    sessionId: null,
    authcode: null,
    token: null,
    display_name: null,
    personaId: null,
    set_account_remid: (remid: string) => {
        self_account.remid = remid
    },
    set_account_sid: (sid: string) => {
        self_account.remid = sid
    },
    set_account_sessionId: (sessionId: string) => {
        self_account.remid = sessionId
        headers['X-Gatewaysession'] = sessionId
    },
    set_account_personaId: (personaId: string) => {
        self_account.personaId = personaId
    }
}

const gametools_url: string = 'https://api.gametools.network/bf1/'
const bili22_url: string = 'https://sparta-gw.battlelog.com/jsonrpc/pc/api'
const easb_url: string = 'https://delivery.easb.cc/games/'

let headers = {
    'Content-Type': 'text/json',
    'X-Gatewaysession': self_account.sid
}

let params = {
    name: null,
    platform: 'pc',
    skip_battlelog: 'false',
    personaId: null,
    lang: 'zh-tw',
    limit: 8
}

let datas = {
    jsonrpc: '2.0',
    method: '',
    params: {
        game: 'tunguska',
        gameId: null,
        personaId: null,
        reason: '違反規則',
        serverId: null,
        persistedGameId: null,
        levelIndex: null,
        filterJson: null,
        personaIds: null,
        limit: 200
    },
    id: null
}

let error_code_collection = {
    "-32501": "session失效,请注意刷新session",
    "-32504": "连接超时",
    "-34501": "找不到服务器",
    "-32601": "方法不存在",
    "-32602": "请求无效/格式错误",
    "-35150": "战队不存在",
    "-35160": "无权限",
    "-32603": "该账号可能没有对应的权限，也可能是其他问题",
    "-32850": "服务器栏位已满/玩家已在栏位",
    "-32851": "服务器不存在/已过期",
    "-32856": "该玩家没玩过bf1",
    "-32857": "无法处置管理员",
    "-32858": "服务器未开启",
}

let filterJson = {
    _filterJson: {
        //所有值都是可选的, 要什么写什么就行, 在getGameData有详细的
        name: 'dice',
        serverType: {
            //服务器类型
            OFFICIAL: 'on', //官服
            RANKED: 'on', //私服
            UNRANKED: 'on', //私服(不计战绩)
            PRIVATE: 'on' //密码服
        },
        gameModes: {
            //模式
            ZoneControl: 'on',
            AirAssault: 'on',
            TugOfWar: 'on',
            Domination: 'on',
            Breakthrough: 'on',
            Rush: 'on',
            TeamDeathMatch: 'on',
            BreakthroughLarge: 'on',
            Possession: 'on',
            Conquest: 'on'
        },
        slots: {
            //空位
            oneToFive: 'on', //1-5
            sixToTen: 'on', //6-10
            none: 'on', //无
            tenPlus: 'on', //10+
            all: 'on', //全部
            spectator: 'on' //观战
        },
        regions: {
            //地区
            OC: 'on', //大洋
            Asia: 'on', //亚
            EU: 'on', //欧
            Afr: 'on', //非
            AC: 'on', //南极洲(真有人吗)
            SAm: 'on', //南美
            NAm: 'on' //北美
        }
    },
    get_filterJson() {
        return this._filterJson
    },

    set_filterJson(if_open_official: string) {

        this._filterJson.serverType.OFFICIAL = if_open_official
    },
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function error_handle(error_code: string) {
    const keys = Object.keys(error_code_collection)
    if (keys.indexOf(error_code) > -1)
        return {
            data: error_code,
            error: error_code_collection[error_code]
        }

    else return {
        data: null,
        error: '出现错误，但未找到该错误代码所对应的问题，错误代码:' + error_code
    }
}

//此处的ctx不能声明为context类型，原因未知
async function get_account(ctx: any, { remid, sid }: any = {}) {

    try {
        if (!remid && !sid) throw new Error('未提供Cookie')
        const Cookie = `${remid ? `remid=${remid};` : ''}${sid ? `sid=${sid};` : ''}`
        let result = await ctx.http.axios({
            url: 'https://accounts.ea.com/connect/auth?response_type=code&locale=zh_CN&client_id=sparta-backend-as-user-pc&display=junoWeb%2Flogin',
            method: 'get',
            headers: { Cookie: Cookie },
            validateStatus: () => true, // 返回所有响应
            maxRedirects: 0 // 禁止重定向
        })
        if (remid && !sid) {
            try {
                let location = result.headers.location
                if (location.match('fid=')) {
                    logger.info('remid失效')
                    return {
                        remid: null,
                        sid: null,
                        authCode: null
                    }

                }

                let authCode = location.replace(/.*code=(.*)/, '$1')
                let newCookie = result.headers.get('set-cookie')
                console.log(newCookie)
                const matchremid = newCookie[0].match(/remid=([^;]+)/)
                remid = matchremid[1]
                let matchsid = newCookie[1].match(/sid=([^;]+)/)
                sid = matchsid[1]
                return {
                    remid: remid,
                    sid: sid,
                    authCode: authCode
                }
            } catch (error) {
                console.log('根据remid获取session时出错')
            }
        } else if (sid && !remid) {
            try {
                let location = result.headers.location
                if (location.match('fid=')) {
                    logger.info('sid失效')
                    return {
                        remid: null,
                        sid: null,
                        authCode: null
                    }
                }
                let authCode = location.replace(/.*code=(.*)/, '$1')
                let newCookie = result.headers.get('set-cookie')
                let matchsid = newCookie[0].match(/sid=([^;]+)/)
                sid = matchsid[1]
                return {
                    remid: null,
                    sid: sid,
                    authCode: authCode
                }
            } catch (error) {
                console.log('根据sid获取session时出错')
            }
        }
    } catch (error) {
        logger.info('自动获取sid,authcode时出错')
        console.log(error)
    }
}
//根据authcode来获取sessionId
async function get_sessionId(ctx: Context, authCode: string) {

    try {
        let login = await ctx.http.axios({
            url: bili22_url,
            method: 'post',
            data: {
                jsonrpc: '2.0',
                method: 'Authentication.getEnvIdViaAuthCode',
                params: {
                    game: 'tunguska',
                    authCode: authCode,
                    locale: 'zh-tw'
                },
                id: 'null'
            }
        })
        const sessionId = login.data.result.sessionId
        const personaId = login.data.result.personaId
        return {
            sessionId: sessionId,
            personaId: personaId
        }
    } catch (error) {
        logger.info('自动获取sessionId时出错')
    }
}

//根据remid或者sid来获取token
async function get_token(ctx: Context, { remid, sid }: any = {}) {

    if (!remid && !sid) throw new Error('未提供Cookie')
    const Cookie = `${remid ? `remid=${remid};` : ''}${sid ? `sid=${sid};` : ''}`
    let result = await ctx.http.axios({
        url: 'https://accounts.ea.com/connect/auth?response_type=token&locale=zh_CN&client_id=ORIGIN_JS_SDK&redirect_uri=nucleus%3Arest',
        method: 'get',
        headers: { Cookie: Cookie },
        validateStatus: () => true,
        maxRedirects: 0
    })
    return result.data.access_token
}

//根据token来从name获取pid
async function get_personaId(ctx: Context, playername: string, token: string) {

    try {
        let result = await ctx.http.axios({
            url: 'https://gateway.ea.com/proxy/identity/personas?namespaceName=cem_ea_id&displayName=' + playername,
            method: 'get',
            headers: {
                Host: 'gateway.ea.com',
                Accept: 'application/json',
                'X-Expand-Results': true,
                Authorization: 'Bearer ' + token
            }
        })
        console.log(result.data.personas.persona)
        return result.data.personas.persona
    } catch (error) {
        console.log('出错了,可能是token失效')
        console.log(error)
        return 'error,token expired'
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//api函数部分


async function post(ctx: Context, config: Config, data: object) {
    try {
        let get_account_sessionId = await ctx.database.get('account', {
            personaId: config.bf1_accounts_personaId_list[0]
        })
        if (get_account_sessionId.length == 0) throw Error('请在配置页面填写personaId,并使用updateremid指令更新session')
        self_account.set_account_sessionId(get_account_sessionId[0].sessionId)
        let result = await ctx.http.axios({
            url: bili22_url,
            method: 'post',
            headers: headers,
            data: data,
            timeout: 60000,
        })
        return {
            data: result.data.result,
            error: null
        }
    } catch (error) {
        logger.info('通用post请求出错')
        logger.info(error.response.data)
        try {

            return {
                data: null,
                error: await error_handle(error.response.data.error.code + '')
            }
        } catch (error) {
            console.log(error)
            throw Error('未预料的错误')

        }
    }
}

//get
export async function bf1stat(ctx: Context) {

    try {
        let result = await ctx.http.axios({
            url: gametools_url + 'status',
            method: 'get',
            params: params
        })
        return {
            data: result.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }
}

export async function playerlist13(ctx: Context, gameid: string) {
    try {
        let result = await ctx.http.axios({
            url: 'http://127.0.0.1:5000/blaze/getPlayerList',
            method: 'post',
            data: {
                game_ids: [gameid],//这里填写服务器的gameid
                origin: true,
                platoon: false
            },
            timeout: 3000
        })
        return {
            data: result.data,
            error: null
        }
    } catch (error) {
        logger.info('error with bf1playerlist13')
        //console.log(error)
        return {
            data: null,
            error: error.response.data
        }
    }
}

export async function serverinfo(ctx: Context, config: Config, servername: string) {

    filterJson._filterJson.name = servername
    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'GameServer.searchServers',
        params: {
            game: 'tunguska',
            filterJson: JSON.stringify(filterJson._filterJson),
            limit: 200
        },
        id: null
    })

}

//服管部分
export async function kick(ctx: Context, config: Config, gameId: string, personaId: string, reason = '違反規則') {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.kickPlayer',
        params: {
            game: 'tunguska',
            gameId: gameId,
            personaId: personaId,
            reason: reason,
        },
        id: null
    })

}

export async function ban(ctx: Context, config: Config, serverId: string, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.addServerBan',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })

}

export async function unban(ctx: Context, config: Config, serverId: string, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.removeServerBan',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function vip(ctx: Context, config: Config, serverId: string, personaId: string) {


    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.addServerVip',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function unvip(ctx: Context, config: Config, serverId, personaId) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.removeServerVip',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function addadmin(ctx: Context, config: Config, serverId, personaId) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.addServerAdmin',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function removeadmin(ctx: Context, config: Config, serverId, personaId) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.removeServerAdmin',
        params: {
            game: 'tunguska',
            serverId: serverId,
            personaId: personaId
        },
        id: null
    })
}

export async function chooseLevel(ctx: Context, config: Config, persistedGameId, levelIndex) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.chooseLevel',
        params: {
            game: 'tunguska',
            persistedGameId: persistedGameId,
            levelIndex: levelIndex
        },
        id: null
    })
}

//活动交换部分
export async function exchange(ctx: Context, config: Config) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'ScrapExchange.getOffers',
        params: {
            game: 'tunguska',
        },
        id: null
    })
}

export async function campaign(ctx: Context, config: Config) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'CampaignOperations.getPlayerCampaignStatus',
        params: {
            game: 'tunguska',
        },
        id: null
    })
}

//服务器信息部分
export async function getServerDetails(ctx: Context, config: Config, gameId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'GameServer.getFullServerDetails',
        params: {
            game: 'tunguska',
            gameId: gameId

        },
        id: null
    })
}

export async function playerinfo(ctx: Context, config: Config, personaIds) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'RSP.getPersonasByIds',
        params: {
            game: 'tunguska',
            personaIds: personaIds

        },
        id: null
    })
}

//战绩部分
export async function stat(ctx: Context, config: Config, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'Stats.detailedStatsByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function weapon(ctx: Context, config: Config, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'Progression.getWeaponsByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function vehicle(ctx: Context, config: Config, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'Progression.getVehiclesByPersonaId',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function recent_history(ctx: Context, config: Config, personaId: string) {

    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'ServerHistory.mostRecentServers',
        params: {
            game: 'tunguska',
            personaId: personaId

        },
        id: null
    })
}

export async function is_playing(ctx: Context, config: Config, personaId: string) {


    return await post(ctx, config, {
        jsonrpc: '2.0',
        method: 'GameServer.getServersByPersonaIds',
        params: {
            game: 'tunguska',
            personaIds: [personaId]
        },
        id: null
    })
}
//战地查询战绩软件的浏览量，外挂，可疑标记数
export async function record_getReport(ctx: Context, config: Config, personaId: string) {

    try {
        let result = await ctx.http.axios({
            url: 'https://record.ainios.com/getReport',
            method: 'post',
            data: { personaId: personaId }
        })
        return {
            data: result.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }

}

export async function bfeac_api(ctx: Context, playname: string) {

    try {
        let result = await ctx.http.axios({
            url: 'https://api.bfeac.com/case/EAID/' + playname,
            method: 'get'
        })
        return result.data
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }

}

export async function bfban_api(ctx: Context, personaId: string) {

    try {
        let result = await ctx.http.axios({
            url: 'https://api.gametools.network/bfban/checkban?personaids=' + personaId,
            method: 'get'
        })
        return result.data
    } catch (error) {
        return {
            data: null,
            error: error.response.data
        }
    }


}
