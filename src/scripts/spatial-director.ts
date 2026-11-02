import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SpatialAsset, SpatialFrame, SpatialKind } from './spatial/types';
import type { SpatialRenderer } from './spatial-renderer';
gsap.registerPlugin(ScrollTrigger);
const controllers = new WeakMap<HTMLElement,()=>void>();

export function initSpatialExperiences():void {
  document.querySelectorAll<HTMLElement>('[data-spatial-root]').forEach(root => {
    if (controllers.has(root)) return;
    const stage = root.querySelector<HTMLElement>('[data-spatial-stage]');
    const mount = root.querySelector<HTMLElement>('[data-spatial-mount]');
    if (!stage || !mount) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    const abort = new AbortController(); const options = { signal:abort.signal };
    const kind = root.dataset.spatialKind as SpatialKind;
    const hold = Math.min(1.8,Math.max(0,Number(root.dataset.spatialHold)||0));
    let assets:SpatialAsset[] = [];
    try { assets = JSON.parse(root.dataset.spatialAssets || '[]'); } catch { root.dataset.spatialFailed='true'; return; }
    const state:SpatialFrame = { progress:0,pointerX:0,pointerY:0,selection:root.dataset.spatialSelection||'',selectionMix:0,mobile:innerWidth<=700 };
    let renderer:SpatialRenderer|undefined; let timeline:gsap.core.Tween|undefined; let pointer:gsap.core.Tween|undefined; let selectionTween:gsap.core.Tween|undefined;
    let raf = 0; let visible = true; let disposed = false; let failed = false; let suspended = false; let generation = 0; let loading = 0;
    let buildAbort:AbortController|undefined;
    let bounds = mount.getBoundingClientRect();
    let wasEnhanced = false;
    const paused = () => reduce.matches || document.body.dataset.motion === 'paused' || document.documentElement.dataset.motion === 'paused';
    const fits = () => {
      const copy=root.querySelector<HTMLElement>('.spatial-copy');
      if(!copy || innerHeight<740)return false;
      if(innerWidth>700)return copy.scrollHeight<=innerHeight+1;
      const style=getComputedStyle(copy);
      let content=copy.getBoundingClientRect().height-parseFloat(style.paddingTop)-parseFloat(style.paddingBottom);
      const choices=root.querySelector<HTMLElement>('.spatial-choices');
      if(choices && getComputedStyle(choices).position==='absolute')content+=choices.getBoundingClientRect().height+20;
      const header=document.querySelector('.site-header')?.getBoundingClientRect().height || 78;
      const artHeight=innerHeight-header-content-105;
      root.style.setProperty('--spatial-art-height',`${Math.max(220,artHeight)}px`);
      return artHeight>=220;
    };
    const cancel = () => { if (raf) cancelAnimationFrame(raf); raf=0; };
    const paint = () => {
      if (disposed || failed || suspended || !renderer || !visible || document.hidden || raf) return;
      raf=requestAnimationFrame(() => { raf=0; if (!disposed && !suspended && visible && !document.hidden) renderer?.paint(state); });
    };
    const restore = () => { timeline?.scrollTrigger?.kill(); timeline?.kill();timeline=undefined;root.dataset.spatialEnhanced='false'; };
    const sync = () => {
      if (disposed || suspended) return;
      pointer?.kill(); state.pointerX=0;state.pointerY=0;
      if (paused()) { selectionTween?.progress(1).kill(); selectionTween=undefined; }
      if (paused() || !fits() || hold===0) { restore(); paint(); return; }
      if (!timeline && renderer) {
        if (!wasEnhanced && (location.hash || root.getBoundingClientRect().top < -stage.clientHeight*.4)) { paint(); return; }
        root.style.setProperty('--spatial-height',`${(1+hold)*100}svh`);
        root.dataset.spatialEnhanced='true';wasEnhanced=true;
        timeline=gsap.to(state,{progress:1,ease:'none',onUpdate:paint,scrollTrigger:{trigger:root,start:'top top',end:'bottom bottom',scrub:.4,invalidateOnRefresh:true}});
        ScrollTrigger.refresh();
      }
      paint();
    };
    const fail = () => {
      if (disposed || failed) return;
      failed=true;generation++;loading=0;buildAbort?.abort();cancel();restore();renderer?.dispose();renderer=undefined;
      root.dataset.spatialReady='false';root.dataset.spatialFailed='true';
      root.querySelectorAll<HTMLButtonElement>('[data-spatial-choice]').forEach(button=>button.disabled=true);
    };
    const boot = async () => {
      if (disposed || failed || suspended || loading || renderer) return;
      const token=++generation;loading=token;
      const loadAbort=new AbortController();buildAbort=loadAbort;
      try {
        await document.fonts.ready;
        const { createSpatialRenderer } = await import('./spatial-renderer');
        if (disposed || suspended || token!==generation) return;
        const created=await createSpatialRenderer(mount,kind,assets,loadAbort.signal);
        if (disposed || suspended || token!==generation) {created.dispose();return;}
        renderer=created;
        renderer.paint(state);
        root.dataset.spatialReady='true';
        root.querySelectorAll<HTMLButtonElement>('[data-spatial-choice]').forEach(button=>button.disabled=false);
        sync();
      } catch { if (token===generation) fail(); }
      finally { if (loading===token) loading=0; }
    };
    const resize = () => { if (disposed || suspended) return;bounds=mount.getBoundingClientRect();state.mobile=innerWidth<=700;renderer?.resize();if(innerHeight<680)restore();sync();paint(); };
    const observer = new ResizeObserver(resize);observer.observe(mount);
    const intersection = new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;if(visible)paint();else cancel();},{threshold:.01});intersection.observe(stage);
    stage.addEventListener('pointermove',event=>{
      if(paused()||!fine.matches||event.pointerType!=='mouse')return;
      const x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/Math.max(1,bounds.width)*2-1));
      const y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/Math.max(1,bounds.height)*2-1));
      pointer?.kill();pointer=gsap.to(state,{pointerX:x,pointerY:y,duration:.5,ease:'power3.out',onUpdate:paint});
    },{...options,passive:true});
    const neutral = () => {pointer?.kill();state.pointerX=0;state.pointerY=0;paint();};
    stage.addEventListener('pointerleave',neutral,options);stage.addEventListener('focusin',neutral,options);
    const choices=[...root.querySelectorAll<HTMLButtonElement>('[data-spatial-choice]')];
    choices.forEach((button,index)=>button.addEventListener('click',event=>{
      state.selection=button.dataset.spatialChoice || '';root.dataset.spatialSelection=state.selection;
      choices.forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      selectionTween?.kill();
      const value=index/Math.max(1,choices.length-1);
      if(paused()||event.detail===0)state.selectionMix=value;
      else selectionTween=gsap.to(state,{selectionMix:value,duration:.65,ease:'power3.out',onUpdate:paint});
      paint();
    },options));
    mount.addEventListener('webglcontextlost',event=>{event.preventDefault();if(!disposed&&!suspended)fail();},{...options,capture:true});
    window.addEventListener('portfolio:motion',sync,options);reduce.addEventListener('change',sync,options);
    document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();pointer?.kill();}else paint();},options);
    const dispose = () => {
      if(disposed)return;disposed=true;generation++;loading=0;buildAbort?.abort();cancel();pointer?.kill();selectionTween?.kill();restore();observer.disconnect();intersection.disconnect();abort.abort();renderer?.dispose();renderer=undefined;controllers.delete(root);
    };
    window.addEventListener('pagehide',event=>{
      if(!event.persisted){dispose();return;}
      suspended=true;generation++;loading=0;buildAbort?.abort();cancel();pointer?.kill();selectionTween?.progress(1).kill();timeline?.scrollTrigger?.disable(false);renderer?.dispose();renderer=undefined;root.dataset.spatialReady='false';
    },options);
    window.addEventListener('pageshow',event=>{
      if(!event.persisted)return;suspended=false;timeline?.scrollTrigger?.enable(false);ScrollTrigger.refresh();void boot();
    },options);
    controllers.set(root,dispose);void boot();
  });
}
