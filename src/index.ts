import { Context, Schema, h, Logger, Session } from 'koishi'
import { scheduleJob } from 'node-schedule'

import { dbextend } from './database'
import * as api from './all_gateway'
import { } from '@koishijs/plugin-help'
import { command } from './command'
import { refresh_self } from './server_manager_account'

export const name = 'index'
export interface Config {
  bf1_accounts_personaId_list: Array<string>
}

export const Config: any = Schema.object({
  bf1_accounts_personaId_list: Schema.array(String).role('table')
    .description('在这里填写你的服管账号的personaId'),
})
const logger = new Logger(name)
export const usage = `
 ## 注意事项
使用相关api查询时默认使用你在本页面下填写的第一个服管账号
`

declare module 'koishi' {
  interface Tables {
    player: api.player
    server: api.server
    account: api.account
    bf1group: api.bf1group
  }
}

export function apply(ctx: Context, config: Config) {

  dbextend(ctx)

  scheduleJob('0 0 0/2 * * ? ', () => {
    logger.info(new Date().toLocaleString())
    Promise.all(config.bf1_accounts_personaId_list.map(personaId_temp => refresh_self(ctx, personaId_temp)))
  })

  command(ctx, config)

}
