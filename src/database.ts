import { Context, Session, Logger } from 'koishi'
export { dbextend }
const bf = new Logger('database')

async function dbextend(ctx: Context) {
    ctx.model.extend('player', {
        qq: {
            type: 'string',
            nullable: false
        },
        displayName: {
            type: 'string',
            nullable: false
        },
        personaId: {
            type: 'string',
            nullable: false
        }
    }, {
        primary: 'personaId'
    }
    )

    ctx.model.extend('server', {
        serverId: {
            type: 'string',
            nullable: false
        },
        servername: {
            type: 'string',
            nullable: false
        },
        gameid: {
            type: 'string',
            nullable: false
        },
        guid: {
            type: 'string',
            nullable: false
        },
        belong_group: {
            type: 'string',
            nullable: false
        }
    }, {
        primary: 'serverId',
    }
    )

    ctx.model.extend('account', {
        remid: {
            type: 'string',
            nullable: false
        },
        sid: 'string',
        sessionId: 'string',
        personaId: {
            type: 'string',
            nullable: false
        },
        authcode: 'string',
        token: 'string',
        display_name: 'string'
    }, {
        primary: 'personaId'
    }
    )

    ctx.model.extend('bf1group', {
        groupname: {
            type: 'string',
            nullable: false
        },
        group_qq: {
            type: 'string',
            nullable: false
        }
    }, {
        primary: 'groupname'
    })


}
