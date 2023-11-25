import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('weekly_impact')

export { bf1stat, campaign, exchange }
async function bf1stat(ctx: Context, config: Config, session: any) {
    let result = await api.bf1stat(ctx)
    session.send(String(h('quote', { id: session.messageId })) +
        `bf1总在线人数:  ${result.data.regions.ALL.amounts.soldierAmount}  
bf1开启服务器总数:  ${result.data.regions.ALL.amounts.serverAmount}
亚洲人数:  ${result.data.regions.Asia.amounts.soldierAmount}
亚洲开启服务器数:  ${result.data.regions.Asia.amounts.serverAmount}
欧洲人数:  ${result.data.regions.EU.amounts.soldierAmount}  
欧洲开启服务器数: ${result.data.regions.EU.amounts.serverAmount}`)
}

async function exchange(ctx: Context, config: Config, session: any) {
    let result = await api.exchange(ctx, config)
    let exchangetype = []
    let exchangerare = []
    for (let i of result.data.items) {
        if (!exchangetype.includes(i.item.parentName)) {
            exchangetype.push(i.item.parentName)
        }
        if (i.price === 2000) {
            exchangerare.push(i.item.parentName + ' ' + i.item.name)
        }
    }
    session.send(String(h('quote', { id: session.messageId })) +
        `本周交换\n${exchangetype.join('\n')}其中金皮有:\n${exchangerare.join('\n')}`)
}

async function campaign(ctx: Context, config: Config, session: any) {
    let result = await api.campaign(ctx, config)
    console.log(result)
    if (result.data==null) {
        await session.send('当前暂无行动')
        return
    }
    await session.send(
        String(h('quote', { id: session.messageId })) +
        `本次行动战役:${result.data.name}
${result.data.op1.name} ${result.data.op2.name}
本次行动剩余时间:${(result.data.minutesRemaining / 1440).toFixed(0)}天
每日箱子重置剩余时间:${(result.data.minutesToDailyReset / 60).toFixed(0)}小时`)
}
