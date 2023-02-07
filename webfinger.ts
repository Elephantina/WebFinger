export const WebFingerPath = '/.well-known/webfinger'

export class WebFinger {
	username: string
	host: string
	rel?: string | string[]

	constructor(username?: string, host?: string, rel?: string | string[]) {
		this.username = username ? username : ''
		this.host = host ? host : ''
		this.rel = rel
	}

	parse(query: URLSearchParams) {
		this.parseAcc(query.get('resource')!)
		this.rel = query.getAll('rel')
	}
	parseAcc(acc: string) {
		let idx = acc.indexOf(':')
		if (idx >= 0) {
			acc = acc.slice(idx + 1)
			idx = acc.indexOf('@')
		}
		if (idx < 0) {
			throw new Error('Invalid acc URI')
		}

		this.username = decodeURIComponent(acc.slice(0, idx))
		this.host = acc.slice(idx + 1)
	}

	URI(): string {
		return `acct:${encodeURIComponent(this.username)}@${this.host}`
	}

	Params(): URLSearchParams {
		const params = new URLSearchParams()
		params.append('resource', this.URI())

		if (this.rel) {
			if (this.rel instanceof Array) {
				this.rel.forEach((e) => params.append('rel', e))
			} else {
				params.append('rel', this.rel)
			}
		}
		return params
	}
}

export type Data = {
	subject: string
	aliases?: string[]
	properties?: Record<string, unknown>
	links: Link[]
}

export interface Link {
	rel: string
	type?: string
	href?: string
	template?: string
	titles?: Record<string, unknown>
	properties?: Record<string, unknown>
}
