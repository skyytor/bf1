import { Context, Session, Logger, h } from 'koishi'
import { } from './database'
const logger = new Logger('player_recent')
interface player {
    map: string,
    server: string,
    Kills: number,
    Deaths: number,
    kd: number,
    Accuracy: string,
    Time: number,
    kpm: number,
}

let mapkey = {
    "Monte Grappa ": "拉粑粑山",
    "Argonne Forest ": "阿尔贡森林",
    "Empire&#39;s Edge ": "帝国边境",
    "Ballroom Blitz ": "流血宴厅",
    "St. Quentin Scar ": "圣康坦",
    "Sinai Desert ": "西奈沙漠",
    "Amiens ": "亚眠",
    "Suez ": "苏伊士",
    "Fao Fortress ": "法欧堡",
    "Giant&#39;s Shadow ": "庞然暗影",
    "Soissons ": "苏瓦松",
    "Rupture ": "决裂",
    "Fort De Vaux ": "法乌克斯要塞",
    "Verdun Heights ": "凡尔登",
    "Nivelle Nights ": "尼哥之夜",
    "Prise de Tahure ": "攻占托尔",
    "Brusilov Keep ": "勃鲁西洛夫关口",
    "Albion ": "阿尔比恩",
    "ŁUPKÓW PASS ": "武普库夫山口",
    "Galicia ": "加利西亚",
    "Tsaritsyn ": "察里津",
    "Volga River ": "窝瓦河",
    "Cape Helles ": "海丽丝岬",
    "Zeebrugge ": "泽布吕赫",
    "Heligoland Bight ": "黑尔戈兰湾",
    "Achi Baba ": "阿奇巴巴",
    "River Somme ": "索姆河",
    "Passchendaele ": "帕斯尚尔",
    "Caporetto ": "卡波雷托",
    "Razor&#39;s Edge": "剃刀边缘",
    "London Calling:Raiders ": "伦敦的呼唤：夜袭",
    "London Calling:Scourge ": "伦敦的呼唤：灾祸",
}

async function httpinfo(ctx: Context, url: string) {
    try {
        const result = await ctx.http.axios({
            url: url,
            method: 'get',
            headers: {
                "Connection": "keep-alive",
                "User-Agent": "ProtoHttp 1.3/DS 15.1.2.1.0 (Windows)",
            },
        })
        return result
    } catch (err) {
        console.log('获取战绩出错喽')
        return '获取战绩出错'
    }
}

/* export async function btrinfo(ctx: Context, session: any, playername: string) {
    try {
        let result: any = await httpinfo(ctx, 'https://battlefieldtracker.com/bf1/profile/pc/' + name + '/matches')
        const parser = new DOMParser()
        const doc1 = parser.parseFromString(result.data, 'text/html')
        const matchEls = doc1.getElementsByClassName('match');
        let info = []
        for (let i of matchEls) {
            info.push(i.attributes[1].value)
        }
        return info
    } catch {
        console.log('error func btrinfo')
    }
    //从这开始对获取到的前3个数据进行处理
} */
/* 
export async function op(ctx: Context, session: any, playername: string) {
    try {
        let info: any
        for (let temp = 0; temp < 5; temp++) {
            console.log('正在尝试重新获取' + playername + '第' + (temp + 1) + '次的信息')
            info = await btrinfo(ctx, session, playername)
            if (info == '获取战绩出错' || info == undefined || info.length == 0) { }
            else {
                break
            }
        }
        console.log(info)
        if (info.length == 0) {
            session.send(String(h('quote', { id: (session.messageId) })) + '无法获取到btr信息，ip可能被封锁')
            return
        }
        let recent = []
        let order = 0
        let recent1 = await Promise.all([
            recent[0] = opmessagge(ctx, info, order),
            recent[1] = opmessagge(ctx, info, order + 1),
            recent[2] = opmessagge(ctx, info, order + 2),
        ])
        await session.send(String(h('quote', { id: (session.messageId) })) + recent1)
    } catch (err) {
        session.send('在处理最近战绩时发生错误')
        logger.info(err)
    }
} */

/* export async function opmessagge(ctx: Context, info: any, order: number) {
    let res1: any = await httpinfo(ctx, 'https://battlefieldtracker.com' + info[order])
    if (res1 == '获取战绩出错') {
        for (let temp = 0; temp < 5; temp++) {
            console.log('正在尝试重新获取第' + order + '次战绩第' + (temp + 1) + '次的信息')
            res1 = await httpinfo(ctx, 'https://battlefieldtracker.com' + info[order])
            if (res1 != '获取战绩出错')
                break
        }
    }
    if (!res1) {
        return '出错了'
    }
    const parser = new DOMParser()
    const doc2 = parser.parseFromString(res1.data, 'text/html')
    const playernode = doc2.getElementsByClassName('player active');
    //第2，4子节点分别为player-header，player-details-container
    let stats = playernode[0].childNodes[3].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3]
    let player: player = {
        map: '',
        server: '',
        Kills: 0,
        Deaths: 0,
        kd: 0,
        Accuracy: '',
        Time: 0,
        kpm: 0,
    }
    let j: any = 0
    for (j in stats.childNodes) {
        if (j % 2 == 1) {

            switch (stats.childNodes[j].childNodes[3].innerHTML) {
                case 'Kills':
                    player.Kills = stats.childNodes[j].childNodes[1].innerHTML
                    break
                case 'Deaths':
                    player.Deaths = stats.childNodes[j].childNodes[1].innerHTML
                    console.log('死亡' + stats.childNodes[j].childNodes[1].innerHTML)
                    break
                case 'K/D Ratio':
                    if (stats.childNodes[j].childNodes[1].innerHTML == '-') {
                        player.kd = 0
                    }
                    else {
                        player.kd = stats.childNodes[j].childNodes[1].innerHTML
                    }
                    break
                case 'Accuracy':
                    player.Accuracy = stats.childNodes[j].childNodes[1].innerHTML
                    break
                case 'Time Played':
                    player.Time = stats.childNodes[j].childNodes[1].innerHTML
                    let sminute = stats.childNodes[j].childNodes[1].innerHTML.search('m')
                    let minute = (stats.childNodes[j].childNodes[1].innerHTML.substring(sminute - 2, sminute))
                    console.log('分' + minute)
                    let ssecond = stats.childNodes[j].childNodes[1].innerHTML.search('s')
                    let second = (stats.childNodes[j].childNodes[1].innerHTML.substring(ssecond - 2, ssecond))
                    console.log('秒' + second)
                    try {
                        if (stats.childNodes[j].childNodes[1].innerHTML.substring(sminute - 2, sminute) == '') {

                        }
                        player.kpm = +(
                            player.Kills / (+minute + (second / 60))
                        ).toFixed(2)
                        console.log('击杀' + player.Kills + '--')
                        console.log('时间' + (+minute + (second / 60)) + '--')
                    } catch {

                        player.kpm = player.Kills
                    }
                    break
            }
        }
    }
    const map = doc2.getElementsByClassName('map-name')
    player.map = map[0].childNodes[0].textContent
    if (player.map == "Fort De Vaux")
        console.log('一样')
    else if (player.map == 'Fort De Vaux ') {
        console.log('有个空格')
    }
    else {
        console.log('1' + player.map + '1')
        console.log('1' + "Fort De Vaux" + '1')
    }
    const keys = Object.keys(mapkey);
    const hasKey = keys.indexOf(player.map) > -1;
    console.log(hasKey)
    if (hasKey)
        player.map = mapkey[player.map]
    player.server = map[0].childNodes[1].textContent

    let message: string = `
${player.server.substring(0, 25)}
${player.map}
击杀:${(player.Kills.toString()).padEnd(8)}死亡:${player.Deaths}
kd:${(player.kd.toString()).padEnd(10)}kpm:${player.kpm}
命中率:${player.Accuracy}
游玩时长:${player.Time}    `
    return message
} */

/* export async function oprecent(ctx: Context, session: any, playername: string) {
    console.log(!playername)
    if (!playername) {

        let result = await ctx.database.get('player', {
            qq: session.userId
        })
        console.log(result)
        if (result.length == 0) {
            session.send(String(h('quote', { id: (session.messageId) })) + '请先绑定你的id或使用"#最近 你的id"来查询')
            return
        }
        playername = result[0].displayName
        await op(ctx, session, playername)

    }
    else {
        await op(ctx, session, playername)
    }
} */