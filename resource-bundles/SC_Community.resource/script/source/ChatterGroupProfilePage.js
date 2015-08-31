/*
 * This code is for Internal Salesforce use only, and subject to change without notice.
 * Customers shouldn't reference this file in any web pages.
 */
if (typeof Sfdc != "undefined") {
	Sfdc.ns("SfdcApp.ChatterProfilePhotoSection");
	SfdcApp.ChatterProfilePhotoSection = function() {
		return {
			showHideBadgeAndPhotoLinks: function(b) {
				var a = Sfdc.get("photoSection");
				b ? Sfdc.Dom.addClass(a, "hoverOrFocus") : Sfdc.Dom.removeClass(a, "hoverOrFocus")
			}
		}
	}();
	(function() {
		Sfdc.provide("SfdcApp.ChatterProfileSection", function() {
			var b = {};
			return {
				init: function(a, g, c, d, e, f) {
					if (!b[a]) {
						c = UserContext.isAccessibleMode ? new CollaborationAccessibleDialog(a, c, d, e, f) : new NonaccessibleDialog(a, c, d, e, f);
						b[a] = c;
						var h = function() {
							SfdcApp.ChatterProfileSection.showDialog(a)
						};
						Sfdc.each(Sfdc.select(g), function(a) {
							Sfdc.on(a, "click", h)
						})
					}
				},
				showDialog: function(a) {
					b[a] && (window.checkSessionTimeout && checkSessionTimeout(), b[a].display())
				}
			}
		}())
	})();
	Sfdc.ns("SfdcApp.ChatterGroupAddRemoveMemberOverlay");
	SfdcApp.ChatterGroupAddRemoveMemberOverlay = function() {
		function f(a) {
			return Sfdc.Dom.getParent(a, ".groupManagementContainer")
		}

		function k(a) {
			return Sfdc.get(".search", f(a))
		}

		function s(a) {
			return Sfdc.get(".content", f(a))
		}

		function t() {
			return LC.getLabel("ChatterGroups", "groupsOverlay_searchdefault")
		}

		function y(a) {
			h != l && (a = Sfdc.get(".extras", f(a)), ("requests" == h || "requests" == l) && u(Sfdc.get(".requests", a)), ("member" == h || "member" == l) && u(Sfdc.get(".member", a)), ("all" == h || "all" == l) && u(Sfdc.get(".everyone",
				a)))
		}

		function u(a) {
			var c = Sfdc.get(".visible", a);
			a = Sfdc.get(".invisible", a);
			Sfdc.Dom.removeClass(c, "visible");
			Sfdc.Dom.addClass(c, "invisible");
			Sfdc.Dom.removeClass(a, "invisible");
			Sfdc.Dom.addClass(a, "visible")
		}

		function v(a, c) {
			var b = Sfdc.get(".paginator .lastPage", a),
				d = Sfdc.get(".paginator .notLastPage", a);
			c ? (Sfdc.Dom.hideByDisplay(b), Sfdc.Dom.show(d)) : (Sfdc.Dom.hideByDisplay(d), Sfdc.Dom.show(b))
		}

		function n(a) {
			var c = Sfdc.get(".paginator .notFirstPage", a);
			a = Sfdc.get(".paginator .firstPage", a);
			1 == e ? (Sfdc.Dom.hideByDisplay(c),
				Sfdc.Dom.show(a)) : (Sfdc.Dom.hideByDisplay(a), Sfdc.Dom.show(c))
		}

		function p(a) {
			var c = {
				filter: h,
				page: e
			};
			chatter.getToolbox();
			a = k(a);
			a.value != t() && (c.search = a.value);
			return c
		}

		function w(a) {
			a.value = t();
			Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear", f(a)));
			Sfdc.Dom.hasClass(a, "unfocus") || Sfdc.Dom.addClass(a, "unfocus")
		}

		function x() {
			var a = Sfdc.select("input.acceptAll")[0],
				c = Sfdc.String.getIntValue(Sfdc.get(".groupmemberrequestcount").innerHTML, 10),
				b = Sfdc.String.getIntValue(a.getAttribute("count_page_request"),
					10);
			a.setAttribute("count_total_request", c);
			a.setAttribute("value", LC.getLabel("ChatterGroups", "membership_admin_acceptall", b, c));
			a.setAttribute("title", LC.getLabel("ChatterGroups", "membership_admin_acceptall_title", b, c))
		}

		function q(a, c, b) {
			m && clearTimeout(m);
			var d = f(a),
				e = Sfdc.get(".mask", d);
			Sfdc.Dom.show(e);
			var r = {
				refresh: "",
				search: b.search,
				page: b.page,
				filter: b.filter
			};
			b.hasNext && (b.userIds && b.requestIds) && (r.hasNext = b.hasNext, r.userIds = b.userIds, r.requestIds = b.requestIds);
			chatter.getToolbox().get({
				url: "/ui/groups/" +
					c + "/usermanagement",
				params: r,
				success: function(c, f) {
					if (b.onSuccess) b.onSuccess(f);
					Sfdc.Dom.updateHTML(s(a), f.html);
					v(d, f.hasNextPage);
					n(d);
					"requests" == h && (g.processPayload(f.payload), x());
					Sfdc.Dom.hideByDisplay(e)
				},
				failure: function() {
					Sfdc.Dom.hideByDisplay(e)
				}
			})
		}
		var e = 1,
			h = "all",
			l = h,
			m, g = {
				processPayload: function(a) {
					a && a.pageList && (g.requestPageList = a.pageList)
				},
				setRequestConfig: function(a) {
					e = 1;
					l = h;
					h = a
				},
				resetRequestConfig: function() {
					g.setRequestConfig("all")
				},
				onSearchClear: function(a, c) {
					var b = k(a);
					b.value =
						"";
					g.search(a, c);
					w(b)
				},
				onSearchFocus: function(a) {
					a = k(a);
					Sfdc.Dom.removeClass(a, "unfocus");
					a.value == t() && (a.value = "")
				},
				onSearchUnfocus: function(a) {
					a = k(a);
					var c = a.value;
					(null === c || 0 === c.length) && w(a)
				},
				getCurrentFilter: function() {
					return h
				},
				filter: function(a, c, b) {
					var d = p(a);
					d.search = "";
					d.filter = b;
					d.page = 1;
					d.onSuccess = function(c) {
						g.setRequestConfig(b);
						w(k(a));
						y(a);
						var d = Sfdc.get(".extras", f(a));
						c.requestCount && Sfdc.each(Sfdc.select(".groupmemberrequestcount", d), function(a) {
							a.innerHTML = c.requestCount
						});
						c.memberCount && Sfdc.each(Sfdc.select(".groupmembercount", d), function(a) {
							a.innerHTML = c.memberCount
						})
					};
					q(a, c, d)
				},
				search: function(a, c) {
					var b = k(a),
						d = b.value;
					0 < d.length ? Sfdc.Dom.show(Sfdc.get(".quickfindClear", f(b))) : Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear", f(b)));
					if (1 != d.length || SfdcApp.ChatterGroupUtil.isCJK(d)) b = p(a), b.filter = "all", b.page = 1, b.onSuccess = function() {
						g.resetRequestConfig();
						y(a)
					}, q(a, c, b)
				},
				onSearchKeyUp: function(a, c, b) {
					m && clearTimeout(m);
					a.keyCode == KEY_ENTER ? g.search(c, b) : a.keyCode !=
						KEY_TAB && (m = setTimeout(function() {
							g.search(c, b)
						}, 750))
				},
				prevPage: function(a, c) {
					var b = f(a);
					if (1 == e) n(b);
					else if (e -= 1, "requests" == h) {
						var d = s(a);
						g.requestPageList[e] = d.innerHTML;
						Sfdc.Dom.updateHTML(d, g.requestPageList[e - 1]);
						x();
						v(b, !0);
						n(b)
					} else b = p(a), q(a, c, b)
				},
				nextPage: function(a, c) {
					e += 1;
					var b = p(a);
					if ("requests" == h) {
						var d = g.requestPageList[e - 1],
							k = s(a);
						g.requestPageList[e - 2] = k.innerHTML;
						if (d.userIds && d.requestIds) b.hasNext = g.requestPageList[e] ? "true" : "false", b.userIds = d.userIds, b.requestIds = d.requestIds;
						else {
							Sfdc.Dom.updateHTML(k, d);
							x();
							b = f(a);
							v(b, void 0 !== g.requestPageList[e]);
							n(b);
							return
						}
					}
					q(a, c, b)
				},
				closeDialog: function(a) {
					return window.sfdcPage.getDialogById(a).cancel()
				},
				closeDialogNoRefresh: function(a) {
					SfdcApp.ChatterGroupMembership.disableRefreshOnClose();
					this.closeDialog(a)
				}
			};
		return g
	}();
	Sfdc.provide("SfdcApp.ChatterGroupAnnouncement", {
		dismissAnnouncement: function(a, b) {
			chatter.getToolbox().post({
				url: a + ";delete",
				params: b,
				success: function() {
					var a = Sfdc.get("announcementPanel");
					Sfdc.Dom.updateHTML(a, "")
				}
			})
		}
	});
	Sfdc.ns("SfdcApp.ChatterGroupChangeRolesOverlay");
	SfdcApp.ChatterGroupChangeRolesOverlay = function() {
		function g(a) {
			return Sfdc.Dom.getParent(a, ".groupRolesContainer")
		}

		function s() {
			return LC.getLabel("ChatterGroups", "groupsOverlay_searchdefault")
		}

		function d(a) {
			return Sfdc.get(".search", g(a))
		}

		function n(a) {
			var c = {
				filter: p,
				page: e
			};
			a = d(a);
			a.value != s() && (c.search = a.value);
			return c
		}

		function u(a) {
			a = Sfdc.get(".filter", g(a));
			v(Sfdc.get(".member", a));
			v(Sfdc.get(".manager", a))
		}

		function v(a) {
			var c = Sfdc.get(".visible", a);
			a = Sfdc.get(".invisible", a);
			Sfdc.Dom.removeClass(c,
				"visible");
			Sfdc.Dom.addClass(c, "invisible");
			Sfdc.Dom.removeClass(a, "invisible");
			Sfdc.Dom.addClass(a, "visible")
		}

		function q(a, c, b) {
			var h = chatter.getToolbox();
			k && clearTimeout(k);
			var l = g(a),
				f = Sfdc.get(".mask", l);
			Sfdc.Dom.show(f);
			h.get({
				url: "/ui/groups/" + c + "/changeroles",
				params: {
					refresh: "",
					filter: b.filter,
					page: b.page,
					search: b.search
				},
				success: function(c, h) {
					if (b.onSuccess) b.onSuccess();
					Sfdc.Dom.updateHTML(Sfdc.get(".content", g(a)), h.html);
					var r = h.hasNextPage,
						d = Sfdc.get(".paginator .lastPage", l),
						k = Sfdc.get(".paginator .notLastPage",
							l);
					r ? (Sfdc.Dom.hideByDisplay(d), Sfdc.Dom.show(k)) : (Sfdc.Dom.hideByDisplay(k), Sfdc.Dom.show(d));
					r = Sfdc.get(".paginator .notFirstPage", l);
					d = Sfdc.get(".paginator .firstPage", l);
					1 == e ? (Sfdc.Dom.hideByDisplay(r), Sfdc.Dom.show(d)) : (Sfdc.Dom.hideByDisplay(d), Sfdc.Dom.show(r));
					Sfdc.Dom.hideByDisplay(f)
				},
				failure: function(a, c) {
					Sfdc.Dom.hideByDisplay(f);
					403 == a.status && h.refresh();
					if (b.onFailure) b.onFailure()
				}
			})
		}

		function t(a) {
			a.value = s();
			Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear", g(a)));
			Sfdc.Dom.hasClass(a,
				"unfocus") || Sfdc.Dom.addClass(a, "unfocus")
		}
		var e = 1,
			p = "member",
			k, m = {
				resetRequestConfig: function() {
					e = 1;
					p = "member"
				},
				closeDialog: function(a) {
					return window.sfdcPage.getDialogById(a).cancel()
				},
				filter: function(a, c, b) {
					p = b;
					e = 1;
					b = n(a);
					b.search = "";
					b.onSuccess = function() {
						var b = d(a);
						t(b);
						u(a)
					};
					q(a, c, b)
				},
				nextPage: function(a, c) {
					e += 1;
					var b = n(a);
					q(a, c, b)
				},
				onSearchClear: function(a, c) {
					var b = d(a);
					b.value = "";
					m.search(a, c);
					t(b)
				},
				onSearchFocus: function(a) {
					a = d(a);
					Sfdc.Dom.removeClass(a, "unfocus");
					a.value == s() && (a.value =
						"")
				},
				onSearchKeyUp: function(a, c, b) {
					k && clearTimeout(k);
					13 == a.keyCode ? m.search(c, b) : 9 != a.keyCode && (k = setTimeout(function() {
						m.search(c, b)
					}, 750))
				},
				onSearchUnfocus: function(a) {
					a = d(a);
					var c = a.value;
					(null === c || 0 === c.length) && t(a)
				},
				prevPage: function(a, c) {
					e = 1 < e ? e - 1 : e;
					var b = n(a);
					q(a, c, b)
				},
				search: function(a, c) {
					var b = d(a),
						h = b.value;
					0 < h.length ? Sfdc.Dom.show(Sfdc.get(".quickfindClear", g(b))) : Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear", g(b)));
					if (1 != h.length || SfdcApp.ChatterGroupUtil.isCJK(h)) b = n(a), b.filter =
						"member", b.page = 1, b.onSuccess = function() {
							"member" != p && u(a);
							m.resetRequestConfig()
						}, q(a, c, b)
				},
				toggleHelpVisibility: function(a) {
					a ? Sfdc.Dom.show(Sfdc.get("#groupRolesOverlayHelp")) : Sfdc.Dom.hideByDisplay(Sfdc.get("#groupRolesOverlayHelp"))
				},
				toggleManager: function(a, c) {
					var b = a.value,
						d = a.checked ? "a" : "s",
						e = UserContext.userId == b && "s" == d;
					if (e && !confirm(LC.getLabel("ChatterGroups", "roles_warnManagerSelfRemoval"))) a.checked = !0;
					else {
						Perf.mark("editGroupMember");
						var f = chatter.getToolbox();
						f.disable(a);
						f.post({
							url: "/groups/" +
								c + "/members;edit",
							params: {
								userId: b,
								role: d
							},
							failure: function(b, c) {
								f.enable(a);
								403 == b.status && f.refresh();
								if (c.errors) {
									a.checked = !a.checked;
									if (c.errors.groupMemberOverlayError) {
										var d = Sfdc.get("#errorHeaderDiv");
										Sfdc.Dom.updateHTML(d, c.errors.groupMemberOverlayError);
										Sfdc.Dom.show(d)
									}
									c.errors.groupMemberErrors && (d = Sfdc.Dom.getPrevious(Sfdc.Dom.getParent(a, "td"), "td"), d = Sfdc.get(".zen-errorMessage", d), Sfdc.Dom.updateHTML(d, c.errors.groupMemberErrors), Sfdc.Dom.show(d))
								}
							},
							success: function(b, c) {
								e ? f.refresh() :
									(f.enable(a), Sfdc.Dom.hideByDisplay(Sfdc.get("#errorHeaderDiv")), g(a), Sfdc.each(Sfdc.select(".managercount", g(a)), function(a) {
										Sfdc.Dom.updateHTML(a, c.managers)
									}))
							}
						})
					}
				}
			};
		return m
	}();
	GroupPanelAccessibleUrlDialog = function(a) {
		var b = this;
		this.id = a.dialogId;
		this.title = a.dialogTitle;
		this.url = a.url;
		this.subjectId = a.subjectId;
		this.refreshUrl = a.refreshUrl;
		this.config = a;
		this.open = function(a) {
			Perf.mark(OverlayDialog.LOAD_MARK);
			var c;
			a && a.params && (c = a.params);
			chatter.getToolbox().get({
				url: b.url,
				params: c,
				success: function(c, d) {
					Sfdc.Dom.updateHTML(Sfdc.get(b.getContentId()), d.html);
					b.show();
					if (a && a.onSuccess) a.onSuccess(d)
				}
			});
			Perf.endMark(OverlayDialog.LOAD_MARK)
		}
	};
	GroupPanelAccessibleUrlDialog.prototype = new OverlayDialog;
	GroupPanelAccessibleUrlDialog.prototype.hide = function() {
		OverlayDialog.prototype.hide.apply(this, []);
		SfdcApp.ChatterGroupMembership.isDirty() && !SfdcApp.ChatterGroupMembership.isDisableRefresOnClose() && (this.refreshUrl ? chatter.getToolbox().navigateTo(this.refreshUrl) : chatter.getToolbox().refresh());
		if (this.config.onHide) this.config.onHide()
	};
	Sfdc.ns("SfdcApp.ChatterGroupMemberListOverlay");
	SfdcApp.ChatterGroupMemberListOverlay = function() {
		function d(a) {
			return Sfdc.get(".search", l(a))
		}

		function l(a) {
			return Sfdc.Dom.getParent(a, ".groupMemberContainer")
		}

		function p() {
			return LC.getLabel("ChatterGroups", "findMembers")
		}

		function h(a) {
			var c = {
				filter: q,
				page: e
			};
			a = d(a);
			a.value != p() && (c.search = a.value);
			return c
		}

		function r(a) {
			a.value = p();
			Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear", l(a)));
			Sfdc.Dom.hasClass(a, "unfocus") || Sfdc.Dom.addClass(a, "unfocus")
		}

		function m(a, c, b) {
			g && clearTimeout(g);
			var f =
				Sfdc.get(".mask", l(a));
			Sfdc.Dom.show(f);
			chatter.getToolbox().get({
				url: "/ui/groups/" + c + "/memberoverlay",
				params: {
					refresh: "",
					search: b.search,
					page: b.page,
					filter: b.filter
				},
				success: function(b, c) {
					Sfdc.Dom.updateHTML(Sfdc.get(".groupMembersContainer .content"), c.html);
					var k = l(a),
						d = c.hasNextPage,
						g = Sfdc.get(".paginator .lastPage", k),
						h = Sfdc.get(".paginator .notLastPage", k);
					d ? (Sfdc.Dom.hideByDisplay(g), Sfdc.Dom.show(h)) : (Sfdc.Dom.hideByDisplay(h), Sfdc.Dom.show(g));
					d = Sfdc.get(".paginator .notFirstPage", k);
					k = Sfdc.get(".paginator .firstPage",
						k);
					1 == e ? (Sfdc.Dom.hideByDisplay(d), Sfdc.Dom.show(k)) : (Sfdc.Dom.hideByDisplay(k), Sfdc.Dom.show(d));
					Sfdc.Dom.hideByDisplay(f)
				},
				failure: function() {
					Sfdc.Dom.hideByDisplay(f)
				}
			})
		}
		var e = 1,
			g, q = "member",
			n = {
				closeDialog: function(a, c) {
					return (a ? window.opener ? window.opener : window.parent : window).sfdcPage.getDialogById(c).cancel()
				},
				filter: function(a, c) {
					var b = a.value;
					e = 1;
					q = b;
					r(d(a));
					b = h(a);
					m(a, c, b)
				},
				prevPage: function(a, c) {
					e = 1 < e ? e - 1 : e;
					var b = h(a);
					m(a, c, b)
				},
				nextPage: function(a, c) {
					e += 1;
					var b = h(a);
					m(a, c, b)
				},
				onSearchFocus: function(a) {
					a =
						d(a);
					Sfdc.Dom.removeClass(a, "unfocus");
					a.value == p() && (a.value = "")
				},
				onSearchUnfocus: function(a) {
					a = d(a);
					var c = a.value;
					(null === c || 0 === c.length) && r(a)
				},
				onSearchClear: function(a, c) {
					var b = d(a);
					b.value = "";
					n.search(a, c);
					r(b)
				},
				onSearchKeyUp: function(a, c, b) {
					g && clearTimeout(g);
					a.keyCode == KEY_ENTER ? n.search(c, b) : a.keyCode != KEY_TAB && (g = setTimeout(function() {
						n.search(c, b)
					}, 750))
				},
				search: function(a, c) {
					var b = d(a),
						f = b.value,
						b = l(b);
					0 < f.length ? Sfdc.Dom.show(Sfdc.get(".quickfindClear", b)) : Sfdc.Dom.hideByDisplay(Sfdc.get(".quickfindClear",
						b));
					if (1 != f.length || SfdcApp.ChatterGroupUtil.isCJK(f)) {
						e = 1;
						q = "member";
						f = h(a);
						b = Sfdc.get(".filterSelect", b);
						for (index = 0; index < b.length; index++) "member" == b[index].value && (b.selectedIndex = index);
						m(a, c, f)
					}
				}
			};
		return n
	}();
	(function() {
		function h(a, b) {
			return a ? Sfdc.get(".chatterListOverlay") : Sfdc.get(".chatterListOverlay", Sfdc.get(b))
		}

		function f(a, b, e, c, d) {
			var f = Sfdc.get(".chatterListOverlayContents", h(a, b)),
				g = chatter.getToolbox();
			g.get({
				url: e,
				params: {
					keyPrefix: c,
					pageNumber: d,
					dialogId: b,
					refresh: ""
				},
				success: function(b, a) {
					Sfdc.Dom.updateHTML(f, a.html);
					g.fixIE7Haslayout(f)
				}
			})
		}
		Sfdc.provide("SfdcApp.ChatterGroupRecordsListOverlay", {
			prevPage: function(a, b, e, c, d) {
				f(a, b, e, c, d - 1)
			},
			nextPage: function(a, b, e, c, d) {
				f(a, b, e, c, d + 1)
			},
			filter: function(a, b, e) {
				var c = Sfdc.get(".picklistFilter", h(a, b));
				f(a, b, e, c.value, 0)
			},
			removeRecord: function(a, b, e, c, d, h, g) {
				chatter.getToolbox().post({
					url: c + ";delete",
					params: g,
					success: function(c, g) {
						f(a, b, e, d, h)
					}
				})
			},
			updateRecord: function(a, b) {
				chatter.getToolbox().post({
					url: "/groups/" + b.groupId + "/record;edit",
					params: b,
					success: function(b, c) {
						Sfdc.Dom.getParent(a).innerHTML = c.html
					}
				})
			},
			closeDialog: function(a) {
				chatter.getToolbox().get({
					url: a,
					success: function(b, a) {
						var c = Sfdc.get("recordsPanel"),
							d = c.ownerDocument.createElement("div");
						d.innerHTML = Sfdc.String.trim(a.html);
						c.parentNode.insertBefore(d.firstChild, c);
						Sfdc.Dom.removeChild(c)
					}
				})
			}
		})
	})();
	Sfdc.ns("SfdcApp.ChatterGroupUtil");
	SfdcApp.ChatterGroupUtil = function() {
		return {
			isCJK: function(a) {
				return /^[\u1100-\u1200|\u3040-\uFB00|\uFE30-\uFE50|\uFF00-\uFFF0]+$/.test(a)
			}
		}
	}();
	GroupEmailSettingsMink = function(a, c, b, d) {
		this.menuButton = new MenuButtonRounded(a, c, 6);
		this.id = a;
		this.currentDigest = b;
		this.groupId = d
	};
	GroupEmailSettingsMink.prototype.hide = function() {
		this.menuButton.hide()
	};
	GroupEmailSettingsMink.prototype.switchSettings = function(a, c) {
		function b(a, b) {
			Sfdc.get("emailSettingsMink").title = a;
			Sfdc.Dom.updateHTML(Sfdc.get("emailSettingsMink" + MenuButtonElement.LABEL), a);
			Sfdc.Dom.updateHTML(Sfdc.select(".firstMenuItem .firstMenuText")[0], a);
			Sfdc.Dom.removeClass(Sfdc.select(".emailSettings .menuButtonMenu a.selected")[0], "selected");
			Sfdc.Dom.addClass(Sfdc.select(".emailSettings .menuButtonMenu ." + b)[0], "selected")
		}
		this.menuButton.hide();
		var d = this.currentDigest,
			e = Sfdc.get("emailSettingsMink").title;
		this.currentDigest != a && (this.currentDigest = a, HelpBubble.hideBubble("changeGroupEmailSettingsHelpBubble"), chatter.getToolbox().post({
			url: "/groups/" + this.groupId + "/emailsettings;edit",
			params: {
				emailSetting: a
			},
			failure: function(a, c) {
				b(e, d)
			}
		}), b(c, a))
	};
}
//# sourceMappingURL=/javascript/1411203638000/sfdc/source/ChatterGroupProfilePage.js.map
