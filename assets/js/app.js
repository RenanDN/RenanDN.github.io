/* ==========================================================================
   app.js — idioma, tema e realce de navegação
   Sem dependências: funciona aberto direto do arquivo (file://).
   ========================================================================== */

(function () {
	"use strict";

	var root = document.documentElement;
	var LANG_KEY = "rdn.lang";
	var THEME_KEY = "rdn.theme";

	/* localStorage pode lançar em modo privado ou em file:// restrito. */
	function read(key) {
		try {
			return window.localStorage.getItem(key);
		} catch (e) {
			return null;
		}
	}

	function write(key, value) {
		try {
			window.localStorage.setItem(key, value);
		} catch (e) {
			/* preferência não persiste; a sessão atual continua funcionando */
		}
	}

	/* ---------- Idioma ---------- */

	function applyLang(lang) {
		root.setAttribute("data-lang", lang);
		root.setAttribute("lang", lang === "pt" ? "pt-BR" : "en");

		document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
			btn.setAttribute(
				"aria-pressed",
				btn.getAttribute("data-lang-btn") === lang ? "true" : "false"
			);
		});

		/* Mantém o título da aba coerente com o idioma escolhido. */
		var title = document.querySelector("[data-title-" + lang + "]");
		if (title) document.title = title.getAttribute("data-title-" + lang);
	}

	function initialLang() {
		var saved = read(LANG_KEY);
		if (saved === "pt" || saved === "en") return saved;

		/* Sem preferência salva: segue o navegador, com inglês como padrão. */
		var nav = (navigator.language || "en").toLowerCase();
		return nav.indexOf("pt") === 0 ? "pt" : "en";
	}

	/* ---------- Tema ---------- */

	function applyTheme(theme) {
		root.setAttribute("data-theme", theme);
		var btn = document.querySelector("[data-theme-toggle]");
		if (btn) {
			btn.setAttribute(
				"aria-label",
				theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
			);
		}
	}

	function initialTheme() {
		var saved = read(THEME_KEY);
		if (saved === "dark" || saved === "light") return saved;
		return window.matchMedia &&
			window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	/* ---------- Ligações ---------- */

	applyLang(initialLang());
	applyTheme(initialTheme());

	document.addEventListener("click", function (event) {
		var langBtn = event.target.closest("[data-lang-btn]");
		if (langBtn) {
			var lang = langBtn.getAttribute("data-lang-btn");
			applyLang(lang);
			write(LANG_KEY, lang);
			return;
		}

		var themeBtn = event.target.closest("[data-theme-toggle]");
		if (themeBtn) {
			var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			applyTheme(next);
			write(THEME_KEY, next);
			return;
		}

		var printBtn = event.target.closest("[data-print]");
		if (printBtn) {
			event.preventDefault();
			window.print();
		}
	});

	/* ---------- Borda da barra fixa ao rolar ---------- */

	var topbar = document.querySelector(".topbar");
	if (topbar) {
		var onScroll = function () {
			topbar.setAttribute("data-scrolled", window.scrollY > 8 ? "true" : "false");
		};
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
	}
})();
