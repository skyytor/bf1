import { Context, Session, Logger } from 'koishi'
import { Config } from './index'
import * as api from './all_gateway'
import fs from 'fs/promises'

export { collect_serverinfo }
async function collect_serverinfo(ctx: Context, config: Config,) {
    try {
        let all_server_gameId: Array<any> = []
        let servers_status: {
            all_servers_status: Array<any>,
            private_server_status: Array<any>,
            official_server_status: Array<any>,
            asia_server_status: Array<any>,
            europe_servers_status: Array<any>,
        } = {
            all_servers_status: [],
            private_server_status: [],
            official_server_status: [],
            asia_server_status: [],
            europe_servers_status: []
        }
        let dau: {
            all_dau: number,
            private_dau: number,
            official_dau: number,
            asia_dau: number,
            europe_dau: number,

        } = {
            all_dau: 0,
            private_dau: 0,
            official_dau: 0,
            asia_dau: 0,
            europe_dau: 0
        }
        let cacl_total_dau = []//计算dau
        api.filterJson.set_filterJson('on')
        for (let i = 0; i < 100; i++) {
            cacl_total_dau.push(api.serverinfo(ctx, config, ''));
        }

        let result = await Promise.all(cacl_total_dau)
        //console.log(result)
        for (let i of result) {
            for (let j of i.data.gameservers) {
                if (all_server_gameId.indexOf(j.gameId) === -1) {
                    all_server_gameId.push(j.gameId)
                    servers_status.all_servers_status.push(j)
                    let temp_current: number = j.slots.Soldier.current + j.slots.Queue.current + j.slots.Spectator.current
                    dau.all_dau += temp_current

                    if (j.region === 'EU') {
                        dau.europe_dau += temp_current
                    }
                    if (j.region === 'Asia') {
                        dau.asia_dau += temp_current
                    }
                    if (j.serverType === 'OFFICIAL') {
                        dau.official_dau += temp_current
                    }
                    if (j.serverType === 'RANKED') {
                        dau.private_dau += temp_current
                    }
                }
            }
        }
        ctx.database.upsert('bf1_dau', [{
            time: new Date(),
            all_dau: dau.all_dau,
            asia_dau: dau.asia_dau,
            europe_dau: dau.europe_dau,
            private_dau: dau.private_dau,
            official_dau: dau.official_dau
        }])

    } catch (error) {
        console.log(error)
    }

}



