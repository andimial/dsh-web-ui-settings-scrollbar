/**
 * @dsh-external/dsh-settings-nav-scroll — client 半：CSS 注入。
 *
 * 背景：官方 SettingsRoot.module.css 中 .panel{overflow:hidden}，
 * 左侧 .navList 无 overflow-y:auto，设置弹窗 section 行数多 / 窗口矮时
 * 底部选项卡被裁剪、无法触达。
 *
 * 修复：向 <head> 注入一条 <style>，让 [role="dialog"] 内 hashed 类名
 * 含 _navList 的导航列可垂直滚动（选择器 [class*="_navList"] 匹配官方
 * hashed 类，如 VOzbGW_navList）。style 标签挂 ctx.effect，插件卸载
 * /热重载时同步移除，不留残留。
 *
 * 注入时机：profile 插件 client 脚本晚于官方 core CSS 加载，同特异性
 * 下后者规则生效，满足覆盖条件。
 *
 * 规则来源：~/.dsh/diagnostics/settings-nav-clip/settings-nav-scroll.user.css
 */

/** style 标签标识：幂等去重 + 卸载定位。 */
const TAG_ID = 'dsh-settings-nav-scroll/css'

/**
 * 选择器（特异性 0,3,0，高于官方 .VOzbGW_navList 的 0,1,0，覆盖不依赖加载顺序）：
 * - [role="dialog"][class*="_panel"] 锚定 settings 弹窗自身（官方 div.panel
 *   带 role="dialog"，hashed 类形如 VOzbGW_panel），避免误伤其他弹窗；
 * - [class*="_navList"] 匹配官方 hashed 导航列类（如 VOzbGW_navList）。
 */
function rules(): string {
  const DIALOG = '[role="dialog"][class*="_panel"]'
  return [
    '/* dsh-settings-nav-scroll: 设置弹窗左侧导航列超高时允许滚动 */',
    '',
    DIALOG + ' [class*="_navList"] {',
    '  flex: 1 1 auto;',
    '  min-height: 0;',
    '  overflow-y: auto;',
    '  overscroll-behavior: contain;',
    '}',
    '',
    '/* 行禁止收缩：超高时滚动而不是把选项卡压扁 */',
    DIALOG + ' [class*="_navList"] > * {',
    '  flex: 0 0 auto;',
    '}',
    '',
    '/* 兜底：列自身不参与收缩，避免极端高度下布局挤压 */',
    DIALOG + ' [class*="_nav"] {',
    '  min-height: 0;',
    '}',
    '',
    '/* 滚动到底时留白，避免末行贴边 */',
    DIALOG + ' [class*="_navList"] {',
    '  padding-bottom: 4px;',
    '}',
  ].join('\n')
}

function selectorFor(): string {
  return 'style[data-plugin-css="' + TAG_ID + '"]'
}

export function apply(ctx: {
  effect(fn: () => (() => void) | void, label?: string): void
}): void {
  ctx.effect(() => {
    if (typeof document === 'undefined') return
    const selector = selectorFor()
    let tag = document.querySelector(selector)
    if (tag) {
      // 幂等：热重载重复执行时只更新内容，不重复插入
      tag.textContent = rules()
      return () => tag!.remove()
    }
    tag = document.createElement('style')
    tag.setAttribute('data-plugin-css', TAG_ID)
    tag.textContent = rules()
    document.head.appendChild(tag)
    return () => tag!.remove()
  }, 'settings-nav-scroll: css')
}
