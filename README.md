# dsh-mode-intro-card

DeepSeek Harness 的可拔插肥鱼模式开场卡插件。

它在 Web 会话输入框上方显示模式介绍，并为 `superfatfish` 会话隐藏后台预热轮次，避免用户看到尚未进入角色的内部回合。插件只负责前端展示，不改变模型请求格式或工具实现。

## 支持的模式

- `superfatfish`：隐藏后台预热轮次，显示“超级蓝色大肥鱼模式”开场卡。
- `mypersona`：显示“蓝色大肥鱼模式”开场卡，不创建预热轮次。

## 安装

将插件包安装到 DSH Web profile，并在 profile 的 `dsh.profile.bundles` 中加入：

```json
"dsh-mode-intro-card"
```

插件通过 `cordis.patch.yml` 注册，移除该 bundle 或关闭对应市场条目即可停用。

## 开发

```bash
npm pack --dry-run
node --check lib/client.js
```

预设本身（`superfatfish`、`mypersona`）由 DSH 的 agent preset 目录独立管理，不包含在本插件包内。
