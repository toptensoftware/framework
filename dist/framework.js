var C = "top", B = "bottom", M = "right", L = "left", ke = "auto", me = [C, B, M, L], ae = "start", be = "end", Ut = "clippingParents", Ot = "viewport", ue = "popper", Gt = "reference", ot = /* @__PURE__ */ me.reduce(function(t, e) {
  return t.concat([e + "-" + ae, e + "-" + be]);
}, []), xt = /* @__PURE__ */ [].concat(me, [ke]).reduce(function(t, e) {
  return t.concat([e, e + "-" + ae, e + "-" + be]);
}, []), Yt = "beforeRead", Xt = "read", zt = "afterRead", _t = "beforeMain", Kt = "main", Zt = "afterMain", Jt = "beforeWrite", Qt = "write", er = "afterWrite", Me = [Yt, Xt, zt, _t, Kt, Zt, Jt, Qt, er];
function W(t) {
  return t ? (t.nodeName || "").toLowerCase() : null;
}
function $(t) {
  if (t == null)
    return window;
  if (t.toString() !== "[object Window]") {
    var e = t.ownerDocument;
    return e && e.defaultView || window;
  }
  return t;
}
function Q(t) {
  var e = $(t).Element;
  return t instanceof e || t instanceof Element;
}
function j(t) {
  var e = $(t).HTMLElement;
  return t instanceof e || t instanceof HTMLElement;
}
function We(t) {
  if (typeof ShadowRoot > "u")
    return !1;
  var e = $(t).ShadowRoot;
  return t instanceof e || t instanceof ShadowRoot;
}
function tr(t) {
  var e = t.state;
  Object.keys(e.elements).forEach(function(r) {
    var a = e.styles[r] || {}, n = e.attributes[r] || {}, i = e.elements[r];
    !j(i) || !W(i) || (Object.assign(i.style, a), Object.keys(n).forEach(function(o) {
      var s = n[o];
      s === !1 ? i.removeAttribute(o) : i.setAttribute(o, s === !0 ? "" : s);
    }));
  });
}
function rr(t) {
  var e = t.state, r = {
    popper: {
      position: e.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(e.elements.popper.style, r.popper), e.styles = r, e.elements.arrow && Object.assign(e.elements.arrow.style, r.arrow), function() {
    Object.keys(e.elements).forEach(function(a) {
      var n = e.elements[a], i = e.attributes[a] || {}, o = Object.keys(e.styles.hasOwnProperty(a) ? e.styles[a] : r[a]), s = o.reduce(function(c, p) {
        return c[p] = "", c;
      }, {});
      !j(n) || !W(n) || (Object.assign(n.style, s), Object.keys(i).forEach(function(c) {
        n.removeAttribute(c);
      }));
    });
  };
}
const ar = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: tr,
  effect: rr,
  requires: ["computeStyles"]
};
function V(t) {
  return t.split("-")[0];
}
var J = Math.max, Ae = Math.min, ne = Math.round;
function $e() {
  var t = navigator.userAgentData;
  return t != null && t.brands ? t.brands.map(function(e) {
    return e.brand + "/" + e.version;
  }).join(" ") : navigator.userAgent;
}
function Tt() {
  return !/^((?!chrome|android).)*safari/i.test($e());
}
function oe(t, e, r) {
  e === void 0 && (e = !1), r === void 0 && (r = !1);
  var a = t.getBoundingClientRect(), n = 1, i = 1;
  e && j(t) && (n = t.offsetWidth > 0 && ne(a.width) / t.offsetWidth || 1, i = t.offsetHeight > 0 && ne(a.height) / t.offsetHeight || 1);
  var o = Q(t) ? $(t) : window, s = o.visualViewport, c = !Tt() && r, p = (a.left + (c && s ? s.offsetLeft : 0)) / n, l = (a.top + (c && s ? s.offsetTop : 0)) / i, g = a.width / n, h = a.height / i;
  return {
    width: g,
    height: h,
    top: l,
    right: p + g,
    bottom: l + h,
    left: p,
    x: p,
    y: l
  };
}
function Ue(t) {
  var e = oe(t), r = t.offsetWidth, a = t.offsetHeight;
  return Math.abs(e.width - r) <= 1 && (r = e.width), Math.abs(e.height - a) <= 1 && (a = e.height), {
    x: t.offsetLeft,
    y: t.offsetTop,
    width: r,
    height: a
  };
}
function Dt(t, e) {
  var r = e.getRootNode && e.getRootNode();
  if (t.contains(e))
    return !0;
  if (r && We(r)) {
    var a = e;
    do {
      if (a && t.isSameNode(a))
        return !0;
      a = a.parentNode || a.host;
    } while (a);
  }
  return !1;
}
function H(t) {
  return $(t).getComputedStyle(t);
}
function nr(t) {
  return ["table", "td", "th"].indexOf(W(t)) >= 0;
}
function X(t) {
  return ((Q(t) ? t.ownerDocument : t.document) || window.document).documentElement;
}
function Ce(t) {
  return W(t) === "html" ? t : t.assignedSlot || t.parentNode || (We(t) ? t.host : null) || X(t);
}
function it(t) {
  return !j(t) || H(t).position === "fixed" ? null : t.offsetParent;
}
function or(t) {
  var e = /firefox/i.test($e()), r = /Trident/i.test($e());
  if (r && j(t)) {
    var a = H(t);
    if (a.position === "fixed")
      return null;
  }
  var n = Ce(t);
  for (We(n) && (n = n.host); j(n) && ["html", "body"].indexOf(W(n)) < 0; ) {
    var i = H(n);
    if (i.transform !== "none" || i.perspective !== "none" || i.contain === "paint" || ["transform", "perspective"].indexOf(i.willChange) !== -1 || e && i.willChange === "filter" || e && i.filter && i.filter !== "none")
      return n;
    n = n.parentNode;
  }
  return null;
}
function ge(t) {
  for (var e = $(t), r = it(t); r && nr(r) && H(r).position === "static"; )
    r = it(r);
  return r && (W(r) === "html" || W(r) === "body" && H(r).position === "static") ? e : r || or(t) || e;
}
function Ge(t) {
  return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
}
function pe(t, e, r) {
  return J(t, Ae(e, r));
}
function ir(t, e, r) {
  var a = pe(t, e, r);
  return a > r ? r : a;
}
function St() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function At(t) {
  return Object.assign({}, St(), t);
}
function Pt(t, e) {
  return e.reduce(function(r, a) {
    return r[a] = t, r;
  }, {});
}
var sr = function(e, r) {
  return e = typeof e == "function" ? e(Object.assign({}, r.rects, {
    placement: r.placement
  })) : e, At(typeof e != "number" ? e : Pt(e, me));
};
function cr(t) {
  var e, r = t.state, a = t.name, n = t.options, i = r.elements.arrow, o = r.modifiersData.popperOffsets, s = V(r.placement), c = Ge(s), p = [L, M].indexOf(s) >= 0, l = p ? "height" : "width";
  if (!(!i || !o)) {
    var g = sr(n.padding, r), h = Ue(i), d = c === "y" ? C : L, T = c === "y" ? B : M, E = r.rects.reference[l] + r.rects.reference[c] - o[c] - r.rects.popper[l], O = o[c] - r.rects.reference[c], S = ge(i), R = S ? c === "y" ? S.clientHeight || 0 : S.clientWidth || 0 : 0, A = E / 2 - O / 2, w = g[d], x = R - h[l] - g[T], b = R / 2 - h[l] / 2 + A, u = pe(w, b, x), f = c;
    r.modifiersData[a] = (e = {}, e[f] = u, e.centerOffset = u - b, e);
  }
}
function ur(t) {
  var e = t.state, r = t.options, a = r.element, n = a === void 0 ? "[data-popper-arrow]" : a;
  if (n != null && !(typeof n == "string" && (n = e.elements.popper.querySelector(n), !n))) {
    if (process.env.NODE_ENV !== "production" && (j(n) || console.error(['Popper: "arrow" element must be an HTMLElement (not an SVGElement).', "To use an SVG arrow, wrap it in an HTMLElement that will be used as", "the arrow."].join(" "))), !Dt(e.elements.popper, n)) {
      process.env.NODE_ENV !== "production" && console.error(['Popper: "arrow" modifier\'s `element` must be a child of the popper', "element."].join(" "));
      return;
    }
    e.elements.arrow = n;
  }
}
const lr = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: cr,
  effect: ur,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function ie(t) {
  return t.split("-")[1];
}
var fr = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function pr(t) {
  var e = t.x, r = t.y, a = window, n = a.devicePixelRatio || 1;
  return {
    x: ne(e * n) / n || 0,
    y: ne(r * n) / n || 0
  };
}
function st(t) {
  var e, r = t.popper, a = t.popperRect, n = t.placement, i = t.variation, o = t.offsets, s = t.position, c = t.gpuAcceleration, p = t.adaptive, l = t.roundOffsets, g = t.isFixed, h = o.x, d = h === void 0 ? 0 : h, T = o.y, E = T === void 0 ? 0 : T, O = typeof l == "function" ? l({
    x: d,
    y: E
  }) : {
    x: d,
    y: E
  };
  d = O.x, E = O.y;
  var S = o.hasOwnProperty("x"), R = o.hasOwnProperty("y"), A = L, w = C, x = window;
  if (p) {
    var b = ge(r), u = "clientHeight", f = "clientWidth";
    if (b === $(r) && (b = X(r), H(b).position !== "static" && s === "absolute" && (u = "scrollHeight", f = "scrollWidth")), b = b, n === C || (n === L || n === M) && i === be) {
      w = B;
      var v = g && b === x && x.visualViewport ? x.visualViewport.height : b[u];
      E -= v - a.height, E *= c ? 1 : -1;
    }
    if (n === L || (n === C || n === B) && i === be) {
      A = M;
      var y = g && b === x && x.visualViewport ? x.visualViewport.width : b[f];
      d -= y - a.width, d *= c ? 1 : -1;
    }
  }
  var m = Object.assign({
    position: s
  }, p && fr), D = l === !0 ? pr({
    x: d,
    y: E
  }) : {
    x: d,
    y: E
  };
  if (d = D.x, E = D.y, c) {
    var P;
    return Object.assign({}, m, (P = {}, P[w] = R ? "0" : "", P[A] = S ? "0" : "", P.transform = (x.devicePixelRatio || 1) <= 1 ? "translate(" + d + "px, " + E + "px)" : "translate3d(" + d + "px, " + E + "px, 0)", P));
  }
  return Object.assign({}, m, (e = {}, e[w] = R ? E + "px" : "", e[A] = S ? d + "px" : "", e.transform = "", e));
}
function dr(t) {
  var e = t.state, r = t.options, a = r.gpuAcceleration, n = a === void 0 ? !0 : a, i = r.adaptive, o = i === void 0 ? !0 : i, s = r.roundOffsets, c = s === void 0 ? !0 : s;
  if (process.env.NODE_ENV !== "production") {
    var p = H(e.elements.popper).transitionProperty || "";
    o && ["transform", "top", "right", "bottom", "left"].some(function(g) {
      return p.indexOf(g) >= 0;
    }) && console.warn(["Popper: Detected CSS transitions on at least one of the following", 'CSS properties: "transform", "top", "right", "bottom", "left".', `

`, 'Disable the "computeStyles" modifier\'s `adaptive` option to allow', "for smooth transitions, or remove these properties from the CSS", "transition declaration on the popper element if only transitioning", "opacity or background-color for example.", `

`, "We recommend using the popper element as a wrapper around an inner", "element that can have any CSS property transitioned for animations."].join(" "));
  }
  var l = {
    placement: V(e.placement),
    variation: ie(e.placement),
    popper: e.elements.popper,
    popperRect: e.rects.popper,
    gpuAcceleration: n,
    isFixed: e.options.strategy === "fixed"
  };
  e.modifiersData.popperOffsets != null && (e.styles.popper = Object.assign({}, e.styles.popper, st(Object.assign({}, l, {
    offsets: e.modifiersData.popperOffsets,
    position: e.options.strategy,
    adaptive: o,
    roundOffsets: c
  })))), e.modifiersData.arrow != null && (e.styles.arrow = Object.assign({}, e.styles.arrow, st(Object.assign({}, l, {
    offsets: e.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: c
  })))), e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-placement": e.placement
  });
}
const vr = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: dr,
  data: {}
};
var xe = {
  passive: !0
};
function br(t) {
  var e = t.state, r = t.instance, a = t.options, n = a.scroll, i = n === void 0 ? !0 : n, o = a.resize, s = o === void 0 ? !0 : o, c = $(e.elements.popper), p = [].concat(e.scrollParents.reference, e.scrollParents.popper);
  return i && p.forEach(function(l) {
    l.addEventListener("scroll", r.update, xe);
  }), s && c.addEventListener("resize", r.update, xe), function() {
    i && p.forEach(function(l) {
      l.removeEventListener("scroll", r.update, xe);
    }), s && c.removeEventListener("resize", r.update, xe);
  };
}
const hr = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: br,
  data: {}
};
var mr = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function Se(t) {
  return t.replace(/left|right|bottom|top/g, function(e) {
    return mr[e];
  });
}
var gr = {
  start: "end",
  end: "start"
};
function ct(t) {
  return t.replace(/start|end/g, function(e) {
    return gr[e];
  });
}
function Ye(t) {
  var e = $(t), r = e.pageXOffset, a = e.pageYOffset;
  return {
    scrollLeft: r,
    scrollTop: a
  };
}
function Xe(t) {
  return oe(X(t)).left + Ye(t).scrollLeft;
}
function yr(t, e) {
  var r = $(t), a = X(t), n = r.visualViewport, i = a.clientWidth, o = a.clientHeight, s = 0, c = 0;
  if (n) {
    i = n.width, o = n.height;
    var p = Tt();
    (p || !p && e === "fixed") && (s = n.offsetLeft, c = n.offsetTop);
  }
  return {
    width: i,
    height: o,
    x: s + Xe(t),
    y: c
  };
}
function wr(t) {
  var e, r = X(t), a = Ye(t), n = (e = t.ownerDocument) == null ? void 0 : e.body, i = J(r.scrollWidth, r.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0), o = J(r.scrollHeight, r.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0), s = -a.scrollLeft + Xe(t), c = -a.scrollTop;
  return H(n || r).direction === "rtl" && (s += J(r.clientWidth, n ? n.clientWidth : 0) - i), {
    width: i,
    height: o,
    x: s,
    y: c
  };
}
function ze(t) {
  var e = H(t), r = e.overflow, a = e.overflowX, n = e.overflowY;
  return /auto|scroll|overlay|hidden/.test(r + n + a);
}
function Rt(t) {
  return ["html", "body", "#document"].indexOf(W(t)) >= 0 ? t.ownerDocument.body : j(t) && ze(t) ? t : Rt(Ce(t));
}
function de(t, e) {
  var r;
  e === void 0 && (e = []);
  var a = Rt(t), n = a === ((r = t.ownerDocument) == null ? void 0 : r.body), i = $(a), o = n ? [i].concat(i.visualViewport || [], ze(a) ? a : []) : a, s = e.concat(o);
  return n ? s : s.concat(de(Ce(o)));
}
function qe(t) {
  return Object.assign({}, t, {
    left: t.x,
    top: t.y,
    right: t.x + t.width,
    bottom: t.y + t.height
  });
}
function Er(t, e) {
  var r = oe(t, !1, e === "fixed");
  return r.top = r.top + t.clientTop, r.left = r.left + t.clientLeft, r.bottom = r.top + t.clientHeight, r.right = r.left + t.clientWidth, r.width = t.clientWidth, r.height = t.clientHeight, r.x = r.left, r.y = r.top, r;
}
function ut(t, e, r) {
  return e === Ot ? qe(yr(t, r)) : Q(e) ? Er(e, r) : qe(wr(X(t)));
}
function Or(t) {
  var e = de(Ce(t)), r = ["absolute", "fixed"].indexOf(H(t).position) >= 0, a = r && j(t) ? ge(t) : t;
  return Q(a) ? e.filter(function(n) {
    return Q(n) && Dt(n, a) && W(n) !== "body";
  }) : [];
}
function xr(t, e, r, a) {
  var n = e === "clippingParents" ? Or(t) : [].concat(e), i = [].concat(n, [r]), o = i[0], s = i.reduce(function(c, p) {
    var l = ut(t, p, a);
    return c.top = J(l.top, c.top), c.right = Ae(l.right, c.right), c.bottom = Ae(l.bottom, c.bottom), c.left = J(l.left, c.left), c;
  }, ut(t, o, a));
  return s.width = s.right - s.left, s.height = s.bottom - s.top, s.x = s.left, s.y = s.top, s;
}
function Nt(t) {
  var e = t.reference, r = t.element, a = t.placement, n = a ? V(a) : null, i = a ? ie(a) : null, o = e.x + e.width / 2 - r.width / 2, s = e.y + e.height / 2 - r.height / 2, c;
  switch (n) {
    case C:
      c = {
        x: o,
        y: e.y - r.height
      };
      break;
    case B:
      c = {
        x: o,
        y: e.y + e.height
      };
      break;
    case M:
      c = {
        x: e.x + e.width,
        y: s
      };
      break;
    case L:
      c = {
        x: e.x - r.width,
        y: s
      };
      break;
    default:
      c = {
        x: e.x,
        y: e.y
      };
  }
  var p = n ? Ge(n) : null;
  if (p != null) {
    var l = p === "y" ? "height" : "width";
    switch (i) {
      case ae:
        c[p] = c[p] - (e[l] / 2 - r[l] / 2);
        break;
      case be:
        c[p] = c[p] + (e[l] / 2 - r[l] / 2);
        break;
    }
  }
  return c;
}
function he(t, e) {
  e === void 0 && (e = {});
  var r = e, a = r.placement, n = a === void 0 ? t.placement : a, i = r.strategy, o = i === void 0 ? t.strategy : i, s = r.boundary, c = s === void 0 ? Ut : s, p = r.rootBoundary, l = p === void 0 ? Ot : p, g = r.elementContext, h = g === void 0 ? ue : g, d = r.altBoundary, T = d === void 0 ? !1 : d, E = r.padding, O = E === void 0 ? 0 : E, S = At(typeof O != "number" ? O : Pt(O, me)), R = h === ue ? Gt : ue, A = t.rects.popper, w = t.elements[T ? R : h], x = xr(Q(w) ? w : w.contextElement || X(t.elements.popper), c, l, o), b = oe(t.elements.reference), u = Nt({
    reference: b,
    element: A,
    strategy: "absolute",
    placement: n
  }), f = qe(Object.assign({}, A, u)), v = h === ue ? f : b, y = {
    top: x.top - v.top + S.top,
    bottom: v.bottom - x.bottom + S.bottom,
    left: x.left - v.left + S.left,
    right: v.right - x.right + S.right
  }, m = t.modifiersData.offset;
  if (h === ue && m) {
    var D = m[n];
    Object.keys(y).forEach(function(P) {
      var N = [M, B].indexOf(P) >= 0 ? 1 : -1, F = [C, B].indexOf(P) >= 0 ? "y" : "x";
      y[P] += D[F] * N;
    });
  }
  return y;
}
function Tr(t, e) {
  e === void 0 && (e = {});
  var r = e, a = r.placement, n = r.boundary, i = r.rootBoundary, o = r.padding, s = r.flipVariations, c = r.allowedAutoPlacements, p = c === void 0 ? xt : c, l = ie(a), g = l ? s ? ot : ot.filter(function(T) {
    return ie(T) === l;
  }) : me, h = g.filter(function(T) {
    return p.indexOf(T) >= 0;
  });
  h.length === 0 && (h = g, process.env.NODE_ENV !== "production" && console.error(["Popper: The `allowedAutoPlacements` option did not allow any", "placements. Ensure the `placement` option matches the variation", "of the allowed placements.", 'For example, "auto" cannot be used to allow "bottom-start".', 'Use "auto-start" instead.'].join(" ")));
  var d = h.reduce(function(T, E) {
    return T[E] = he(t, {
      placement: E,
      boundary: n,
      rootBoundary: i,
      padding: o
    })[V(E)], T;
  }, {});
  return Object.keys(d).sort(function(T, E) {
    return d[T] - d[E];
  });
}
function Dr(t) {
  if (V(t) === ke)
    return [];
  var e = Se(t);
  return [ct(t), e, ct(e)];
}
function Sr(t) {
  var e = t.state, r = t.options, a = t.name;
  if (!e.modifiersData[a]._skip) {
    for (var n = r.mainAxis, i = n === void 0 ? !0 : n, o = r.altAxis, s = o === void 0 ? !0 : o, c = r.fallbackPlacements, p = r.padding, l = r.boundary, g = r.rootBoundary, h = r.altBoundary, d = r.flipVariations, T = d === void 0 ? !0 : d, E = r.allowedAutoPlacements, O = e.options.placement, S = V(O), R = S === O, A = c || (R || !T ? [Se(O)] : Dr(O)), w = [O].concat(A).reduce(function(te, G) {
      return te.concat(V(G) === ke ? Tr(e, {
        placement: G,
        boundary: l,
        rootBoundary: g,
        padding: p,
        flipVariations: T,
        allowedAutoPlacements: E
      }) : G);
    }, []), x = e.rects.reference, b = e.rects.popper, u = /* @__PURE__ */ new Map(), f = !0, v = w[0], y = 0; y < w.length; y++) {
      var m = w[y], D = V(m), P = ie(m) === ae, N = [C, B].indexOf(D) >= 0, F = N ? "width" : "height", k = he(e, {
        placement: m,
        boundary: l,
        rootBoundary: g,
        altBoundary: h,
        padding: p
      }), I = N ? P ? M : L : P ? B : C;
      x[F] > b[F] && (I = Se(I));
      var U = Se(I), q = [];
      if (i && q.push(k[D] <= 0), s && q.push(k[I] <= 0, k[U] <= 0), q.every(function(te) {
        return te;
      })) {
        v = m, f = !1;
        break;
      }
      u.set(m, q);
    }
    if (f)
      for (var ye = T ? 3 : 1, Le = function(G) {
        var ce = w.find(function(Ee) {
          var z = u.get(Ee);
          if (z)
            return z.slice(0, G).every(function(Fe) {
              return Fe;
            });
        });
        if (ce)
          return v = ce, "break";
      }, se = ye; se > 0; se--) {
        var we = Le(se);
        if (we === "break")
          break;
      }
    e.placement !== v && (e.modifiersData[a]._skip = !0, e.placement = v, e.reset = !0);
  }
}
const Ar = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: Sr,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function lt(t, e, r) {
  return r === void 0 && (r = {
    x: 0,
    y: 0
  }), {
    top: t.top - e.height - r.y,
    right: t.right - e.width + r.x,
    bottom: t.bottom - e.height + r.y,
    left: t.left - e.width - r.x
  };
}
function ft(t) {
  return [C, M, B, L].some(function(e) {
    return t[e] >= 0;
  });
}
function Pr(t) {
  var e = t.state, r = t.name, a = e.rects.reference, n = e.rects.popper, i = e.modifiersData.preventOverflow, o = he(e, {
    elementContext: "reference"
  }), s = he(e, {
    altBoundary: !0
  }), c = lt(o, a), p = lt(s, n, i), l = ft(c), g = ft(p);
  e.modifiersData[r] = {
    referenceClippingOffsets: c,
    popperEscapeOffsets: p,
    isReferenceHidden: l,
    hasPopperEscaped: g
  }, e.attributes.popper = Object.assign({}, e.attributes.popper, {
    "data-popper-reference-hidden": l,
    "data-popper-escaped": g
  });
}
const Rr = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: Pr
};
function Nr(t, e, r) {
  var a = V(t), n = [L, C].indexOf(a) >= 0 ? -1 : 1, i = typeof r == "function" ? r(Object.assign({}, e, {
    placement: t
  })) : r, o = i[0], s = i[1];
  return o = o || 0, s = (s || 0) * n, [L, M].indexOf(a) >= 0 ? {
    x: s,
    y: o
  } : {
    x: o,
    y: s
  };
}
function kr(t) {
  var e = t.state, r = t.options, a = t.name, n = r.offset, i = n === void 0 ? [0, 0] : n, o = xt.reduce(function(l, g) {
    return l[g] = Nr(g, e.rects, i), l;
  }, {}), s = o[e.placement], c = s.x, p = s.y;
  e.modifiersData.popperOffsets != null && (e.modifiersData.popperOffsets.x += c, e.modifiersData.popperOffsets.y += p), e.modifiersData[a] = o;
}
const Cr = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: kr
};
function Lr(t) {
  var e = t.state, r = t.name;
  e.modifiersData[r] = Nt({
    reference: e.rects.reference,
    element: e.rects.popper,
    strategy: "absolute",
    placement: e.placement
  });
}
const Fr = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Lr,
  data: {}
};
function Ir(t) {
  return t === "x" ? "y" : "x";
}
function jr(t) {
  var e = t.state, r = t.options, a = t.name, n = r.mainAxis, i = n === void 0 ? !0 : n, o = r.altAxis, s = o === void 0 ? !1 : o, c = r.boundary, p = r.rootBoundary, l = r.altBoundary, g = r.padding, h = r.tether, d = h === void 0 ? !0 : h, T = r.tetherOffset, E = T === void 0 ? 0 : T, O = he(e, {
    boundary: c,
    rootBoundary: p,
    padding: g,
    altBoundary: l
  }), S = V(e.placement), R = ie(e.placement), A = !R, w = Ge(S), x = Ir(w), b = e.modifiersData.popperOffsets, u = e.rects.reference, f = e.rects.popper, v = typeof E == "function" ? E(Object.assign({}, e.rects, {
    placement: e.placement
  })) : E, y = typeof v == "number" ? {
    mainAxis: v,
    altAxis: v
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, v), m = e.modifiersData.offset ? e.modifiersData.offset[e.placement] : null, D = {
    x: 0,
    y: 0
  };
  if (!!b) {
    if (i) {
      var P, N = w === "y" ? C : L, F = w === "y" ? B : M, k = w === "y" ? "height" : "width", I = b[w], U = I + O[N], q = I - O[F], ye = d ? -f[k] / 2 : 0, Le = R === ae ? u[k] : f[k], se = R === ae ? -f[k] : -u[k], we = e.elements.arrow, te = d && we ? Ue(we) : {
        width: 0,
        height: 0
      }, G = e.modifiersData["arrow#persistent"] ? e.modifiersData["arrow#persistent"].padding : St(), ce = G[N], Ee = G[F], z = pe(0, u[k], te[k]), Fe = A ? u[k] / 2 - ye - z - ce - y.mainAxis : Le - z - ce - y.mainAxis, Mt = A ? -u[k] / 2 + ye + z + Ee + y.mainAxis : se + z + Ee + y.mainAxis, Ie = e.elements.arrow && ge(e.elements.arrow), $t = Ie ? w === "y" ? Ie.clientTop || 0 : Ie.clientLeft || 0 : 0, Ke = (P = m == null ? void 0 : m[w]) != null ? P : 0, qt = I + Fe - Ke - $t, Vt = I + Mt - Ke, Ze = pe(d ? Ae(U, qt) : U, I, d ? J(q, Vt) : q);
      b[w] = Ze, D[w] = Ze - I;
    }
    if (s) {
      var Je, Ht = w === "x" ? C : L, Wt = w === "x" ? B : M, _ = b[x], Oe = x === "y" ? "height" : "width", Qe = _ + O[Ht], et = _ - O[Wt], je = [C, L].indexOf(S) !== -1, tt = (Je = m == null ? void 0 : m[x]) != null ? Je : 0, rt = je ? Qe : _ - u[Oe] - f[Oe] - tt + y.altAxis, at = je ? _ + u[Oe] + f[Oe] - tt - y.altAxis : et, nt = d && je ? ir(rt, _, at) : pe(d ? rt : Qe, _, d ? at : et);
      b[x] = nt, D[x] = nt - _;
    }
    e.modifiersData[a] = D;
  }
}
const Br = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: jr,
  requiresIfExists: ["offset"]
};
function Mr(t) {
  return {
    scrollLeft: t.scrollLeft,
    scrollTop: t.scrollTop
  };
}
function $r(t) {
  return t === $(t) || !j(t) ? Ye(t) : Mr(t);
}
function qr(t) {
  var e = t.getBoundingClientRect(), r = ne(e.width) / t.offsetWidth || 1, a = ne(e.height) / t.offsetHeight || 1;
  return r !== 1 || a !== 1;
}
function Vr(t, e, r) {
  r === void 0 && (r = !1);
  var a = j(e), n = j(e) && qr(e), i = X(e), o = oe(t, n, r), s = {
    scrollLeft: 0,
    scrollTop: 0
  }, c = {
    x: 0,
    y: 0
  };
  return (a || !a && !r) && ((W(e) !== "body" || ze(i)) && (s = $r(e)), j(e) ? (c = oe(e, !0), c.x += e.clientLeft, c.y += e.clientTop) : i && (c.x = Xe(i))), {
    x: o.left + s.scrollLeft - c.x,
    y: o.top + s.scrollTop - c.y,
    width: o.width,
    height: o.height
  };
}
function Hr(t) {
  var e = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set(), a = [];
  t.forEach(function(i) {
    e.set(i.name, i);
  });
  function n(i) {
    r.add(i.name);
    var o = [].concat(i.requires || [], i.requiresIfExists || []);
    o.forEach(function(s) {
      if (!r.has(s)) {
        var c = e.get(s);
        c && n(c);
      }
    }), a.push(i);
  }
  return t.forEach(function(i) {
    r.has(i.name) || n(i);
  }), a;
}
function Wr(t) {
  var e = Hr(t);
  return Me.reduce(function(r, a) {
    return r.concat(e.filter(function(n) {
      return n.phase === a;
    }));
  }, []);
}
function Ur(t) {
  var e;
  return function() {
    return e || (e = new Promise(function(r) {
      Promise.resolve().then(function() {
        e = void 0, r(t());
      });
    })), e;
  };
}
function Y(t) {
  for (var e = arguments.length, r = new Array(e > 1 ? e - 1 : 0), a = 1; a < e; a++)
    r[a - 1] = arguments[a];
  return [].concat(r).reduce(function(n, i) {
    return n.replace(/%s/, i);
  }, t);
}
var K = 'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s', Gr = 'Popper: modifier "%s" requires "%s", but "%s" modifier is not available', pt = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
function Yr(t) {
  t.forEach(function(e) {
    [].concat(Object.keys(e), pt).filter(function(r, a, n) {
      return n.indexOf(r) === a;
    }).forEach(function(r) {
      switch (r) {
        case "name":
          typeof e.name != "string" && console.error(Y(K, String(e.name), '"name"', '"string"', '"' + String(e.name) + '"'));
          break;
        case "enabled":
          typeof e.enabled != "boolean" && console.error(Y(K, e.name, '"enabled"', '"boolean"', '"' + String(e.enabled) + '"'));
          break;
        case "phase":
          Me.indexOf(e.phase) < 0 && console.error(Y(K, e.name, '"phase"', "either " + Me.join(", "), '"' + String(e.phase) + '"'));
          break;
        case "fn":
          typeof e.fn != "function" && console.error(Y(K, e.name, '"fn"', '"function"', '"' + String(e.fn) + '"'));
          break;
        case "effect":
          e.effect != null && typeof e.effect != "function" && console.error(Y(K, e.name, '"effect"', '"function"', '"' + String(e.fn) + '"'));
          break;
        case "requires":
          e.requires != null && !Array.isArray(e.requires) && console.error(Y(K, e.name, '"requires"', '"array"', '"' + String(e.requires) + '"'));
          break;
        case "requiresIfExists":
          Array.isArray(e.requiresIfExists) || console.error(Y(K, e.name, '"requiresIfExists"', '"array"', '"' + String(e.requiresIfExists) + '"'));
          break;
        case "options":
        case "data":
          break;
        default:
          console.error('PopperJS: an invalid property has been provided to the "' + e.name + '" modifier, valid properties are ' + pt.map(function(a) {
            return '"' + a + '"';
          }).join(", ") + '; but "' + r + '" was provided.');
      }
      e.requires && e.requires.forEach(function(a) {
        t.find(function(n) {
          return n.name === a;
        }) == null && console.error(Y(Gr, String(e.name), a, a));
      });
    });
  });
}
function Xr(t, e) {
  var r = /* @__PURE__ */ new Set();
  return t.filter(function(a) {
    var n = e(a);
    if (!r.has(n))
      return r.add(n), !0;
  });
}
function zr(t) {
  var e = t.reduce(function(r, a) {
    var n = r[a.name];
    return r[a.name] = n ? Object.assign({}, n, a, {
      options: Object.assign({}, n.options, a.options),
      data: Object.assign({}, n.data, a.data)
    }) : a, r;
  }, {});
  return Object.keys(e).map(function(r) {
    return e[r];
  });
}
var dt = "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.", _r = "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash.", vt = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function bt() {
  for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++)
    e[r] = arguments[r];
  return !e.some(function(a) {
    return !(a && typeof a.getBoundingClientRect == "function");
  });
}
function Kr(t) {
  t === void 0 && (t = {});
  var e = t, r = e.defaultModifiers, a = r === void 0 ? [] : r, n = e.defaultOptions, i = n === void 0 ? vt : n;
  return function(s, c, p) {
    p === void 0 && (p = i);
    var l = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, vt, i),
      modifiersData: {},
      elements: {
        reference: s,
        popper: c
      },
      attributes: {},
      styles: {}
    }, g = [], h = !1, d = {
      state: l,
      setOptions: function(S) {
        var R = typeof S == "function" ? S(l.options) : S;
        E(), l.options = Object.assign({}, i, l.options, R), l.scrollParents = {
          reference: Q(s) ? de(s) : s.contextElement ? de(s.contextElement) : [],
          popper: de(c)
        };
        var A = Wr(zr([].concat(a, l.options.modifiers)));
        if (l.orderedModifiers = A.filter(function(m) {
          return m.enabled;
        }), process.env.NODE_ENV !== "production") {
          var w = Xr([].concat(A, l.options.modifiers), function(m) {
            var D = m.name;
            return D;
          });
          if (Yr(w), V(l.options.placement) === ke) {
            var x = l.orderedModifiers.find(function(m) {
              var D = m.name;
              return D === "flip";
            });
            x || console.error(['Popper: "auto" placements require the "flip" modifier be', "present and enabled to work."].join(" "));
          }
          var b = H(c), u = b.marginTop, f = b.marginRight, v = b.marginBottom, y = b.marginLeft;
          [u, f, v, y].some(function(m) {
            return parseFloat(m);
          }) && console.warn(['Popper: CSS "margin" styles cannot be used to apply padding', "between the popper and its reference element or boundary.", "To replicate margin, use the `offset` modifier, as well as", "the `padding` option in the `preventOverflow` and `flip`", "modifiers."].join(" "));
        }
        return T(), d.update();
      },
      forceUpdate: function() {
        if (!h) {
          var S = l.elements, R = S.reference, A = S.popper;
          if (!bt(R, A)) {
            process.env.NODE_ENV !== "production" && console.error(dt);
            return;
          }
          l.rects = {
            reference: Vr(R, ge(A), l.options.strategy === "fixed"),
            popper: Ue(A)
          }, l.reset = !1, l.placement = l.options.placement, l.orderedModifiers.forEach(function(m) {
            return l.modifiersData[m.name] = Object.assign({}, m.data);
          });
          for (var w = 0, x = 0; x < l.orderedModifiers.length; x++) {
            if (process.env.NODE_ENV !== "production" && (w += 1, w > 100)) {
              console.error(_r);
              break;
            }
            if (l.reset === !0) {
              l.reset = !1, x = -1;
              continue;
            }
            var b = l.orderedModifiers[x], u = b.fn, f = b.options, v = f === void 0 ? {} : f, y = b.name;
            typeof u == "function" && (l = u({
              state: l,
              options: v,
              name: y,
              instance: d
            }) || l);
          }
        }
      },
      update: Ur(function() {
        return new Promise(function(O) {
          d.forceUpdate(), O(l);
        });
      }),
      destroy: function() {
        E(), h = !0;
      }
    };
    if (!bt(s, c))
      return process.env.NODE_ENV !== "production" && console.error(dt), d;
    d.setOptions(p).then(function(O) {
      !h && p.onFirstUpdate && p.onFirstUpdate(O);
    });
    function T() {
      l.orderedModifiers.forEach(function(O) {
        var S = O.name, R = O.options, A = R === void 0 ? {} : R, w = O.effect;
        if (typeof w == "function") {
          var x = w({
            state: l,
            name: S,
            instance: d,
            options: A
          }), b = function() {
          };
          g.push(x || b);
        }
      });
    }
    function E() {
      g.forEach(function(O) {
        return O();
      }), g = [];
    }
    return d;
  };
}
var Zr = [hr, Fr, vr, ar, Cr, Ar, Br, lr, Rr], Jr = /* @__PURE__ */ Kr({
  defaultModifiers: Zr
});
/*!
* tabbable 6.0.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
var kt = ["input", "select", "textarea", "a[href]", "button", "[tabindex]:not(slot)", "audio[controls]", "video[controls]", '[contenteditable]:not([contenteditable="false"])', "details>summary:first-of-type", "details"], Pe = /* @__PURE__ */ kt.join(","), Ct = typeof Element > "u", ee = Ct ? function() {
} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector, Re = !Ct && Element.prototype.getRootNode ? function(t) {
  return t.getRootNode();
} : function(t) {
  return t.ownerDocument;
}, Lt = function(e, r, a) {
  var n = Array.prototype.slice.apply(e.querySelectorAll(Pe));
  return r && ee.call(e, Pe) && n.unshift(e), n = n.filter(a), n;
}, Ft = function t(e, r, a) {
  for (var n = [], i = Array.from(e); i.length; ) {
    var o = i.shift();
    if (o.tagName === "SLOT") {
      var s = o.assignedElements(), c = s.length ? s : o.children, p = t(c, !0, a);
      a.flatten ? n.push.apply(n, p) : n.push({
        scopeParent: o,
        candidates: p
      });
    } else {
      var l = ee.call(o, Pe);
      l && a.filter(o) && (r || !e.includes(o)) && n.push(o);
      var g = o.shadowRoot || typeof a.getShadowRoot == "function" && a.getShadowRoot(o), h = !a.shadowRootFilter || a.shadowRootFilter(o);
      if (g && h) {
        var d = t(g === !0 ? o.children : g.children, !0, a);
        a.flatten ? n.push.apply(n, d) : n.push({
          scopeParent: o,
          candidates: d
        });
      } else
        i.unshift.apply(i, o.children);
    }
  }
  return n;
}, It = function(e, r) {
  return e.tabIndex < 0 && (r || /^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName) || e.isContentEditable) && isNaN(parseInt(e.getAttribute("tabindex"), 10)) ? 0 : e.tabIndex;
}, Qr = function(e, r) {
  return e.tabIndex === r.tabIndex ? e.documentOrder - r.documentOrder : e.tabIndex - r.tabIndex;
}, jt = function(e) {
  return e.tagName === "INPUT";
}, ea = function(e) {
  return jt(e) && e.type === "hidden";
}, ta = function(e) {
  var r = e.tagName === "DETAILS" && Array.prototype.slice.apply(e.children).some(function(a) {
    return a.tagName === "SUMMARY";
  });
  return r;
}, ra = function(e, r) {
  for (var a = 0; a < e.length; a++)
    if (e[a].checked && e[a].form === r)
      return e[a];
}, aa = function(e) {
  if (!e.name)
    return !0;
  var r = e.form || Re(e), a = function(s) {
    return r.querySelectorAll('input[type="radio"][name="' + s + '"]');
  }, n;
  if (typeof window < "u" && typeof window.CSS < "u" && typeof window.CSS.escape == "function")
    n = a(window.CSS.escape(e.name));
  else
    try {
      n = a(e.name);
    } catch (o) {
      return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s", o.message), !1;
    }
  var i = ra(n, e.form);
  return !i || i === e;
}, na = function(e) {
  return jt(e) && e.type === "radio";
}, oa = function(e) {
  return na(e) && !aa(e);
}, ia = function(e) {
  for (var r, a = Re(e).host, n = !!((r = a) !== null && r !== void 0 && r.ownerDocument.contains(a) || e.ownerDocument.contains(e)); !n && a; ) {
    var i;
    a = Re(a).host, n = !!((i = a) !== null && i !== void 0 && i.ownerDocument.contains(a));
  }
  return n;
}, ht = function(e) {
  var r = e.getBoundingClientRect(), a = r.width, n = r.height;
  return a === 0 && n === 0;
}, sa = function(e, r) {
  var a = r.displayCheck, n = r.getShadowRoot;
  if (getComputedStyle(e).visibility === "hidden")
    return !0;
  var i = ee.call(e, "details>summary:first-of-type"), o = i ? e.parentElement : e;
  if (ee.call(o, "details:not([open]) *"))
    return !0;
  if (!a || a === "full" || a === "legacy-full") {
    if (typeof n == "function") {
      for (var s = e; e; ) {
        var c = e.parentElement, p = Re(e);
        if (c && !c.shadowRoot && n(c) === !0)
          return ht(e);
        e.assignedSlot ? e = e.assignedSlot : !c && p !== e.ownerDocument ? e = p.host : e = c;
      }
      e = s;
    }
    if (ia(e))
      return !e.getClientRects().length;
    if (a !== "legacy-full")
      return !0;
  } else if (a === "non-zero-area")
    return ht(e);
  return !1;
}, ca = function(e) {
  if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))
    for (var r = e.parentElement; r; ) {
      if (r.tagName === "FIELDSET" && r.disabled) {
        for (var a = 0; a < r.children.length; a++) {
          var n = r.children.item(a);
          if (n.tagName === "LEGEND")
            return ee.call(r, "fieldset[disabled] *") ? !0 : !n.contains(e);
        }
        return !0;
      }
      r = r.parentElement;
    }
  return !1;
}, Ne = function(e, r) {
  return !(r.disabled || ea(r) || sa(r, e) || ta(r) || ca(r));
}, Ve = function(e, r) {
  return !(oa(r) || It(r) < 0 || !Ne(e, r));
}, ua = function(e) {
  var r = parseInt(e.getAttribute("tabindex"), 10);
  return !!(isNaN(r) || r >= 0);
}, la = function t(e) {
  var r = [], a = [];
  return e.forEach(function(n, i) {
    var o = !!n.scopeParent, s = o ? n.scopeParent : n, c = It(s, o), p = o ? t(n.candidates) : s;
    c === 0 ? o ? r.push.apply(r, p) : r.push(s) : a.push({
      documentOrder: i,
      tabIndex: c,
      item: n,
      isScope: o,
      content: p
    });
  }), a.sort(Qr).reduce(function(n, i) {
    return i.isScope ? n.push.apply(n, i.content) : n.push(i.content), n;
  }, []).concat(r);
}, fa = function(e, r) {
  r = r || {};
  var a;
  return r.getShadowRoot ? a = Ft([e], r.includeContainer, {
    filter: Ve.bind(null, r),
    flatten: !1,
    getShadowRoot: r.getShadowRoot,
    shadowRootFilter: ua
  }) : a = Lt(e, r.includeContainer, Ve.bind(null, r)), la(a);
}, pa = function(e, r) {
  r = r || {};
  var a;
  return r.getShadowRoot ? a = Ft([e], r.includeContainer, {
    filter: Ne.bind(null, r),
    flatten: !0,
    getShadowRoot: r.getShadowRoot
  }) : a = Lt(e, r.includeContainer, Ne.bind(null, r)), a;
}, Te = function(e, r) {
  if (r = r || {}, !e)
    throw new Error("No node provided");
  return ee.call(e, Pe) === !1 ? !1 : Ve(r, e);
}, da = /* @__PURE__ */ kt.concat("iframe").join(","), Be = function(e, r) {
  if (r = r || {}, !e)
    throw new Error("No node provided");
  return ee.call(e, da) === !1 ? !1 : Ne(r, e);
};
/*!
* focus-trap 7.1.0
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
function mt(t, e) {
  var r = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var a = Object.getOwnPropertySymbols(t);
    e && (a = a.filter(function(n) {
      return Object.getOwnPropertyDescriptor(t, n).enumerable;
    })), r.push.apply(r, a);
  }
  return r;
}
function gt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e] != null ? arguments[e] : {};
    e % 2 ? mt(Object(r), !0).forEach(function(a) {
      va(t, a, r[a]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : mt(Object(r)).forEach(function(a) {
      Object.defineProperty(t, a, Object.getOwnPropertyDescriptor(r, a));
    });
  }
  return t;
}
function va(t, e, r) {
  return e in t ? Object.defineProperty(t, e, {
    value: r,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[e] = r, t;
}
var ba = [], yt = {
  activateTrap: function(e, r) {
    if (e.length > 0) {
      var a = e[e.length - 1];
      a !== r && a.pause();
    }
    var n = e.indexOf(r);
    n === -1 || e.splice(n, 1), e.push(r);
  },
  deactivateTrap: function(e, r) {
    var a = e.indexOf(r);
    a !== -1 && e.splice(a, 1), e.length > 0 && e[e.length - 1].unpause();
  }
}, ha = function(e) {
  return e.tagName && e.tagName.toLowerCase() === "input" && typeof e.select == "function";
}, ma = function(e) {
  return e.key === "Escape" || e.key === "Esc" || e.keyCode === 27;
}, ga = function(e) {
  return e.key === "Tab" || e.keyCode === 9;
}, wt = function(e) {
  return setTimeout(e, 0);
}, Et = function(e, r) {
  var a = -1;
  return e.every(function(n, i) {
    return r(n) ? (a = i, !1) : !0;
  }), a;
}, le = function(e) {
  for (var r = arguments.length, a = new Array(r > 1 ? r - 1 : 0), n = 1; n < r; n++)
    a[n - 1] = arguments[n];
  return typeof e == "function" ? e.apply(void 0, a) : e;
}, De = function(e) {
  return e.target.shadowRoot && typeof e.composedPath == "function" ? e.composedPath()[0] : e.target;
}, Bt = function(e, r) {
  var a = (r == null ? void 0 : r.document) || document, n = (r == null ? void 0 : r.trapStack) || ba, i = gt({
    returnFocusOnDeactivate: !0,
    escapeDeactivates: !0,
    delayInitialFocus: !0
  }, r), o = {
    containers: [],
    containerGroups: [],
    tabbableGroups: [],
    nodeFocusedBeforeActivation: null,
    mostRecentlyFocusedNode: null,
    active: !1,
    paused: !1,
    delayInitialFocusTimer: void 0
  }, s, c = function(u, f, v) {
    return u && u[f] !== void 0 ? u[f] : i[v || f];
  }, p = function(u) {
    return o.containerGroups.findIndex(function(f) {
      var v = f.container, y = f.tabbableNodes;
      return v.contains(u) || y.find(function(m) {
        return m === u;
      });
    });
  }, l = function(u) {
    var f = i[u];
    if (typeof f == "function") {
      for (var v = arguments.length, y = new Array(v > 1 ? v - 1 : 0), m = 1; m < v; m++)
        y[m - 1] = arguments[m];
      f = f.apply(void 0, y);
    }
    if (f === !0 && (f = void 0), !f) {
      if (f === void 0 || f === !1)
        return f;
      throw new Error("`".concat(u, "` was specified but was not a node, or did not return a node"));
    }
    var D = f;
    if (typeof f == "string" && (D = a.querySelector(f), !D))
      throw new Error("`".concat(u, "` as selector refers to no known node"));
    return D;
  }, g = function() {
    var u = l("initialFocus");
    if (u === !1)
      return !1;
    if (u === void 0)
      if (p(a.activeElement) >= 0)
        u = a.activeElement;
      else {
        var f = o.tabbableGroups[0], v = f && f.firstTabbableNode;
        u = v || l("fallbackFocus");
      }
    if (!u)
      throw new Error("Your focus-trap needs to have at least one focusable element");
    return u;
  }, h = function() {
    if (o.containerGroups = o.containers.map(function(u) {
      var f = fa(u, i.tabbableOptions), v = pa(u, i.tabbableOptions);
      return {
        container: u,
        tabbableNodes: f,
        focusableNodes: v,
        firstTabbableNode: f.length > 0 ? f[0] : null,
        lastTabbableNode: f.length > 0 ? f[f.length - 1] : null,
        nextTabbableNode: function(m) {
          var D = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, P = v.findIndex(function(N) {
            return N === m;
          });
          if (!(P < 0))
            return D ? v.slice(P + 1).find(function(N) {
              return Te(N, i.tabbableOptions);
            }) : v.slice(0, P).reverse().find(function(N) {
              return Te(N, i.tabbableOptions);
            });
        }
      };
    }), o.tabbableGroups = o.containerGroups.filter(function(u) {
      return u.tabbableNodes.length > 0;
    }), o.tabbableGroups.length <= 0 && !l("fallbackFocus"))
      throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times");
  }, d = function b(u) {
    if (u !== !1 && u !== a.activeElement) {
      if (!u || !u.focus) {
        b(g());
        return;
      }
      u.focus({
        preventScroll: !!i.preventScroll
      }), o.mostRecentlyFocusedNode = u, ha(u) && u.select();
    }
  }, T = function(u) {
    var f = l("setReturnFocus", u);
    return f || (f === !1 ? !1 : u);
  }, E = function(u) {
    var f = De(u);
    if (!(p(f) >= 0)) {
      if (le(i.clickOutsideDeactivates, u)) {
        s.deactivate({
          returnFocus: i.returnFocusOnDeactivate && !Be(f, i.tabbableOptions)
        });
        return;
      }
      le(i.allowOutsideClick, u) || u.preventDefault();
    }
  }, O = function(u) {
    var f = De(u), v = p(f) >= 0;
    v || f instanceof Document ? v && (o.mostRecentlyFocusedNode = f) : (u.stopImmediatePropagation(), d(o.mostRecentlyFocusedNode || g()));
  }, S = function(u) {
    var f = De(u);
    h();
    var v = null;
    if (o.tabbableGroups.length > 0) {
      var y = p(f), m = y >= 0 ? o.containerGroups[y] : void 0;
      if (y < 0)
        u.shiftKey ? v = o.tabbableGroups[o.tabbableGroups.length - 1].lastTabbableNode : v = o.tabbableGroups[0].firstTabbableNode;
      else if (u.shiftKey) {
        var D = Et(o.tabbableGroups, function(U) {
          var q = U.firstTabbableNode;
          return f === q;
        });
        if (D < 0 && (m.container === f || Be(f, i.tabbableOptions) && !Te(f, i.tabbableOptions) && !m.nextTabbableNode(f, !1)) && (D = y), D >= 0) {
          var P = D === 0 ? o.tabbableGroups.length - 1 : D - 1, N = o.tabbableGroups[P];
          v = N.lastTabbableNode;
        }
      } else {
        var F = Et(o.tabbableGroups, function(U) {
          var q = U.lastTabbableNode;
          return f === q;
        });
        if (F < 0 && (m.container === f || Be(f, i.tabbableOptions) && !Te(f, i.tabbableOptions) && !m.nextTabbableNode(f)) && (F = y), F >= 0) {
          var k = F === o.tabbableGroups.length - 1 ? 0 : F + 1, I = o.tabbableGroups[k];
          v = I.firstTabbableNode;
        }
      }
    } else
      v = l("fallbackFocus");
    v && (u.preventDefault(), d(v));
  }, R = function(u) {
    if (ma(u) && le(i.escapeDeactivates, u) !== !1) {
      u.preventDefault(), s.deactivate();
      return;
    }
    if (ga(u)) {
      S(u);
      return;
    }
  }, A = function(u) {
    var f = De(u);
    p(f) >= 0 || le(i.clickOutsideDeactivates, u) || le(i.allowOutsideClick, u) || (u.preventDefault(), u.stopImmediatePropagation());
  }, w = function() {
    if (!!o.active)
      return yt.activateTrap(n, s), o.delayInitialFocusTimer = i.delayInitialFocus ? wt(function() {
        d(g());
      }) : d(g()), a.addEventListener("focusin", O, !0), a.addEventListener("mousedown", E, {
        capture: !0,
        passive: !1
      }), a.addEventListener("touchstart", E, {
        capture: !0,
        passive: !1
      }), a.addEventListener("click", A, {
        capture: !0,
        passive: !1
      }), a.addEventListener("keydown", R, {
        capture: !0,
        passive: !1
      }), s;
  }, x = function() {
    if (!!o.active)
      return a.removeEventListener("focusin", O, !0), a.removeEventListener("mousedown", E, !0), a.removeEventListener("touchstart", E, !0), a.removeEventListener("click", A, !0), a.removeEventListener("keydown", R, !0), s;
  };
  return s = {
    get active() {
      return o.active;
    },
    get paused() {
      return o.paused;
    },
    activate: function(u) {
      if (o.active)
        return this;
      var f = c(u, "onActivate"), v = c(u, "onPostActivate"), y = c(u, "checkCanFocusTrap");
      y || h(), o.active = !0, o.paused = !1, o.nodeFocusedBeforeActivation = a.activeElement, f && f();
      var m = function() {
        y && h(), w(), v && v();
      };
      return y ? (y(o.containers.concat()).then(m, m), this) : (m(), this);
    },
    deactivate: function(u) {
      if (!o.active)
        return this;
      var f = gt({
        onDeactivate: i.onDeactivate,
        onPostDeactivate: i.onPostDeactivate,
        checkCanReturnFocus: i.checkCanReturnFocus
      }, u);
      clearTimeout(o.delayInitialFocusTimer), o.delayInitialFocusTimer = void 0, x(), o.active = !1, o.paused = !1, yt.deactivateTrap(n, s);
      var v = c(f, "onDeactivate"), y = c(f, "onPostDeactivate"), m = c(f, "checkCanReturnFocus"), D = c(f, "returnFocus", "returnFocusOnDeactivate");
      v && v();
      var P = function() {
        wt(function() {
          D && d(T(o.nodeFocusedBeforeActivation)), y && y();
        });
      };
      return D && m ? (m(T(o.nodeFocusedBeforeActivation)).then(P, P), this) : (P(), this);
    },
    pause: function() {
      return o.paused || !o.active ? this : (o.paused = !0, x(), this);
    },
    unpause: function() {
      return !o.paused || !o.active ? this : (o.paused = !1, h(), w(), this);
    },
    updateContainerElements: function(u) {
      var f = [].concat(u).filter(Boolean);
      return o.containers = f.map(function(v) {
        return typeof v == "string" ? a.querySelector(v) : v;
      }), o.active && h(), this;
    }
  }, s.updateContainerElements(e), s;
};
const ya = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createFocusTrap: Bt
}, Symbol.toStringTag, { value: "Module" }));
let re = [], fe = {};
function wa() {
  for (let t = re.length - 1; t >= 0; t--)
    re[t].close();
}
function He(t, e) {
  let r, a;
  if (t.classList.contains("popover-active"))
    return !1;
  let n = t.getAttribute("data-sv-tooltip");
  n && (r = document.createElement("div"), r.classList.add("tooltip"), r.innerText = n, a = !0, document.body.appendChild(r));
  let i = t.getAttribute("data-sv-popover");
  if (i && (r = document.querySelector(i)), r || (t.tagName == "BUTTON" || t.tagName == "A") && (r = t.querySelector(".popover,.menu")), !r)
    return !1;
  function o(d) {
    let T = r.getAttribute(d);
    return T == null && (T = t.getAttribute(d)), T;
  }
  let s = o("data-sv-popover-group") || "default";
  if (s && fe[s] && (fe[s](), delete fe[s]), !t.dispatchEvent(new Event("sv-popover-will-appear", { bubbles: !0, cancelable: !0 })))
    return !1;
  r.classList.add("show"), t.classList.add("popover-active");
  let c = o("data-sv-popover-placement");
  !c && r.classList.contains("menu") && (c = "bottom-start");
  let p = Jr(t, r, {
    placement: c || "bottom",
    modifiers: [
      { name: "offset", options: { offset: [0, 4] } }
    ]
  });
  function l() {
    a && r.remove(), r.classList.remove("show"), t.classList.remove("popover-active"), p.destroy(), fe[s] = null, re = re.filter((d) => d.popover != r), t.dispatchEvent(new Event("sv-popover-did-disappear", { bubbles: !0, cancelable: !0 }));
  }
  let g = o("data-sv-popover-interaction") || e.interaction || "anywhere", h;
  return g == "hover" && (h = function(d) {
    l(), t.removeEventListener("mouseleave", h);
  }, t.addEventListener("mouseleave", h)), g == "anchor" && (h = function(d) {
    l(), t.removeEventListener("click", h), d && d.stopPropagation();
  }, t.addEventListener("click", h)), g == "anywhere" && (h = function(d) {
    return l(), document.body.removeEventListener("click", h), !1;
  }, document.body.addEventListener("click", h)), g == "outside" && (h = function(d) {
    return d && (r == d.target || r.contains(d.target)) ? !0 : (l(), document.body.removeEventListener("click", h), !1);
  }, document.body.addEventListener("click", h)), re.push({
    anchor: t,
    popover: r,
    close: h
  }), s && (fe[s] = h), !0;
}
let Z, ve;
function Ea(t) {
  let e;
  if (typeof t == "string" ? e = document.querySelector(t) : e = t, !(e instanceof HTMLElement) || !e.dispatchEvent(new Event("sv-modal-will-appear", { bubbles: !0, cancelable: !0 })))
    return;
  wa(), _e(), document.body.classList.add("modal-active"), e.classList.add("modal-active");
  let r = document.createElement("div");
  r.classList.add("modal-backdrop"), document.body.appendChild(r), ya && (ve = Bt(e, {
    escapeDeactivates: !1,
    clickOutsideDeactivates: !1,
    allowOutsideClick: !1,
    returnFocusOnDeactivate: !0,
    preventScroll: !0
  }), ve.activate()), Z = e;
}
function _e() {
  if (ve && (ve.deactivate(), ve = null), Z) {
    let t = document.querySelector(".modal-backdrop");
    t && t.remove(), document.body.classList.remove("modal-active"), Z.classList.remove("modal-active"), Z.dispatchEvent(new Event("sv-modal-did-disappear", { bubbles: !0, cancelable: !1 })), Z = null;
  }
}
document.body.addEventListener("click", function(t) {
  let e = t.target;
  for (; e && !r() && (e = e.parentElement, !(!e || e.classList.contains("popover") || e.classList.contains("modal-frame") || e.classList.contains("dialog"))); )
    ;
  function r() {
    if (e.classList.contains("close")) {
      if (e.closest(".modal-frame") && Z)
        return _e(), t.preventDefault(), !0;
      let i = e.closest(".dismissable");
      return i && i.remove(), !0;
    }
    if (e.getAttribute("data-sv-popover") || e.querySelector(":scope > .popover") || e.querySelector(":scope > .menu"))
      return He(e, {
        interaction: "anywhere"
      }), t.preventDefault(), !0;
    let a = e.getAttribute("data-sv-modal");
    return a ? (Ea(a), !0) : !1;
  }
});
document.body.addEventListener("mouseenter", function(t) {
  let e = t.target.getAttribute("data-sv-popover-interaction");
  if (e)
    return e == "hover" ? He(t.target, { interaction: "hover" }) : void 0;
  if (t.target.getAttribute("data-sv-tooltip"))
    return He(t.target, { interaction: "hover" });
}, !0);
document.body.addEventListener("keydown", function(t) {
  if (t.key === "Escape") {
    let e = re.pop();
    if (e)
      return e.close(), t.stopPropagation(), t.preventDefault(), !1;
    if (Z)
      return _e(), t.stopPropagation(), t.preventDefault(), !1;
  }
}, !0);
export {
  _e as sv_modal_close,
  Ea as sv_modal_show,
  wa as sv_popover_close_all,
  He as sv_popover_show
};
