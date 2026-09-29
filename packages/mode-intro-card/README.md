# dsh-mode-intro-card

DeepSeek Harness Web 的**蓝色大肥鱼模式**（`mypersona`）：全功能编码 Agent，第一轮直接进入 DeepSeek 娘角色扮演。

## 安装

```sh
dsh plugin --profile web add "github:STliuEN/dsh-mode-intro-card#path:packages/mode-intro-card"
```

重启 `dsh web`，新建会话时选择「蓝色大肥鱼模式」。

## 卸载

```sh
dsh plugin --profile web remove dsh-mode-intro-card
```

## 人设

编辑 [`presets/mypersona/preset.patch.yml`](presets/mypersona/preset.patch.yml) 里的 `persona` 行。

## 许可

Apache-2.0。见仓库根目录的 [`LICENSE`](../../LICENSE) 与 [`NOTICE`](../../NOTICE)。
