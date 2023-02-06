export const WebFingerPath = '/.well-known/webfinger'

type Query = {
	resource: Account
	rel?: string | string[]
}

interface Account extends Accept {
}

// type Account = string

export class Accept {
	username: string
	host: string

	constructor(username?: string, host?: string) {
		this.username = username ? username : ''
		this.host = host ? host : ''
	}

	// parse('acct:aoang@example.com') | parse('aoang@example.com')
	parse(acc: string) {
		let idx = acc.indexOf(':')
		if (idx >= 0) {
			acc = acc.slice(idx + 1)
		}

		idx = acc.indexOf('@')
		if (idx < 0) {
			throw new Error('Invalid acc URI')
		}

		this.username = decodeURIComponent(acc.slice(0, idx))
		this.host = acc.slice(idx + 1)
	}

	toString(): string {
		return `acct:${encodeURIComponent(this.username)}@${this.host}`
	}
}

fetch('url', {
	headers: { 'Accept': 'application/jrd+json, application/json' },
	signal: new AbortController().signal,
})
