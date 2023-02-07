import { serve } from 'https://deno.land/std@0.176.0/http/server.ts'
import { assertEquals } from 'https://deno.land/std@0.176.0/testing/asserts.ts'
import { Client } from './client.ts'
import { Server } from './server.ts'
import { Data, WebFinger } from './webfinger.ts'

Deno.test(async function testWebFinger() {
	const srv = Server((arg: WebFinger): Promise<Data> =>
		new Promise(
			(resolve) => resolve({ subject: arg.URI(), links: [{ rel: 'https://github.com/Elephantina/WebFinger' }] }),
		)
	)

	const signal = new AbortController()

	await serve(srv, {
		hostname: '127.0.0.1',
		port: 56321,
		signal: signal.signal,
		onListen: ({ hostname, port }) => {
			const q = new WebFinger('web', `${hostname}:${port}`, 'https://github.com/Elephantina/WebFinger')

			Client(q).then((e) => {
				console.log(e)
				assertEquals(e, {
					subject: `acct:web@${hostname}:${port}`,
					links: [{ rel: 'https://github.com/Elephantina/WebFinger' }],
				})
				signal.abort()
			})
		},
	})
})
