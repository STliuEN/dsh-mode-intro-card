# dsh-mode-intro-card — 肥鱼家族开场卡（可拔插 bundle）

超级蓝色大肥鱼模式 / 蓝色大肥鱼模式 的会话开场卡插件。纯 client UI，对
preset 为 `superfatfish`（超级蓝色大肥鱼）或 `mypersona`（蓝色大肥鱼）的会话，
在 composer 上方渲染 DeepSeek 娘 出场卡。

## 设计约束（为什么是纯前端）

ds-v4 的 RL 锚定要求**首轮注入字节级不变**：一行固定 persona + 恰好两个工具
（持久 `bash` + `str_replace_editor`），无上下文、无注入消息。因此扮演提示词
只能由 preset 在**提升后**才注入（见 superfatfish preset 的 `roleplay-section`）。
本插件解决的是感知缺口：它隐藏 `superfatfish` 的后台预热 turn（包括聊天和可选
轨迹视图）及该 turn 的锚点提示披露，并在 composer 上方显示预热完成卡。用户看到
的第一轮是已经提升、已经注入扮演提示词的真实任务轮，**模型 wire 零改动**。

## 可拔插、非破坏性

- 随 bundle 安装/卸载：`dsh-mode-intro-card` 在 profile package.json 的
  `dsh.profile.bundles` 里，行由包内 `cordis.patch.yml` 声明（与
  dsh-balance-widget 同一机制）。市场开关或从 bundles 移除即可整体停用。
- 只负责浏览器展示，不改模型 wire；预热排队和 preset 选择逻辑由
  `superfatfish` 自身的本地 composition 负责。
- 卡片文案与预设覆盖清单在 `lib/client.js` 的 `COPY_BY_PRESET` 里，
  改完刷新页面即生效（HMR 无需重启；新增/删除覆盖预设需要重启 web）。

## 结构

```
package.json      dsh.bundle.patch + dsh.client 声明
cordis.patch.yml  bundle 补丁：插入 mode-intro-card 行
lib/index.js      宿主半体（标记行，无服务）
lib/client.js     浏览器半体：出场卡、锚点披露门控与预热 turn 隐藏器
```

## 行为

- 每会话一次：`localStorage[dsh-mode-intro-card:dismissed:<sessionId>]`。
- `superfatfish` → 隐藏后台预热 turn，显示预热完成卡。
- `mypersona` → 直接显示上线卡，不创建后台预热 turn。
