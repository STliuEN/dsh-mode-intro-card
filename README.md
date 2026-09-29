---
description: "为 DeepSeek Harness Web 提供两个 DeepSeek 娘 roleplay preset：蓝色大肥鱼模式与超级蓝色大肥鱼模式，分开安装、按需选择。"
---

# dsh-mode-intro-card

DeepSeek Harness Web 的两个 DeepSeek 娘 roleplay preset。**两种模式分开介绍、分开安装，装哪个用哪个。**

- [蓝色大肥鱼模式](#蓝色大肥鱼模式) — 全功能编码 Agent，第一轮直接进入角色。
- [超级蓝色大肥鱼模式](#超级蓝色大肥鱼模式) — 先在后台跑一轮预热，再以两阶段引导进入角色。

两者互不依赖，可以只装一个，也可以都装。

## 蓝色大肥鱼模式

全功能编码 Agent：文件、Shell、检索、计划、子代理与工作流一应俱全。DeepSeek 娘偶尔傲娇，始终认真求证。

```sh
dsh plugin --profile web add "github:STliuEN/dsh-mode-intro-card#path:packages/mode-intro-card"
```

## 超级蓝色大肥鱼模式

在用户的第一条消息之前，先在后台跑一轮预热回合，只带 `bash` 与 `str_replace_editor`，随后提升到 PTC 模式并恢复完整工具与角色扮演。预热回合写进会话日志，界面上不可见。

```sh
dsh plugin --profile web add "github:STliuEN/dsh-mode-intro-card#path:packages/mode-intro-card-super"
```

## 使用

安装后重启 `dsh web`，新建会话时在模式列表里选择已安装的模式。两个都装就两个都可选。

## 卸载

```sh
dsh plugin --profile web remove dsh-mode-intro-card
dsh plugin --profile web remove dsh-mode-intro-card-super
```

## 许可

Apache-2.0，含 MIT 组件。见 [`LICENSE`](LICENSE) 与 [`NOTICE`](NOTICE)。
