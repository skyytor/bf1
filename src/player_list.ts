import { Context, Logger, h } from 'koishi'
import path, { resolve } from "path"
import * as api from './all_gateway'
import { Config } from './index'
export { render_playerlist }

const logger = new Logger('player_list')

export { playerlist13 }

let MapTeamDict = {
    "MP_MountainFort": { "Chinese": "格拉巴山", "Team1": "ITA", "Team2": "AHU" },
    "MP_Forest": { "Chinese": "阿尔贡森林", "Team1": "USA", "Team2": "GER" },
    "MP_ItalianCoast": { "Chinese": "帝国边境", "Team1": "ITA", "Team2": "AHU" },
    "MP_Chateau": { "Chinese": "流血宴厅", "Team1": "USA", "Team2": "GER" },
    "MP_Scar": { "Chinese": "圣康坦的伤痕", "Team1": "GER", "Team2": "UK" },
    "MP_Desert": { "Chinese": "西奈沙漠", "Team1": "UK", "Team2": "OTM" },
    "MP_Amiens": { "Chinese": "亚眠", "Team1": "GER", "Team2": "UK" },
    "MP_Suez": { "Chinese": "苏伊士", "Team1": "UK", "Team2": "OTM" },
    "MP_FaoFortress": { "Chinese": "法欧堡", "Team1": "UK", "Team2": "OTM" },
    "MP_Giant": { "Chinese": "庞然暗影", "Team1": "GER", "Team2": "UK" },
    "MP_Fields": { "Chinese": "苏瓦松", "Team1": "FRA", "Team2": "GER" },
    "MP_Graveyard": { "Chinese": "决裂", "Team1": "FRA", "Team2": "GER" },
    "MP_Underworld": { "Chinese": "法乌克斯要塞", "Team1": "GER", "Team2": "FRA" },
    "MP_Verdun": { "Chinese": "凡尔登高地", "Team1": "GER", "Team2": "FRA" },
    "MP_Trench": { "Chinese": "尼维尔之夜", "Team1": "GER", "Team2": "FRA" },
    "MP_ShovelTown": { "Chinese": "攻占托尔", "Team1": "GER", "Team2": "FRA" },
    "MP_Bridge": { "Chinese": "勃鲁希洛夫关口", "Team1": "RUS", "Team2": "AHU" },
    "MP_Islands": { "Chinese": "阿尔比恩", "Team1": "GER", "Team2": "RUS" },
    "MP_Ravines": { "Chinese": "武普库夫山口", "Team1": "AHU", "Team2": "RUS" },
    "MP_Valley": { "Chinese": "加利西亚", "Team1": "RUS", "Team2": "AHU" },
    "MP_Tsaritsyn": { "Chinese": "察里津", "Team1": "BOL", "Team2": "RUS" },
    "MP_Volga": { "Chinese": "窝瓦河", "Team1": "BOL", "Team2": "RUS" },
    "MP_Beachhead": { "Chinese": "海丽丝岬", "Team1": "UK", "Team2": "OTM" },
    "MP_Harbor": { "Chinese": "泽布吕赫", "Team1": "RM", "Team2": "GER" },
    "MP_Naval": { "Chinese": "黑尔戈兰湾", "Team1": "RM", "Team2": "GER" },
    "MP_Ridge": { "Chinese": "阿奇巴巴", "Team1": "UK", "Team2": "OTM" },
    "MP_Offensive": { "Chinese": "索姆河", "Team1": "UK", "Team2": "GER" },
    "MP_Hell": { "Chinese": "帕斯尚尔", "Team1": "UK", "Team2": "GER" },
    "MP_River": { "Chinese": "卡波雷托", "Team1": "AHU", "Team2": "ITA" },
    "MP_Alps": { "Chinese": "剃刀边缘", "Team1": "GER", "Team2": "UK" },
    "MP_Blitz": { "Chinese": "伦敦的呼唤：夜袭", "Team1": "GER", "Team2": "UK" },
    "MP_London": { "Chinese": "伦敦的呼唤：灾祸", "Team1": "GER", "Team2": "UK" }
}

async function playerlist13(ctx: Context, config: Config, session: any, servername: string) {
    try {
        console.log('正在执行13')
        /* let result = await api.serverinfo(ctx, config, servername)
        console.log(result.data.gameservers)
        if (!result.data.gameservers) {
            session.send('未搜索到服务器，请注意服务器名是否正确!')
            return
        } */
        let self = (await api.playerlist13(ctx, '8681124610562')).data

        if (!self.data.data.GDAT[0].ROST)
            return '当前服务器无人'
        //处理数据
        //console.log(self.data.data.GDAT[0].ROST)

        //canvas画图
        return render_playerlist(ctx, config, session, self)
    } catch (error) {
        logger.info('无法获取到玩家列表,ip可能被封锁')
        console.log(error)
    }
}

async function render_playerlist(ctx: Context, config, session, self) {
    //根据当前服务器地图为背景
    //let pic = Random.pick(fs.readdirSync(path.resolve(__dirname, './assets/bf1-images-resource/Maps'), 'utf8'))
    let image = await ctx.canvas.loadImage(path.resolve(__dirname, './assets/bf1-images-resource/Maps/' + self.data.data.GDAT[0].ATTR.level + '.jpg'))
    let team1 = await ctx.canvas.loadImage(path.resolve(__dirname, './assets/bf1-images-resource/Teams/' + MapTeamDict[self.data.data.GDAT[0].ATTR.level].Team1 + '.png'))
    return ctx.canvas.render(1920, 1220, async (ctx) => {
        let base_draw_loc_x1 = 140
        let base_draw_loc_x2 = 1000
        let base_draw_loc_y = 220

        //创建背景，高斯模糊
        ctx.drawImage(image, 0, 0, 1920, 1220)
        var data = ctx.getImageData(0, 0, 1920, 1220);
        var emptyData = gaussBlur(data);
        ctx.putImageData(emptyData, 0, 0);

        //绘制服务器名称
        ctx.font = 'normal 50px zpix'
        ctx.fillStyle = 'white'
        ctx.textAlign = "center"
        ctx.fillText('NoobOnly/kd<1.8,kpm<1.6/150whitelist/qun182964500', 960, 80)
        ctx.font = 'bold 20px'
        ctx.fillText('序号', base_draw_loc_x1, base_draw_loc_y - 30)
        ctx.fillText('等级', base_draw_loc_x1 + 60, base_draw_loc_y - 30)
        ctx.fillText('玩家名称', base_draw_loc_x1 + 150, base_draw_loc_y - 30)
        ctx.fillText('胜率', base_draw_loc_x1 + 440, base_draw_loc_y - 30)
        ctx.fillText('kd', base_draw_loc_x1 + 520, base_draw_loc_y - 30)
        ctx.fillText('kpm', base_draw_loc_x1 + 600, base_draw_loc_y - 30)
        ctx.fillText('时长', base_draw_loc_x1 + 680, base_draw_loc_y - 30)
        ctx.fillText('延迟', base_draw_loc_x1 + 780, base_draw_loc_y - 30)

        ctx.fillText('序号', base_draw_loc_x2, base_draw_loc_y - 30)
        ctx.fillText('等级', base_draw_loc_x2 + 60, base_draw_loc_y - 30)
        ctx.fillText('玩家名称', base_draw_loc_x2 + 150, base_draw_loc_y - 30)
        ctx.fillText('胜率', base_draw_loc_x2 + 440, base_draw_loc_y - 30)
        ctx.fillText('kd', base_draw_loc_x2 + 520, base_draw_loc_y - 30)
        ctx.fillText('kpm', base_draw_loc_x2 + 600, base_draw_loc_y - 30)
        ctx.fillText('时长', base_draw_loc_x2 + 680, base_draw_loc_y - 30)
        ctx.fillText('延迟', base_draw_loc_x2 + 780, base_draw_loc_y - 30)
        //绘制队伍名称，图片
        ctx.drawImage(team1, base_draw_loc_x1, 80, 80, 80)

        //绘制分隔线
        ctx.strokeStyle = 'grey'
        ctx.moveTo(960, 220)
        ctx.lineTo(960, 1200)

        ctx.moveTo(100, 200)
        ctx.lineTo(1800, 200)

        ctx.moveTo(100, 240)
        ctx.lineTo(100, 1200)

        ctx.moveTo(960, 200)
        ctx.lineTo(960, 1200)
        ctx.stroke()
        let player: Array<any> = self.data.data.GDAT[0].ROST
        console.log(player)

        let team_all = await team_merge(ctx, config, player)



        for (let [n, item] of team_all.team1.entries()) {
            //绘制玩家序号
            ctx.textAlign = 'center'
            ctx.font = 'normal 22px'
            ctx.fillText((n + 1).toString(), base_draw_loc_x1, 237 + n * 30)

            //绘制等级
            ctx.textAlign = 'left'
            ctx.font = 'bold 18px'
            ctx.strokeStyle = 'white'
            ctx.strokeRect(base_draw_loc_x1 + 40, 220 + n * 30, 40, 20)
            ctx.textAlign = "center"
            ctx.textBaseline = 'middle';
            ctx.fillText(item.PATT.rank ?? '未知', base_draw_loc_x1 + 60, 230 + n * 30)

            //绘制玩家id
            ctx.textBaseline = 'alphabetic'
            ctx.textAlign = 'left'
            ctx.font = 'normal 26px'
            ctx.fillText(item.NAME, base_draw_loc_x1 + 110, 240 + n * 30)

            //绘制玩家胜率，kd，kpm，游戏时长，延迟
            ctx.textAlign = 'left'
            ctx.font = 'normal 22px'
            ctx.fillText('60%' ?? '未知', base_draw_loc_x1 + 420, 240 + n * 30)
            ctx.fillText('1.81' ?? '未知', base_draw_loc_x1 + 500, 240 + n * 30)
            ctx.fillText('1.12' ?? '未知', base_draw_loc_x1 + 580, 240 + n * 30)
            ctx.fillText('1314.6' ?? '未知', base_draw_loc_x1 + 660, 240 + n * 30)
            ctx.fillText(item.PATT.latency ?? '-1', base_draw_loc_x1 + 760, 240 + n * 30)
        }
        for (let [n, item] of team_all.team2.entries()) {
            //绘制玩家序号
            ctx.textAlign = 'center'
            ctx.font = 'normal 22px'
            ctx.fillText((n + 1).toString(), base_draw_loc_x2, 237 + n * 30)

            //绘制等级
            ctx.textAlign = 'left'
            ctx.font = 'bold 18px'
            ctx.strokeStyle = 'white'
            ctx.strokeRect(base_draw_loc_x2 + 40, 220 + n * 30, 40, 20)
            ctx.textAlign = "center"
            ctx.textBaseline = 'middle';
            ctx.fillText(item.PATT.rank ?? '未知', base_draw_loc_x2 + 60, 230 + n * 30)

            //绘制玩家id
            ctx.textBaseline = 'alphabetic'
            ctx.textAlign = 'left'
            ctx.font = 'normal 26px'
            ctx.fillText(item.NAME, base_draw_loc_x2 + 110, 240 + n * 30)

            //绘制玩家胜率，kd，kpm，游戏时长，延迟
            ctx.textAlign = 'left'
            ctx.font = 'normal 22px'
            ctx.fillText('60%' ?? '未知', base_draw_loc_x2 + 420, 240 + n * 30)
            ctx.fillText('1.81' ?? '未知', base_draw_loc_x2 + 500, 240 + n * 30)
            ctx.fillText('1.12' ?? '未知', base_draw_loc_x2 + 580, 240 + n * 30)
            ctx.fillText('1314.6' ?? '未知', base_draw_loc_x2 + 660, 240 + n * 30)
            ctx.fillText(item.PATT.latency ?? '-1', base_draw_loc_x2 + 760, 240 + n * 30)
        }
    })
}

async function team_merge(ctx, config, team_info: Array<any>) {
    let team1: Array<any> = []
    let team2: Array<any> = []
    let team3: Array<any> = []
    for (let i of team_info) {
        if (i.TIDX === 0) {
            if (i.PATT.rank)
                team1.unshift(i)
            else
                team1.push(i)
        }
        else if (i.TIDX === 1) {
            if (i.PATT.rank)
                team2.unshift(i)
            else
                team2.push(i)
        }
        else
            team3.unshift(i)
    }

    team1.sort((a, b) => b.PATT.rank - a.PATT.rank)
    team2.sort((a, b) => b.PATT.rank - a.PATT.rank)

    let get_stat = await Promise.all([
        team1.map(element => {
            try {
                return Object.assign(team1, api.playerinfo(ctx, config, [element.PID]))
            } catch (error) { }
        }),
        team2.map(element => {
            try {
                return Object.assign(team2, api.playerinfo(ctx, config, [element.PID]))
            } catch (error) { }
        }),
        team3.map(element => {
            try {
                return Object.assign(team3, api.playerinfo(ctx, config, [element.PID]))
            } catch (error) { }
        }),
    ])



    console.log(get_stat)
    return {
        team1: team1,
        team2: team2,
        team3: team3
    }
}

function gaussBlur(imgData) {
    var pixes = imgData.data;
    var width = imgData.width;
    var height = imgData.height;
    var gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        i, j, k, len;

    var radius = 50;
    var sigma = 30;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;

    }
    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                if (k >= 0 && k < width) {//确保 k 没超出 x 的范围
                    //r,g,b,a 四个一组
                    i = (y * width + k) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
            // pixes[i + 3] = a ;
        }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;
                if (k >= 0 && k < height) {//确保 k 没超出 y 的范围
                    i = (k * width + x) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
        }
    }
    return imgData;
}