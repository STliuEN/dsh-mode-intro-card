---
description: "为 DeepSeek Harness Web 安装蓝色大肥鱼与超级蓝色大肥鱼 preset，并提供后台预热轮次和开场卡 UI。"
kind: "package-bundle"
---

# dsh-mode-intro-card — 肥鱼模式 bundle

## 概述

这个可拔插 bundle 为 DSH Web 提供两个 agent preset 和一个浏览器开场卡。蓝色大肥鱼模式使用完整 Standard 工具与 DeepSeek 娘 roleplay；超级蓝色大肥鱼模式在后台先完成一次不可见的两阶段锚定预热，再把用户看到的第一轮交给已经晋升并载入 roleplay 的 Agent。预热请求和响应会写入 session log，只在 Chat 与 Trajectory 界面隐藏。

## 安装

```sh
dsh plugin --profile web add github:STliuEN/dsh-mode-intro-card
```

完整重启 `dsh web`，新建空白会话，然后在 preset 选择器中选择“蓝色大肥鱼模式”或“超级蓝色大肥鱼模式”。Bundle 通过 `cordis.patch.yml` 注册包内 preset root，并插入承载 Web 开场卡的 host/client row。

```sh
dsh plugin --profile web remove dsh-mode-intro-card
```

Preset 直接从包内 `presets/` 读取，不复制到 `~/.dsh/.agent-presets`，因此卸载不会留下插件创建的 preset 文件。如果用户目录中另有同名 preset，安装期间由更靠前的 bundle root 覆盖，卸载后用户版本会重新出现。

Settings 中的插件列表是只读清单，不能停用整个 bundle。需要同时移除两个 preset 和开场卡时，请使用上面的 `dsh plugin remove` 命令并重启 Web。

## 两个模式

- `mypersona`（蓝色大肥鱼模式）：完整 Standard 编码能力，第一轮直接载入 DeepSeek 娘 roleplay，不创建后台预热轮次。
- `superfatfish`（超级蓝色大肥鱼模式）：后台首个模型请求保持固定的一行 persona 与 `bash`、`str_replace_editor` 两工具，并要求只回复“连通性正常”而不调用工具；响应结束后晋升为 PTC Mode，恢复完整工具、常规注入和 roleplay。浏览器隐藏该预热轮次及其首轮 system prompt disclosure。

## 来源与二次开发

超级蓝色大肥鱼模式锚定于 [`dsh-liangshen` 0.3.10，commit `955e42a`](https://github.com/zhu1090093659/dsh-web/tree/955e42a013ff77a5f9394766f75b2646633e26f7/packages/dsh-liangshen)。包内 `tool-bootstrap.mjs` 与 `custom-bash.mjs` 和这个固定版本逐字节一致；本项目在其运行框架之外增加 `bootstrap-round.mjs`、提升后 roleplay section、`bootstrap` 消息白名单，以及 Web 端预热轮次隐藏逻辑。

蓝色大肥鱼模式基于 DeepSeek Harness Standard preset 组织完整工具，并替换 persona。上游与组件归属见 [`NOTICE`](NOTICE) 和 [`presets/superfatfish/NOTICE`](presets/superfatfish/NOTICE)。

## 行为限制

- Bundle 激活时注册 `mypersona`、`superfatfish` 两个固定 id；其他用户 preset 不受影响。
- 两个 preset 直接从只读包内容加载；需要修改时请 fork 本仓库并编辑 `presets/`。
- DSH patch 会整体替换 `agent-presets` 的配置；如果另一个 bundle 也注册额外 preset root，请在更高优先级的 profile patch 中重述 `default` 和全部 `roots`。
- 不要在已经产生内容的会话中途切换 preset。
- 需要 DSH `0.1.2-alpha.1` 或更高版本，以及 Node.js `^22.19.0` 或 `>=24.0.0`。

## 开发验证

```sh
npm run check
npm pack --dry-run
```

仓库采用一个可拔插 bundle 层组织功能：[`cordis.patch.yml`](cordis.patch.yml) 只负责挂载包内 preset root 和 Web row，[`presets/`](presets/) 保存两个完整 preset，[`lib/index.js`](lib/index.js) 是 host marker，[`lib/client.js`](lib/client.js) 提供开场卡与预热轮次隐藏。安装和卸载只改变 profile 的 bundle 列表，不在 DSH 源码或用户 preset 目录写入文件。

## 许可

本项目使用 Apache-2.0；锚定 preset 内含 MIT 来源组件。发布包保留 [`LICENSE`](LICENSE)、[`NOTICE`](NOTICE) 与 preset 级 NOTICE。
