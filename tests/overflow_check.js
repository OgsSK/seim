() => {
  const vw = window.innerWidth;
  const res = { vw, sw: document.documentElement.scrollWidth, bsw: document.body.scrollWidth, off: [], clipped: [] };
  const isClippedByAncestor = (el, r) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const cs = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(cs.overflowX) || /(hidden|clip)/.test(cs.overflow)) {
        const pr = p.getBoundingClientRect();
        if (pr.right <= vw + 1 && pr.left >= -1) return true;
      }
      p = p.parentElement;
    }
    return false;
  };
  document.querySelectorAll('body *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.position === 'fixed') return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const hasText = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
    if ((r.right > vw + 1 || r.left < -1) && !isClippedByAncestor(el, r)) {
      res.off.push(`${el.tagName.toLowerCase()}.${(el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0,60)} [${Math.round(r.left)},${Math.round(r.right)}] "${(el.innerText||'').trim().slice(0,50)}"`);
    }
    if (hasText && el.scrollWidth > el.clientWidth + 1 && /(hidden|clip)/.test(cs.overflowX)) {
      res.clipped.push(`${el.tagName.toLowerCase()} "${el.innerText.trim().slice(0,60)}" sw=${el.scrollWidth} cw=${el.clientWidth}`);
    }
    // text visibly cut by ancestor clipping
    if (hasText && (r.right > vw + 1 || r.left < -1) && isClippedByAncestor(el, r)) {
      res.clipped.push(`CUT ${el.tagName.toLowerCase()} [${Math.round(r.left)},${Math.round(r.right)}] "${(el.innerText||'').trim().slice(0,60)}"`);
    }
  });
  res.off = res.off.slice(0, 15); res.clipped = res.clipped.slice(0, 15);
  return res;
}
