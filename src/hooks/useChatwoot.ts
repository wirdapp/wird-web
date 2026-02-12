import { useEffect } from "react";

const BASE_URL = "https://chatwoot.oabuhamdan.com";

export function useChatwoot() {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = `${BASE_URL}/packs/js/sdk.js`;
		script.async = true;
		script.onload = () => {
			window.chatwootSDK?.run({
				websiteToken: "WPk3uQD9h7sEYjKBBGYopdAw",
				baseUrl: BASE_URL,
			});
		};
		document.body.appendChild(script);

		return () => {
			script.remove();
			document.querySelector(".woot-widget-holder")?.remove();
			document.querySelector(".woot--bubble-holder")?.remove();
			delete (window as any).chatwootSDK;
			delete (window as any).$chatwoot;
		};
	}, []);
}
