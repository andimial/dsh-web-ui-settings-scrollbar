# @dsh-external/dsh-settings-nav-scroll

dsh 设置弹窗左侧导航（section 选项卡列表）超高时允许垂直滚动，显示全部选项卡。

## 问题

官方 `SettingsRoot.module.css` 中 `.panel{overflow:hidden}`，`.navList` 无
`overflow-y:auto`。设置分组多 / 窗口矮时，左侧导航底部选项卡被裁剪，无法点击。

## 方案

client 半向 `<head>` 注入一条 `<style>`（`data-plugin-css="dsh-settings-nav-scroll/css"`）：

- `[role="dialog"] [class*="_navList"]`：`flex:1 1 auto; min-height:0; overflow-y:auto; overscroll-behavior:contain`
- 子行 `flex:0 0 auto`（滚动而非压扁）
- `[role="dialog"] [class*="_nav"]`：`min-height:0` 兜底
- `padding-bottom:4px` 末行留白

`[class*="_navList"]` 匹配官方 hashed 类（如 `VOzbGW_navList`）；profile 插件
CSS 晚于官方 core CSS 加载，同特异性下覆盖生效。

规则来源：`~/.dsh/diagnostics/settings-nav-clip/settings-nav-scroll.user.css`。

## 生命周期

style 标签挂 `ctx.effect`，插件停止 / 热重载 / 卸载时同步移除，不留残留。
注入幂等：重复执行只更新内容，不重复插入。

## 构建与注入

```bash
dev_build_plugin  {"dir": "F:/dsh-web-ui-settings-scrollbar"}
dev_inject_plugin {"dir": "F:/dsh-web-ui-settings-scrollbar"}
```

由 dsh-super-injector dev_scaffold_plugin 生成骨架，本仓库裁剪为 CSS-only 形态。
