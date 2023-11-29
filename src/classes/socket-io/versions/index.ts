import { io } from 'socket.io-client'
import { SocketTyped } from '@/types/socket'

const importModules: Record<string, { default?: unknown }> = import.meta.glob(
    './v*.js',
    { eager: true }
)

const SOCKET_NAME_REGEX = /v\d+_\d+_\d+/

type TypedSocketIo = (...args: Parameters<typeof io>) => SocketTyped

type SocketIoFn = () => TypedSocketIo

function isSocketIoFn (socket: unknown): socket is SocketIoFn {
    return typeof socket === 'function'
}

const sockets = Object.entries(importModules)
    .reduce<Record<string, TypedSocketIo>>(
        (acc, currentValue) => {
            const module = currentValue[1].default
            const moduleName = currentValue[0].match(SOCKET_NAME_REGEX)?.[0]

            if (isSocketIoFn(module) && moduleName) {
                acc[moduleName] = module()
            }

            return acc
        },
        {}
    )

const getSocketVersion = (version: string) => {
    if (version in sockets) {
        return sockets[version]
    } else {
        throw new Error(`Socket version ${version} not found`)
    }
}

const makeSocketVersion = (version: string, ...args: Parameters<typeof io>) => {
    const socket = getSocketVersion(version)

    return socket(...args)
}

export default {
    ...sockets,
    getSocketVersion,
    makeSocketVersion
}
