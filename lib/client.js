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
		* 覆盖依据（2026-09 实测）：本插件早期行规则写作
		* `NAV_LIST_SELECTOR + ' > *'`——逗号列表无括号，追加的 `> *` 只作用于
		* 末项，首项变成裸 navList 选择器，把列自身也打进 `flex: 0 0 auto
		* !important`，与列规则同特异性（同 !important）靠后声明反超，computed
		* flex 恒为 0 0 auto。修复：行规则逐锚点拼接 `> *`（ROW_SELECTOR）。
		* 另保留 :not(#…)x3 前缀抬特异性至 (3,3,0)，防官方同带 !important 规则
		* 打平后按注入顺序反超；!important 双保险。
		*
		* 锚点双保险：主锚 [role="dialog"][class*="_panel"] 锚定弹窗自身（官方
		* div.panel 带 role="dialog"，hashed 类形如 VOzbGW_panel）；兜底锚
		* [role="dialog"] 裸锚（已验证来源 user.css 的写法，当前其他 dialog 内均
		* 无 _navList 类）。任一命中即生效。
		*
		* 规则来源：~/.dsh/diagnostics/settings-nav-clip/settings-nav-scroll.user.css
		*/
		/** style 标签标识：幂等去重 + 卸载定位。 */
		const TAG_ID = "dsh-settings-nav-scroll/css";
		/**
		* 特异性升压前缀：三个 :not(#…) 各贡献 (1,0,0)，总 (3,0,0)。
		* 匹配不受 id 是否存在影响（页面内无这些命名空间 id），仅用于抬权重，
		* 使本规则在同为 !important 时仍按特异性胜出，与注入顺序无关。
		*/
		const SPEC_BOOST = ":not(#dsns-boost-a):not(#dsns-boost-b):not(#dsns-boost-c) ";
		/** 弹窗内导航列选择器：主锚 + 裸锚兜底，逗号列表共享声明块。 */
		const NAV_LIST_ANCHORS = ["[role=\"dialog\"][class*=\"_panel\"] [class*=\"_navList\"]", "[role=\"dialog\"] [class*=\"_navList\"]"];
		const NAV_ANCHORS = ["[role=\"dialog\"][class*=\"_panel\"] [class*=\"_nav\"]", "[role=\"dialog\"] [class*=\"_nav\"]"];
		/** 列规则：逗号列表共享声明块。 */
		const NAV_LIST_SELECTOR = NAV_LIST_ANCHORS.map((a) => SPEC_BOOST + a).join(",\n");
		/**
		* 子行规则：逐锚点拼接 '> *'——直接对逗号列表整体追加只作用于末项，
		* 首项会变成裸 navList 选择器，把列自身也打进 0 0 auto。
		*/
		const ROW_SELECTOR = NAV_LIST_ANCHORS.map((a) => SPEC_BOOST + a + " > *").join(",\n");
		const NAV_SELECTOR = NAV_ANCHORS.map((a) => SPEC_BOOST + a).join(",\n");
		function rules() {
			return [
				"/* dsh-settings-nav-scroll: 设置弹窗左侧导航列超高时允许滚动 */",
				"",
				"/* flex-grow/shrink 是滚动必要条件：navList 在 nav（纵向 flex）内需",
				"   占满可用高并允许收缩到低于内容高，内容超出才触发 overflow-y 滚动。",
				"   实测：曾因行规则拼接缺陷（见文件头注释）被自家 0 0 auto 反压；",
				"   现列/行选择器分离，前缀 :not(#…)x3 防官方同权重 !important 后插。 */",
				NAV_LIST_SELECTOR + " {",
				"  flex: 1 1 auto !important;",
				"  min-height: 0 !important;",
				"  overflow-y: auto !important;",
				"  overscroll-behavior: contain;",
				"  padding-bottom: 4px; /* 滚到底时留白，避免末行贴边 */",
				"}",
				"",
				"/* 行禁止收缩：超高时滚动而不是把选项卡压扁（逐锚点拼好，勿整体追加） */",
				ROW_SELECTOR + " {",
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