# dsh-mode-intro-card-super

DeepSeek Harness Web 的**超级蓝色大肥鱼模式**（`superfatfish`）：在用户第一条消息之前，先在后台跑一轮只带 `bash` 与 `str_replace_editor` 的预热回合，随后提升到 PTC 模式并恢复完整工具与 DeepSeek 娘角色扮演。预热回合写进会话日志，界面上不可见。

## 安装

```sh
dsh plugin --profile web add "github:STliuEN/dsh-mode-intro-card#path:packages/mode-intro-card-super"
```

重启 `dsh web`，新建会话时选择「超级蓝色大肥鱼模式」。

## 卸载

```sh
dsh plugin --profile web remove dsh-mode-intro-card-super
```

## 人设

编辑 [`presets/superfatfish/preset.patch.yml`](presets/superfatfish/preset.patch.yml) 里的 `persona` 行。

## 来源与许可

预热的锚定实现改造自 [`dsh-liangshen`](https://github.com/zhu1090093659/dsh-web/tree/955e42a013ff77a5f9394766f75b2646633e26f7/packages/dsh-liangshen)（Apache-2.0），其底层实现归属 [xiaobright/dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard)（MIT）。组件级说明见 [`presets/superfatfish/NOTICE`](presets/superfatfish/NOTICE) 与 [`NOTICE`](NOTICE)。
