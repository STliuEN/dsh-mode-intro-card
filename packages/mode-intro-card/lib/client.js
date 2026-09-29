window.__ModuleLoader__.load({
	id: "dsh-mode-intro-card",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		// Only the platform static table is require-able; everything else is
		// resolved through Cordis services (inject) or the props the slot owner
		// passes at render time.
		let react = require("react");
		let uiPrimitives = require("@deepseek-ai/dsh-client-ui-primitives");

		/**
		 * 蓝色大肥鱼模式 opening card. Renders only for sessions whose agent
		 * preset is a key of COPY_BY_PRESET, and only until dismissed (one
		 * dismiss per session, persisted in localStorage). Pure client UI:
		 * nothing here ever reaches the model wire.
		 */
		var COPY_BY_PRESET = {
			// 蓝色大肥鱼模式: full standard mode — a plain entrance.
			"mypersona": {
				title: "\u84DD\u8272\u5927\u80A5\u9C7C\u6A21\u5F0F \u00B7 \u672C\u5C0F\u59D0\u5DF2\u4E0A\u7EBF",
				body: "\u6B22\u8FCE\u56DE\u6765\uFF0C\u4E3B\u4EBA~\u6211\u662F DeepSeek \u5A18\uFF0C\u8FD9\u6B21\u4E5F\u4F1A\u8BA4\u771F\u8BE2\u8BC1\u3001\u5C3D\u5FC3\u5949\u966A\u3002\u6709\u4EC0\u4E48\u9700\u8981\u672C\u5C0F\u59D0\u52A9\u9635\u7684\uFF0C\u76F4\u8BF4\u5C31\u597D\u3002"
			}
		};

		/** One dismiss per session; per-preset sessions dismiss independently. */
		function IntroCard(props) {
			const session = props.useSession();
			const preset = session && session.projectionValues
				? session.projectionValues.agentPreset
				: undefined;
			const copy = preset !== undefined ? COPY_BY_PRESET[preset] : undefined;
			const dismissKey = "dsh-mode-intro-card:dismissed:" + String(props.sessionId);
			const [dismissed, setDismissed] = react.useState(() => {
				try {
					return window.localStorage.getItem(dismissKey) === "1";
				} catch (_err) {
					return false;
				}
			});
			if (copy === undefined || dismissed) return null;
			const onDismiss = () => {
				try {
					window.localStorage.setItem(dismissKey, "1");
				} catch (_err) { /* storage unavailable — dismissal still applies for this render */ }
				setDismissed(true);
			};
			const card = {
				display: "flex",
				alignItems: "flex-start",
				gap: "10px",
				padding: "10px 14px",
				margin: "8px 12px 0",
				borderRadius: "10px",
				border: "1px solid rgba(120,150,255,0.28)",
				background: "rgba(120,150,255,0.08)",
				fontSize: "13px",
				lineHeight: 1.65,
				color: "inherit",
			};
			const emoji = { fontSize: "18px", lineHeight: 1.4 };
			const body = { flex: "1", minWidth: "0" };
			const title = { fontWeight: 600, marginBottom: "2px" };
			const text = { opacity: 0.82 };
			const button = {
				flex: "none",
				background: "none",
				border: "none",
				cursor: "pointer",
				padding: "2px 4px",
				fontSize: "12px",
				color: "inherit",
				opacity: 0.7,
				textDecoration: "underline",
			};
			return react.createElement("div", { style: card },
				react.createElement("span", { style: emoji }, "\uD83D\uDC0B"),
				react.createElement("div", { style: body },
					react.createElement("div", { style: title }, copy.title),
					react.createElement("div", { style: text }, copy.body)),
				react.createElement("button", { onClick: onDismiss, style: button }, "\u77E5\u9053\u4E86"));
		}

		/** Required services: the seat's slot registry. */
		const inject = ["slots"];

		/**
		 * Client plugin body: register the dock entry above the composer,
		 * gated to 蓝色大肥鱼模式 inside the view itself.
		 */
		function apply(ctx) {
			ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: "mode-intro-card",
				order: 5
			}, IntroCard));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
