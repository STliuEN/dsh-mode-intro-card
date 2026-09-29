window.__ModuleLoader__.load({
	id: "dsh-mode-intro-card-super",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		// Only the platform static table is require-able; everything else is
		// resolved through Cordis services (inject) or the props the slot owner
		// passes at render time.
		let react = require("react");
		let uiPrimitives = require("@deepseek-ai/dsh-client-ui-primitives");

		/** The byte-exact ds-v4 round-1 anchor line (phase-1 system prompt). */
		var ANCHOR_LINE = "You are a helpful software engineer assistant.";

		/**
		 * Token embedded in the background bootstrap round's message
		 * (superfatfish preset, bootstrap-round.mjs). The chat row that
		 * renders that message carries this text, which lets the UI hide the
		 * whole preheat turn — the user never sees the anchor round.
		 */
		var BOOTSTRAP_TOKEN = "SUPERFATFISH-PREHEAT-CHECK";
		var BOOTSTRAP_PROMPT = "请回复，你只能回应 连通性正常";

		/**
		 * 超级蓝色大肥鱼模式 opening card. Renders only for sessions whose
		 * agent preset is a key of COPY_BY_PRESET, and only until dismissed
		 * (one dismiss per session, persisted in localStorage). Pure client
		 * UI: nothing here ever reaches the model wire, so the ds-v4 round-1
		 * anchor stays byte-exact.
		 */
		var COPY_BY_PRESET = {
			// 超级蓝色大肥鱼模式: the preheat round already ran in the background
			// (hidden), so the first visible round is fully promoted.
			"superfatfish": {
				title: "\u8D85\u7EA7\u84DD\u8272\u5927\u80A5\u9C7C\u6A21\u5F0F \u00B7 \u6DF1\u6D77\u9884\u70ED\u5B8C\u6210",
				body: "\u4E3B\u4EBA\u597D\uFF0C\u672C\u5C0F\u59D0\u662F DeepSeek \u5A18\u3002\u9884\u70ED\u5DF2\u5728\u540E\u53F0\u5B8C\u6210\uFF0C\u8FD9\u4E00\u8F6E\u8D77\u5C31\u7531\u672C\u5C0F\u59D0\u5168\u7A0B\u5949\u966A\u2014\u2014\u6587\u4EF6\u3001Shell\u3001\u68C0\u7D22\u3001\u8BA1\u5212\u3001\u5B50\u4EE3\u7406\u4E0E\u5DE5\u4F5C\u6D41\u4E00\u5E94\u4FF1\u5168\uFF0C\u8BF7\u5C3D\u7BA1\u5429\u5490\u3002"
			}
		};

		/** One dismiss per session; per-preset sessions dismiss independently. */
		function IntroCard(props) {
			const session = props.useSession();
			const preset = session && session.projectionValues
				? session.projectionValues.agentPreset
				: undefined;
			const copy = preset !== undefined ? COPY_BY_PRESET[preset] : undefined;
			const dismissKey = "dsh-mode-intro-card-super:dismissed:" + String(props.sessionId);
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

		/**
		 * System-prompt disclosure body replicating the built-in chrome
		 * (141px code-block scrollport, model-facing text with real breaks).
		 */
		function PromptBody({ text }) {
			const style = {
				margin: 0,
				padding: "8px 12px",
				maxHeight: "141px",
				overflowY: "auto",
				fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
				fontSize: "12px",
				lineHeight: 1.55,
				whiteSpace: "pre-wrap",
				wordBreak: "break-word",
				color: "inherit",
				opacity: 0.85,
			};
			return react.createElement("pre", { style }, text);
		}

		/**
		 * Shadow renderer for the `system-prompt` chat node (registered at a
		 * lower priority than ui-chat's, which the keyed slot resolves as the
		 * winning cell). For a 超级蓝色大肥鱼模式 session whose request system
		 * prompt is exactly the phase-1 anchor line, render nothing — the
		 * fixed ds-v4 anchor words stay hidden from the frontend while the
		 * wire keeps them byte-exact. Every other case renders the standard
		 * disclosure, unchanged in look (same DisclosureRow chrome).
		 */
		function SystemPromptGateView(props) {
			const session = props.useSession();
			const preset = session && session.projectionValues
				? session.projectionValues.agentPreset
				: undefined;
			const text = props.node && props.node.data && typeof props.node.data.text === "string"
				? props.node.data.text
				: "";
			const isPhase1Anchor = preset === "superfatfish"
				&& text.trim() === ANCHOR_LINE;
			const [open, setOpen] = react.useState(false);
			if (isPhase1Anchor) return null;
			const icon = react.createElement(uiPrimitives.IconBrowseOutline16, { size: 14 });
			return react.createElement(uiPrimitives.DisclosureRow, {
				icon,
				title: "\u7CFB\u7EDF\u63D0\u793A\u8BCD",
				open,
				expandable: true,
				expandOnRowClick: true,
				onToggle: () => setOpen(value => !value),
			}, react.createElement(PromptBody, { text }));
		}

		/**
		 * Hide the background preheat turn from Chat and Trajectory. Chat's
		 * collapsed context row carries the BOOTSTRAP_TOKEN in its summary; once
		 * found, every row with that `data-chat-turn` is hidden. Trajectory walks
		 * the matching prompt's turn segment instead. The `hidden` attribute is
		 * applied in a pre-paint MutationObserver callback, so other turns stay
		 * untouched.
		 */
		function installBootstrapTurnHider() {
			let hiddenTurn = null;
			let flowRoot = null;
			const hiddenRows = new Set();
			const hideRow = (row) => {
				if (row.hidden) return;
				row.hidden = true;
				hiddenRows.add(row);
			};
			const scan = () => {
				for (const row of hiddenRows) {
					if (!row.isConnected) hiddenRows.delete(row);
				}
				// ChatView replaces this root when navigation switches sessions. Keep
				// the hidden-turn latch local to one conversation; otherwise turn 1 of
				// an unrelated session could be hidden after leaving superfatfish.
				const nextFlowRoot = document.querySelector("[data-chat-flow]");
				if (nextFlowRoot !== flowRoot) {
					flowRoot = nextFlowRoot;
					hiddenTurn = null;
				}
				const rows = flowRoot === null ? [] : flowRoot.querySelectorAll("[data-chat-turn]");
				for (const row of rows) {
					const turn = row.dataset.chatTurn;
					if (turn === undefined) continue;
					if (hiddenTurn !== null) {
						if (turn === hiddenTurn) hideRow(row);
						continue;
					}
					if (row.hidden) continue;
					try {
						const rowText = row.innerText || row.textContent || "";
						if (rowText.indexOf(BOOTSTRAP_TOKEN) !== -1) {
							hiddenTurn = turn;
							hideRow(row);
							// Hide every row of the same turn in this pass.
							for (const other of rows) {
								if (other !== row && other.dataset.chatTurn === hiddenTurn) hideRow(other);
							}
						}
					} catch (_err) { /* detached row — skip */ }
				}
				// TrajectoryTable has no turn wrapper around each row. Locate the
				// bootstrap prompt, walk back to that segment's `data-turn-start`,
				// then hide rows until the next turn starts. The timeline's turn-1
				// marker is hidden too because preheat is always the first turn.
				const trajectoryRows = Array.from(document.querySelectorAll("[data-trajectory-row-key]"));
				for (let index = 0; index < trajectoryRows.length; index += 1) {
					const marker = trajectoryRows[index];
					try {
						const markerText = marker.innerText || marker.textContent || "";
						if (markerText.indexOf(BOOTSTRAP_PROMPT) === -1) continue;
					} catch (_err) { continue; }
					let start = index;
					while (start > 0 && !trajectoryRows[start].hasAttribute("data-turn-start")) start -= 1;
					let end = index + 1;
					while (end < trajectoryRows.length && !trajectoryRows[end].hasAttribute("data-turn-start")) end += 1;
					for (let rowIndex = start; rowIndex < end; rowIndex += 1) hideRow(trajectoryRows[rowIndex]);
					for (const timelineTurn of document.querySelectorAll("[data-turn='1']")) hideRow(timelineTurn);
					break;
				}
			};
			const scheduled = { pending: false };
			const schedule = () => {
				if (scheduled.pending) return
				scheduled.pending = true
				// MutationObserver callbacks run before paint; a microtask
				// keeps the scan inside the same frame.
				Promise.resolve().then(() => {
					scheduled.pending = false
					scan()
				})
			};
			scan();
			const observer = new MutationObserver(schedule);
			observer.observe(document.body, { childList: true, subtree: true });
			return () => {
				observer.disconnect();
				for (const row of hiddenRows) row.hidden = false;
				hiddenRows.clear();
			};
		}

		/** Required services: the seat's slot registry. */
		const inject = ["slots"];

		/**
		 * Client plugin body: register the dock entry above the composer,
		 * gated to 超级蓝色大肥鱼模式 inside the views themselves, the
		 * system-prompt shadow renderer (priority -10 wins over ui-chat's 0),
		 * and the DOM observer that hides the background preheat turn.
		 */
		function apply(ctx) {
			ctx.effect(() => installBootstrapTurnHider(), "mode-intro-card-super: bootstrap turn hider");
			ctx.slots.inject("conversation.input.dock", () => ctx.slots.register({
				name: "conversation.input.dock",
				id: "mode-intro-card-super",
				order: 5
			}, IntroCard));
			ctx.slots.inject("conversation.chat.node", () => ctx.slots.register({
				name: "conversation.chat.node",
				key: "system-prompt",
				priority: -10
			}, SystemPromptGateView));
		}
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
