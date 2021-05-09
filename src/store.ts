import { reactive } from 'vue'

export interface User {
    id: number,
    username: string,
}

interface State {
    user?: User,
}

export default {
    state: reactive({
        user: undefined,
    }) as State,
}
