import { Context, Logger, h } from 'koishi'
import * as api from './all_gateway'
import { Config } from './index'
const logger = new Logger('weekly_impact')

export { bf1stat, campaign, exchange }
async function bf1stat(ctx: Context, config: Config, session: any) {

    let temp = await ctx.database.get('bf1_dau', { id: (await ctx.database.stats()).tables.bf1_dau.count })
    if (temp.length === 0)
        session.send('读取数据失败，数据库为空')

    else {
        session.send(
            `----
获取时间： ${temp[temp.length - 1].time.toLocaleString()}
bf1总在线人数:  ${temp[temp.length - 1].all_dau}  
亚洲人数：${temp[temp.length - 1].asia_dau}
欧洲人数：${temp[temp.length - 1].europe_dau}  
官服人数：${temp[temp.length - 1].official_dau}
私服人数：${temp[temp.length - 1].private_dau}
`)
    }
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
    if (result.data == null) {
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
