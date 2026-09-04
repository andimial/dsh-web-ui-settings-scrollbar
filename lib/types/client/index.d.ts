/**
 * @dsh-external/dsh-settings-nav-scroll — client 半：CSS 注入。
 *
 * 背景：官方 SettingsRoot.module.css 中 .panel{overflow:hidden}，
 * 左侧 .navList 无 overflow-y:auto，设置弹窗 section 行数多 / 窗口矮时
 * 底部选项卡被裁剪、无法触达。
 *
 * 修复：向 <head> 注入一条 <style>，让设置弹窗内 hashed 类名含 _navList
 * 的导航列可垂直滚动。style 标签挂 ctx.effect，插件卸载/热重载时同步
 * 移除，不留残留。
 *
 * 覆盖依据：规则特异性（0,2,0 与 0,3,0）均高于官方 .VOzbGW_navList 的
 * 0,1,0，覆盖不依赖加载顺序。锚点双保险：主锚 [role="dialog"]
 * [class*="_panel"] 锚定弹窗自身（官方 div.panel 带 role="dialog"，hashed
 * 类形如 VOzbGW_panel）；兜底锚 [role="dialog"] 裸锚（已验证来源 user.css
 * 的写法，当前其他 dialog 内均无 _navList 类）。任一命中即生效。
 *
 * 规则来源：~/.dsh/diagnostics/settings-nav-clip/settings-nav-scroll.user.css
 */
export declare function apply(ctx: {
    effect(fn: () => (() => void) | void, label?: string): void;
}): void;
