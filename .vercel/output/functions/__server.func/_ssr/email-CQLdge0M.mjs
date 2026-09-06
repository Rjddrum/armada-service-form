import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email-CQLdge0M.js
var sendInspectionEmail_createServerFn_handler = createServerRpc({
	id: "83c5bb32428c72ea023e44062d38763ee23edc8a2be80df20109991a824153ff",
	name: "sendInspectionEmail",
	filename: "src/lib/email.ts"
}, (opts) => sendInspectionEmail.__executeServer(opts));
var sendInspectionEmail = createServerFn({ method: "POST" }).validator((d) => d).handler(sendInspectionEmail_createServerFn_handler, async ({ data }) => {
	const key = process.env.RESEND_API_KEY;
	if (!key) return { status: "unconfigured" };
	const from = process.env.RESEND_FROM || "Armada Inspection <onboarding@resend.dev>";
	const to = data.to.trim();
	if (!to) return { status: "skipped" };
	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			from,
			to: [to],
			cc: data.cc?.trim() ? [data.cc.trim()] : void 0,
			subject: data.subject,
			html: data.html,
			attachments: [{
				filename: data.filename,
				content: data.pdfBase64
			}]
		})
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(text.slice(0, 200) || `Resend ${res.status}`);
	}
	return { status: "sent" };
});
//#endregion
export { sendInspectionEmail_createServerFn_handler };
