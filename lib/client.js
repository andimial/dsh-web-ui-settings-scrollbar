window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-settings-nav-scroll",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		//#region src/client/index.ts
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
		/** style 标签标识：幂等去重 + 卸载定位。 */
		const TAG_ID = "dsh-settings-nav-scroll/css";
		/** 弹窗内导航列选择器：主锚 + 裸锚兜底，逗号列表共享声明块。 */
		const NAV_LIST_SELECTOR = ["[role=\"dialog\"][class*=\"_panel\"] [class*=\"_navList\"]", "[role=\"dialog\"] [class*=\"_navList\"]"].join(",\n");
		const NAV_SELECTOR = ["[role=\"dialog\"][class*=\"_panel\"] [class*=\"_nav\"]", "[role=\"dialog\"] [class*=\"_nav\"]"].join(",\n");
		function rules() {
			return [
				"/* dsh-settings-nav-scroll: 设置弹窗左侧导航列超高时允许滚动 */",
				"",
				"/* flex-grow/shrink 是滚动必要条件：navList 在 nav（纵向 flex）内需",
				"   占满可用高并允许收缩到低于内容高，内容超出才触发 overflow-y 滚动。",
				"   实测（2026-09）：官方存在更高优先级规则把 navList 的 flex 压成",
				"   0 0 auto，navList 遂按内容自然高度撑到 836px > 父层 795px，溢出",
				"   发生在 nav/panel 层被 overflow:hidden 静默裁剪，自身永不出滚动条",
				"   ——故关键属性用 !important 兜底，不再赌特异性。 */",
				NAV_LIST_SELECTOR + " {",
				"  flex: 1 1 auto !important;",
				"  min-height: 0 !important;",
				"  overflow-y: auto !important;",
				"  overscroll-behavior: contain;",
				"  padding-bottom: 4px; /* 滚到底时留白，避免末行贴边 */",
				"}",
				"",
				"/* 行禁止收缩：超高时滚动而不是把选项卡压扁 */",
				NAV_LIST_SELECTOR + " > * {",
				"  flex: 0 0 auto !important;",
				"}",
				"",
				"/* 兜底：列自身不参与收缩，避免极端高度下布局挤压 */",
				NAV_SELECTOR + " {",
				"  min-height: 0;",
				"}"
			].join("\n");
		}
		function selectorFor() {
			return "style[data-plugin-css=\"dsh-settings-nav-scroll/css\"]";
		}
		function apply(ctx) {
			ctx.effect(() => {
				if (typeof document === "undefined") return;
				const selector = selectorFor();
				const existing = document.querySelector(selector);
				if (existing) {
					existing.textContent = rules();
					return () => existing.remove();
				}
				const tag = document.createElement("style");
				tag.setAttribute("data-plugin-css", TAG_ID);
				tag.textContent = rules();
				document.head.appendChild(tag);
				return () => tag.remove();
			}, "settings-nav-scroll: css");
		}
		//#endregion
		exports.apply = apply;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map