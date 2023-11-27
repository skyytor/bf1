import { Context, Session, Logger } from 'koishi'
import { Config } from './index'
import * as api from './all_gateway'
import fs from 'fs'

export { collect_serverinfo }
async function collect_serverinfo(ctx: Context, config: Config,) {
    try {
        let info: Array<any> = []

        let result: Array<any> = (await api.serverinfo(ctx, config, '')).data.gameservers

        result.map(item => {
            info.push(item.gameId)
        })
        let all_server_info = await Promise.all(info.map(item => {
            return api.getServerDetails(ctx, config, item)
        }))

        console.log(all_server_info[0].data.rspInfo.server.serverId)
        //fs.writeFileSync('test.json',all_server_info[0].data)
    } catch (error) {
        console.log(error)
    }

}



