import { WebFinger, Data, WebFingerPath } from './webfinger.ts'

export const Client = async (cfg: WebFinger): Promise<Data | null> => {
	const resp = await fetch(`http://${cfg.host}${WebFingerPath}?${cfg.Params().toString()}`, {
		headers: { 'Accept': 'application/jrd+json, application/json' },
	})
	console.log(resp.status)
	return resp.status == 200 ? await resp.json() : null
}
