import { Handler } from 'https://deno.land/std@0.176.0/http/server.ts'
import { Data, WebFinger, WebFingerPath } from './webfinger.ts'

export const Server = (cfg: (query: WebFinger) => Promise<Data>): Handler => {
	return (request) => {
		const url = new URL(request.url)

		if (!url.pathname.startsWith(WebFingerPath) || !url.searchParams.has('resource')) {
			return new Response(null, { status: 400 })
		}
		const q = new WebFinger()
		q.parse(url.searchParams)

		return (async () => new Response(JSON.stringify(await cfg(q))))()
	}
}
