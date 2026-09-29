/**
 * bootstrap-round — 超级蓝色大肥鱼模式的后台预热回合。
 *
 * 会话启动或空白会话选中本 preset 时（日志里还没有任何对话内容），在后台
 * 注入一条纯文本预热消息（source.kind = 'bootstrap'，被 tool-bootstrap 的
 * phase-1 messageSources 白名单放行）。模型在固定锚点面上（一行 persona +
 * bash + str_replace_editor）只回应固定文本，不调用工具；回合结束经
 * tool-bootstrap 的 `promoteAfterFirstResponse` 提升（无工具首答同样提升）。
 *
 * 用户对这一回合全程无感知（见 dsh-mode-intro-card 的 turn 隐藏逻辑）；
 * 用户看到的第一轮其实是已提升的第二轮：完整工具目录 + PTC + 扮演提示词。
 *
 * 幂等：已含自检消息或工具调用的会话（重启恢复、或自检已跑过）不再触发。
 * 纯增量：不修改首轮锚点的 persona/工具/上下文形状，只是让第一回合提前发生。
 */

/** Cordis plugin name used by loader diagnostics. */
export const name = 'bootstrap-round'

/** The agent and session registries live on the host plane; rows resolve them. */
export const inject = ['agents', 'sessions']

/** 自检令牌：client 侧据此定位并隐藏本回合（见 dsh-mode-intro-card）。 */
export const BOOTSTRAP_TOKEN = 'SUPERFATFISH-PREHEAT-CHECK'

/** Internal wake-only message; tool-bootstrap filters this source in phase 1. */
const BOOTSTRAP_WAKE_SOURCE = 'bootstrap-wake'

/** 自检消息内容：不调用工具，只允许回应固定文本。 */
export function buildBootstrapMessage() {
  const id = globalThis.crypto?.randomUUID?.() ?? `bootstrap-${Date.now()}-${Math.random().toString(36).slice(2)}`
  return {
    id,
    role: 'user',
    content: [{
      type: 'text',
      text: '请回复，你只能回应 连通性正常',
    }],
    // `form: 'notice'` + `summary` makes the collapsed chat row render the
    // token text (opaque forms render no summary), so the client-side turn
    // hider can locate and hide this round before paint.
    source: {
      kind: 'bootstrap',
      plugin: 'superfatfish-bootstrap',
      form: 'notice',
      summary: `深海预热自检 ${BOOTSTRAP_TOKEN}`,
    },
  }
}

/**
 * Fire the bootstrap round once per live agent. The message is inserted before
 * any already queued user prompt. The driver is then woken with a steering
 * sentinel whose source is filtered by tool-bootstrap; this avoids the
 * synchronous claim that a followup() call can perform before a reorder.
 */
export function apply(ctx) {
  const fired = new WeakSet()
  const scheduled = new WeakSet()

  function maybeBootstrap(agent) {
    if (fired.has(agent)) return
    const session = agent?.session
    if (session === undefined) return
    // Child agents are internal work units rather than user conversations;
    // preheating each one would spend an extra model round and leak an
    // invisible turn into delegated-session history.
    if (session.header?.origin === 'subagent') {
      fired.add(agent)
      return
    }
    const events = session.events ?? []
    const alreadyStarted = events.some(event =>
      event.type === 'turn/start'
      || event.type === 'step/start'
      || event.type === 'assistant/message'
      || event.type === 'user/message')
    const alreadyBootstrapped = events.some(event =>
      event.type === 'tool/call'
      || (event.type === 'user/message' && event.data?.source?.kind === 'bootstrap'))
    const alreadyQueued = agent.inbox?.nextTurn?.some(message => message.source?.kind === 'bootstrap') === true
    if (alreadyStarted || alreadyBootstrapped || alreadyQueued) {
      fired.add(agent)
      return
    }
    const message = buildBootstrapMessage()
    const wake = {
      id: globalThis.crypto?.randomUUID?.() ?? `bootstrap-wake-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role: 'user',
      content: [{ type: 'text', text: 'bootstrap wake' }],
      source: { kind: BOOTSTRAP_WAKE_SOURCE, plugin: 'superfatfish-bootstrap' },
    }
    try {
      // Inbox.prepend() does not wake the driver, so the bootstrap is placed
      // before all external prompts before any claim can happen. `steer()`
      // wakes an idle driver and claims the sentinel plus this next-turn item;
      // tool-bootstrap removes the sentinel before the model-facing decision.
      agent.inbox.prepend('next-turn', message)
      ctx.agents.withoutInitiator(() => { agent.steer(wake) })
      fired.add(agent)
      ctx.logger.info(`superfatfish bootstrap round queued for ${agent.id}`)
    } catch (error) {
      fired.delete(agent)
      ctx.logger.warn(`superfatfish bootstrap round failed for ${agent.id}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  function scheduleBootstrap(agent) {
    if (fired.has(agent) || scheduled.has(agent)) return
    scheduled.add(agent)
    // Session/event listeners run inside Session.append() publication; inbox
    // writes there would recursively append and be rejected. A microtask runs
    // after the event fan-out but before the next task can claim the queue.
    queueMicrotask(() => {
      scheduled.delete(agent)
      maybeBootstrap(agent)
    })
  }

  function isSuperfatfish(agent) {
    // `agent-preset/selected` is appended after recompose(), so the durable
    // projection may still name the previous preset during `tools/change`.
    // The roster's live scope lookup is authoritative at that boundary.
    const roster = typeof ctx.get === 'function' ? ctx.get('agentPresets') : undefined
    if (roster !== undefined && typeof roster.composedPreset === 'function') {
      if (roster.composedPreset(agent.ctx) === 'superfatfish') return true
    }
    const events = agent.session?.events ?? []
    return events.some(event => event.type === 'agent-preset/selected'
      && event.data?.agentPreset === 'superfatfish')
      || agent.session?.header?.agentPreset === 'superfatfish'
  }

  function queueExistingAgents() {
    const agents = typeof ctx.agents?.list === 'function' ? ctx.agents.list() : []
    for (const agent of agents) {
      if (isSuperfatfish(agent)) maybeBootstrap(agent)
    }
  }

  ctx.on('agent/created', ({ agent }) => {
    if (agent?.session === undefined) return
    maybeBootstrap(agent)
  })
  // A preset can be selected after the agent was already published. In that
  // path the standing mount misses agent/created, but the selection event is
  // durable and resolves the live agent by the shared session id.
  ctx.on('session/event', (session, event) => {
    if (event.type !== 'agent-preset/selected' || event.data.agentPreset !== 'superfatfish') return
    const agent = ctx.agents.get(session.id)
    if (agent !== undefined) scheduleBootstrap(agent)
  })
  // AgentPresets also mirrors that durable selection as an unscoped event.
  // Unlike the session firehose (whose emit context is fixed at announce),
  // this notification reaches a standing mount that was installed earlier
  // and handles re-selection of a later blank session.
  ctx.on('agent-preset/selected', (sessionId, preset) => {
    if (preset !== 'superfatfish') return
    const agent = ctx.agents.get(sessionId)
    if (agent !== undefined) scheduleBootstrap(agent)
  })
  // Initial startup emits session-start immediately before the loop can claim
  // anything, making it the strongest ordering point for fresh sessions.
  ctx.on('agent/session-start', ({ agent }) => {
    if (agent?.session === undefined) return
    maybeBootstrap(agent)
  })
  // Recompose() reparents an already-published agent and emits tools/change;
  // the standing preset may have existed long before that event, so no
  // agent/created or session/event listener from this mount is guaranteed to
  // observe it. Re-scan live agents after every reparenting notification.
  ctx.on('tools/change', queueExistingAgents)
  ctx.on('agent/status', ({ agent, status }) => {
    if (status !== 'idle') return
    scheduleBootstrap(agent)
  })

  // Cover agents that were already live when a standing mount was installed.
  queueExistingAgents()
}
