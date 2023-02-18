import { getSdk, TinyJob } from "./generated"
import { GraphQLClient } from 'graphql-request'
import dayjs from "dayjs"
import * as jose from "jose"
import type { ManipulateType } from "dayjs"

// TODO: ID are strings. Should modify that
// https://github.com/dotansimha/graphql-code-generator/issues/688#issuecomment-439358697
export type Config = {
  url?: string
  token?: string
  publicUrl?: string
}

export const tinyq = (config?: Config) => {
  const url = config?.url || 'default url'
  const token = config?.token || process.env['TINYQ_TOKEN']

  if (!token) {
    throw new Error('missing authentication token. please set `TINYQ_TOKEN` env variable')
  }

  const client = new GraphQLClient(url, {
    headers: {
      'Authorization': token,
      // TODO: update this
      'x-owner': 'sveltekit-adapter-test',
    }
  })
  const sdk = getSdk(client)

  return {
    ...sdk,
    setToken: (token: string) => {
      client.setHeader('Authorization', token)
    }
  }
}

export type TinyRequest<T> = Omit<TinyJob, 'state'> & { 
  state: T
  
  retry: (state?: T) => Retry<T>
  fail: (state?: T) => Fail<T>
  commit: (state?: T) => Commit<T>

  // TODO: Stop `status` does not exists
  stop: (state?: T) => Stop<T>
}

class TinyResponseBuilder<T> {
  request: TinyRequest<T>

  constructor(request: TinyRequest<T>) {
    this.request = request
  }

  withState(state: T) {
    this.request.state = state
    return this
  }

  // TODO: Should have `dump` method that serialize + encrypt
  dump() {
    return JSON.stringify({
      ...this.request,
      state: JSON.stringify(this.request.state),
    })
  }
}

type TimeUnit = 'mins' | 'hours' | 'days' | 'weeks' | 'months' | 'years'

export class Retry<T> extends TinyResponseBuilder<T> {
  constructor(request: TinyRequest<T>) {
    super(request)

    // Default delay
    this.request.expr = '@after 1 mins'
    this.request.status = 'READY'
  }

  asap() {
    this.request.expr = `@after 1s`
    return this
  }

  afterInterval(interval: number, unit: TimeUnit) {
    this.request.expr = `@after ${interval} ${unit}`
    return this
  }

  afterMinutes(interval: number) {
    this.request.expr = `@after ${interval} mins`
    return this
  }

  afterHours(interval: number) {
    this.request.expr = `@after ${interval} hours`
    return this
  }

  afterDays(interval: number) {
    this.request.expr = `@after ${interval} days`
    return this
  }

  afterWeeks(interval: number) {
    this.request.expr = `@after ${interval} weeks`
    return this
  }

  afterMonths(interval: number) {
    this.request.expr = `@after ${interval} months`
    return this
  }

  afterYears(interval: number) {
    this.request.expr = `@after ${interval} years`
    return this
  }

  afterTime(time: Date) {
    this.request.expr = `@at ${time.toISOString()}`
    return this
  }
}

export class Commit<T> extends TinyResponseBuilder<T> {
  constructor(request: TinyRequest<T>) {
    super(request)

    this.request.status = 'SUCCESS'
  }
}

export class Stop<T> extends TinyResponseBuilder<T> {
  constructor(request: TinyRequest<T>) {
    super(request)

    this.request.status = 'PAUSED'
  }
}

export class Fail<T> extends TinyResponseBuilder<T> {
  constructor(request: TinyRequest<T>) {
    super(request)

    this.request.status = 'FAILED'
  }
}

export class TinyRequestBuilder<T> {
  request = {} as TinyRequest<T>
  config: Config
  queue: string

  constructor(queue: string, config: Config) {
    this.queue = queue
    this.config = config
  }

  // TODO: serialize + encrypt
  withState(state: T) {
    this.request.state = state
    return this
  }

  withMeta(meta: any) {
    this.request.meta = JSON.stringify(meta)
    return this
  }

  withName(name: string) {
    this.request.name = name
    return this
  }

  startsAt(date: Date) {
    this.request.start_at = date
    return this
  }

  startsAfter(interval: number, unit: TimeUnit) {
    // TODO: Check compatibility
    this.request.start_at = dayjs().add(interval, unit as ManipulateType)
    return this
  }

  async schedule(state?: T) {
    if (state) {
      state = this.withState(state).request.state
    }

    const client = tinyq(this.config)
    const meta = JSON.stringify({
      url: `${this.config.publicUrl}/${this.queue}`,
      method: 'POST',
      queue: this.queue,
    })
    return client.createJob({
      executor: 'http',
      args: {
        meta,
        state: JSON.stringify(this.request.state || {}),
        expr: this.request.expr,
        name: this.request.name || '',
        start_at: this.request.start_at,
      }
    }) 
  }
}

export class Cron<T> extends TinyRequestBuilder<T> {
  every(interval: number, unit: TimeUnit) {
    this.request.expr = `@every ${interval} ${unit}`
    return this
  }

  everyMinutes(interval: number) {
    this.request.expr = `@every ${interval} mins`
    return this
  }

  everyHours(interval: number) {
    this.request.expr = `@every ${interval} hours`
    return this
  }

  everyDays(interval: number) {
    this.request.expr = `@every ${interval} days`
    return this
  }

  everyWeeks(interval: number) {
    this.request.expr = `@every ${interval} weeks`
    return this
  }

  everyMonths(interval: number) {
    this.request.expr = `@every ${interval} months`
    return this
  }

  everyYears(interval: number) {
    this.request.expr = `@every ${interval} years`
    return this
  }
}

export class Job<T> extends TinyRequestBuilder<T> {
  expr(raw: string) {
    this.request.expr = raw
    return this
  }

  after(interval: number, unit: TimeUnit) {
    this.request.expr = `@after ${interval} ${unit}`
    return this
  }

  at(date: Date) {
    this.request.expr = `@at ${date.toISOString()}`
    return this
  }

  afterMinutes(interval: number) {
    this.request.expr = `@after ${interval} mins`
    return this
  }

  afterHours(interval: number) {
    this.request.expr = `@after ${interval} hours`
    return this
  }

  afterDays(interval: number) {
    this.request.expr = `@after ${interval} days`
    return this
  }

  afterWeeks(interval: number) {
    this.request.expr = `@after ${interval} weeks`
    return this
  }

  afterMonths(interval: number) {
    this.request.expr = `@after ${interval} months`
    return this
  }

  afterYears(interval: number) {
    this.request.expr = `@after ${interval} years`
    return this
  }
}

const createHandler = <T>(queue: string, config: Config) =>{
  const requestUtil = (request: TinyRequest<T>) => {
    return {
      ...request,
      retry: (state?: T) => {
        const _retry = new Retry(request)
        return state ? _retry.withState(state) : _retry
      },
      commit: (state?: T) => {
        const _commit = new Commit(request)
        return state ? _commit.withState(state) : _commit
      },
      stop: (state?: T) => {
        const _stop = new Stop(request)
        return state ? _stop.withState(state) : _stop
      },
      fail: (state?: T) => {
        const _fail = new Fail(request)
        return state ? _fail.withState(state) : _fail
      },
    }
  }

  const hydrateRequest = async (raw: any, sig: string) => {
    try {
      // decrypt state + deserialize
      const state = JSON.parse(raw.state)

      if (process.env['NODE_ENV'] === 'production') {
        const valid = await verifySig(sig, config)
        if (!valid) {
          throw new Error('invalid signature')
        }
      }

      return {
        ...raw,
        state,
      }
    } catch (err) {
      // TODO: do something for automatic retry
      console.error(err)
      throw new Error('wrong format for request')
    }
  }

  const parse = async (raw: any, sig: string) => {
    return requestUtil(await hydrateRequest(raw, sig))
  }

  return {
    requestUtil,
    hydrateRequest,
    parse,
    cron: new Cron<T>(queue, config),
    job: new Job<T>(queue, config),
  }
}

export const createClient = (config: Config) => {
  return <T>(queue: string) => {
    return createHandler<T>(queue, config)
  }
}

const spki = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzVir+oFLy31Zkl6ADf7D
2dvPLFG+rdC5y1MCbd4Se4RcSNFZertlV7Obx72UMylEmd0QNZEdZr2x5ZFVPj+c
WE9o1fHFkFyJ8sSRoUSYMwLM9AJdjgG5SaDguIfuWG7D1KB9u80zsIhOwl1pa+FF
MQaB4oXA4FR8yS9uTLvkFCBsG63nF0u85CBIGG0PQu1SDsg5A7bDIZO+oiCB2ewv
q/TWUnUnlkv2HnMMMGnUxWf8+38jFZXLnP27rXigSM4kU3vlsbt+maHQU99Yteuu
S3un4xZ2QGaVEfrk1N94QPh/j9i/6yNRsJ2wBmTBwhHSfhCwvY/GSdmcJVebRJWC
SwIDAQAB
-----END PUBLIC KEY-----`

const verifySig = async (token: string, config: Config): Promise<boolean> => {
  try {
    const publicKey = await jose.importSPKI(spki, 'RS256')
    await jose.jwtVerify(token, publicKey, {
      issuer: 'tinyq',
      audience: config.publicUrl,
      // TODO: Should match also with owner?
    })
    return true
  } catch (err) {
    console.error('[TINYQ] invalid signature', err)
    return false
  }
}
