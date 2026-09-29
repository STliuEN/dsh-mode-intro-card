---
description: "为 DeepSeek Harness Web 注册蓝色大肥鱼 preset 并提供开场卡 UI。零依赖、零构建步骤：preset 组合直接写在一个 bundle patch 文件里。"
kind: "package-bundle"
---

# dsh-mode-intro-card

给 DSH Web 加一个 DeepSeek 娘 roleplay preset：**蓝色大肥鱼模式**（`mypersona`）。

零依赖包、零构建步骤。整个插件就是两行 patch + 一份 preset 组合：

```
cordis.patch.yml                      ← 挂载本插件的行
presets/mypersona/preset.patch.yml    ← preset 本体（组合 + 人设），唯一可编辑来源
lib/index.js                          ← 宿主半边：标记行，不做事
lib/client.js                         ← 浏览器半边：开场卡
```

## 装

```sh
dsh plugin --profile web add github:STliuEN/dsh-mode-intro-card
```

重启 `dsh web`，新会话里选 **蓝色大肥鱼模式**。

本地开发用 link，改完只需重启：

```sh
git clone https://github.com/STliuEN/dsh-mode-intro-card.git
dsh plugin --profile web add link:$PWD/dsh-mode-intro-card
```

卸：

```sh
dsh plugin --profile web remove dsh-mode-intro-card
```

## 改人设

直接编辑 [`presets/mypersona/preset.patch.yml`](presets/mypersona/preset.patch.yml) 里的
`persona` 行，重启 profile 即生效。没有生成步骤，没有第二份副本。

## 为什么组合是内联的

DSH 里 preset 只能**逐行内联**声明：

- 目标行是 `@deepseek-ai/dsh-agent-preset`，字段 `config.plugins` 放整份 agent 组合；
- 本版本**没有**目录扫描式加载器（不存在 `agent-presets` + `roots:` 这种机制），
  宿主里只有 `agent-preset-registry`，它按行接收 preset；
- 内置的 `standard` / `ptc` / `minimal` / `cordis` 就是这么声明的——web-app bundle 把
  它们各写成一个文件，列在自己的 `dsh.bundle.patch` 数组里。本插件照抄这个形状：
  `cordis.patch.yml` 只挂自己那一行，`presets/mypersona/preset.patch.yml` 放 preset 本体。

组合内容与本版本内置 `standard` preset 对齐（逐条 diff 无差异），人设与个别配置按本插件需要改写。

## 超级模式

`presets/superfatfish/` 保留在仓库里，但**没有任何 patch 引用它**，所以
「超级蓝色大肥鱼模式」不会出现在 roster，其后台预热轮次与自带 bash 通道也不会挂载。
需要时把它的组合按同样方式内联成第二个 `@deepseek-ai/dsh-agent-preset` 行即可。

## 来源

蓝色版基于 DeepSeek Harness 内置 Standard preset 改 persona。

超级版（未启用）锚定 [`dsh-liangshen` 0.3.10 (955e42a)](https://github.com/zhu1090093659/dsh-web/tree/955e42a013ff77a5f9394766f75b2646633e26f7/packages/dsh-liangshen)，`tool-bootstrap.mjs` 和 `custom-bash.mjs` 逐字节一致，加了预热轮次逻辑和 Web 端隐藏。

许可和归属见 [`NOTICE`](NOTICE) 和 [`presets/superfatfish/NOTICE`](presets/superfatfish/NOTICE)。Apache-2.0 + MIT 组件。
