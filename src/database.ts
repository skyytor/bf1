import { Context, Logger } from 'koishi'
export { dbextend }
const db = new Logger('database')

async function dbextend(ctx: Context) {
    ctx.model.extend('EA_player', {
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

    ctx.model.extend('EA_server', {
        serverId: {
            type: 'string',
            nullable: false
        },
        servername: {
            type: 'string',
            nullable: false
        },
        gameId: {
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
        },
        server_order: {
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

    ctx.model.extend('bf1_group', {
        group_name: {
            type: 'string',
            nullable: false
        },
        group_id: {
            type: 'string',
            nullable: false
        }
    }, {
        primary: 'group_name'
    })

    ctx.model.extend('bf1_dau', {
        id: {
            type: 'integer',
            initial: 0
        },
        time: {
            type: 'timestamp',
        },
        all_dau: {
            type: 'integer',
        },
        asia_dau: {
            type: 'integer',
        },
        europe_dau: {
            type: 'integer',
        },
        official_dau: {
            type: 'integer',
        },
        private_dau: {
            type: 'integer',
        }
    }, {
        primary: 'id',
        autoInc: true
    })


}

