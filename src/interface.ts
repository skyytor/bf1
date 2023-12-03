import * as api from './all_gateway'

export { account, EA_player, EA_server, bf1_group, bf1_dau }
export { account_Impl }
interface account {
    id: number
    remid: string
    sid: string
    sessionId: string
    personaId: string
    authcode: string
    token: string
    display_name: string


    get get_account_id(): number
    get get_account_remid(): string
    get get_account_sid(): string
    get get_account_sessionId(): string
    get get_account_personaId(): string
    get get_account_authcode(): string
    get get_account_token(): string
    get get_account_display_name(): string


    set set_account_id(id: number)
    set set_account_remid(remid: string)
    set set_account_sid(sid: string)
    set set_account_sessionId(sessionId: string)
    set set_account_personaId(personaId: string)
    set set_account_authcode(personaId: string)
    set set_account_token(personaId: string)
    set set_account_display_name(personaId: string)
}

interface EA_player {
    displayName: string
    personaId: string
    pidId: string
    dateCreated: string
    lastAuthenticated: string

}

interface QQ_user {
    user_name: string
    user_group: string
    user_ea_name: string
}

interface EA_server {
    serverId: string
    servername: string
    gameId: string
    guid: string
    belong_group: string
    server_order: string
}

interface bf1_group {
    group_name: string
    group_id: string
}

interface bf1_dau {
    id: number
    time: Date
    all_dau: number
    asia_dau: number
    europe_dau: number
    official_dau: number
    private_dau: number
    asia_private_dau: number
    asia_official_dau: number
    europe_private_dau: number
    europe_official_dau: number
}


class account_Impl implements account {

    id: number
    remid: string
    sid: string
    sessionId: string
    personaId: string
    authcode: string
    token: string
    display_name: string

    constructor() {
        // 初始化默认属性值
        this.id = 0
        this.remid = null
        this.sid = null
        this.sessionId = null
        this.personaId = null
        this.authcode = null
        this.token = null
        this.display_name = null
    }

    get get_account_id() {
        return this.id
    }
    get get_account_remid() {
        return this.remid;
    }
    get get_account_sid() {
        return this.sid
    }
    get get_account_sessionId() {
        return this.sessionId
    }
    get get_account_personaId() {
        return this.personaId
    }
    get get_account_authcode() {
        return this.authcode
    }
    get get_account_token() {
        return this.token
    }
    get get_account_display_name() {
        return this.display_name
    }


    set set_account_id(id: number) {
        this.id = id
    }
    set set_account_remid(remid: string) {
        this.remid = remid
    }
    set set_account_sid(sid: string) {
        this.sid = sid
    }
    set set_account_sessionId(sessionId: string) {
        this.sessionId = sessionId
    }
    set set_account_personaId(personaId: string) {
        this.personaId = personaId
    }
    set set_account_authcode(authcode: string) {
        this.authcode = authcode
    }
    set set_account_token(token: string) {
        this.token = token
    }
    set set_account_display_name(display_name: string) {
        this.display_name = display_name
    }
}