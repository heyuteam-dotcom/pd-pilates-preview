addEventListener('DOMContentLoaded',()=>{
const city=new URLSearchParams(location.search).get('city');
if(city==='taipei'||city==='taichung')document.querySelectorAll('a[href]').forEach(a=>{
 const raw=a.getAttribute('href');if(!raw||raw.startsWith('#')||/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw))return;
 const url=new URL(raw,location.href);if(!url.pathname.endsWith('.html'))return;
 if(url.pathname.endsWith('/landing.html'))url.pathname=url.pathname.replace(/landing\.html$/,'landing-'+city+'.html');
 url.searchParams.set('city',city);a.href=url.href;
});
if(parent===window)return;
document.querySelectorAll('a[href]').forEach(a=>a.target='_top');
const m=document.querySelector('main');const send=()=>parent.postMessage({type:'pd-page-size',height:m.getBoundingClientRect().height},'*');
new ResizeObserver(send).observe(m);document.fonts.ready.then(send);addEventListener('load',send);send();
});
