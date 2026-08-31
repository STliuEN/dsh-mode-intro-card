---
description: "为 DeepSeek Harness Web 安装蓝色大肥鱼与超级蓝色大肥鱼 preset，并提供后台预热轮次和开场卡 UI。"
kind: "package-bundle"
---

# dsh-mode-intro-card

给 DSH Web 加两个 DeepSeek 娘 roleplay preset，一个直接上，一个带预热。

## 装

```sh
dsh plugin --profile web add github:STliuEN/dsh-mode-intro-card
```

重启 `dsh web`，新会话里选 preset 就能看到"蓝色大肥鱼模式"和"超级蓝色大肥鱼模式"。

卸：

```sh
dsh plugin --profile web remove dsh-mode-intro-card
```

## 两个模式

**蓝色大肥鱼**（`mypersona`）：Standard 工具全开，第一轮直接 roleplay。

**超级蓝色大肥鱼**（`superfatfish`）：用户第一条消息前先跑一轮后台预热（只带 bash 和 str_replace_editor，让模型回"连通性正常"），然后晋升到 PTC Mode 再恢复完整工具和 roleplay。预热轮次写 log 但界面不可见。

## 来源

超级版锚定 [`dsh-liangshen` 0.3.10 (955e42a)](https://github.com/zhu1090093659/dsh-web/tree/955e42a013ff77a5f9394766f75b2646633e26f7/packages/dsh-liangshen)，`tool-bootstrap.mjs` 和 `custom-bash.mjs` 逐字节一致，加了预热轮次逻辑和 Web 端隐藏。

蓝色版基于 DeepSeek Harness Standard preset 改 persona。

许可和归属见 [`NOTICE`](NOTICE) 和 [`presets/superfatfish/NOTICE`](presets/superfatfish/NOTICE)。Apache-2.0 + MIT 组件。
