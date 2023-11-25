import { Context, Session, Logger } from 'koishi'
import { Config } from './index'
import * as api from './all_gateway'
import fs from 'fs/promises'

export { collect_serverinfo }
async function collect_serverinfo(ctx: Context, config: Config,) {
    try {
        let info = []
        let result = await api.serverinfo(ctx, config, '')
        //let gameids: Array<any> = (result.result.gameservers).map(item => item.gameId)
        let gameids = ['8623825810572', '8622725630496', '8622725030466', '8623325830789',]
        gameids.map(item => {
            return api.getServerDetails(ctx, config, item)
        })
        await fs.writeFile(__dirname + '/all_server_fullinfo.json', JSON.stringify(info))
    } catch (error) {

    }

}



