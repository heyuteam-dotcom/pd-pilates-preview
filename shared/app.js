document.addEventListener('DOMContentLoaded',()=>{
const params=new URLSearchParams(location.search);if(params.get('export')==='1')document.body.classList.add('export');
const config=window.PD_CONFIG||{checkoutUrls:{},lineUrls:{}};
const city=['taipei','taichung'].includes(params.get('city'))?params.get('city'):null;
const branches=city==='taichung'?{taichung:'台中店'}:city==='taipei'?{xinyi:'信義店',yongkang:'永康店',zhongxiao:'忠孝店'}:{xinyi:'信義店',zhongxiao:'忠孝店',yongkang:'永康店'};
const localHref=href=>{if(!city)return href;const u=new URL(href,location.href);if(u.pathname.endsWith('/landing.html'))u.pathname=u.pathname.replace(/landing\.html$/,'landing-'+city+'.html');u.searchParams.set('city',city);return u.href};
if(city){
 document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(raw&&!raw.startsWith('#')&&!/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(raw)&&new URL(raw,location.href).pathname.endsWith('.html'))a.href=localHref(raw)});
 const list=document.querySelector('.branch-link-list');
 if(list&&city==='taichung'){
  const button=document.createElement('button');button.type='button';button.dataset.line='taichung';button.append('台中店');
  const status=document.createElement('small');status.className='line-availability';status.textContent='官方 LINE 連結準備中';button.append(status);list.replaceChildren(button);
 }else if(list){for(const key of Object.keys(branches)){const button=list.querySelector('[data-line="'+key+'"]');if(button)list.append(button)}}
}
const plans={trial:{name:'初次體驗',price:'599',detail:'初次體驗價 NT$599（原價 NT$2,600）。新客60分鐘體驗，包含身體評估、InBody 與40分鐘完整一對一課程。取消改期相關規定請見 Q&A。'},premium:{name:'深度4堂體驗',price:'7,888',detail:'深度體驗4堂 NT$7,888（原價 NT$10,400）。4堂一對一課程，每堂50分鐘，限45天內使用完畢。'}};
const validUrl=s=>{try{const u=new URL(s);return u.protocol==='https:'}catch{return false}};
const branch=document.querySelector('#branch'),plan=document.querySelector('#plan');
if(city&&branch)branch.replaceChildren(...Object.entries(branches).map(([value,label])=>new Option(label,value)));
if(branch&&plan){if(branches[params.get('branch')])branch.value=params.get('branch');if(plans[params.get('plan')])plan.value=params.get('plan');
const update=()=>{document.querySelector('#plan-detail').textContent=plans[plan.value].detail;document.querySelector('#cart-content').innerHTML='<p>請加入所選方案。</p>';document.querySelector('#checkout').classList.add('hidden')};branch.addEventListener('change',update);plan.addEventListener('change',update);update();
document.querySelector('#add-cart').addEventListener('click',()=>{const p=plans[plan.value];const cart=document.querySelector('#cart-content');cart.replaceChildren();const summary=document.createElement('p');summary.textContent=branches[branch.value]+'｜'+p.name+' × 1';const total=document.createElement('p');total.className='total';total.textContent='NT$'+p.price;cart.append(summary,total);const link=document.querySelector('#checkout');link.classList.remove('hidden');const real=config.checkoutUrls[plan.value];link.href=validUrl(real)?real:localHref('checkout-success.html?branch='+branch.value+'&plan='+plan.value);link.textContent=validUrl(real)?'前往結帳':'查看結帳後流程';if(validUrl(real))document.querySelector('#preview-status').textContent='請於結帳頁確認方案與所選分館。';});}
const chosen=branches[params.get('branch')]?params.get('branch'):Object.keys(branches)[0];const selected=document.querySelector('#selected-branch');if(selected){selected.textContent='妳選擇的分館：'+branches[chosen];const link=document.querySelector('#selected-line');link.href=validUrl(config.lineUrls[chosen])?config.lineUrls[chosen]:localHref('contact.html?branch='+chosen);link.textContent='聯繫'+branches[chosen]+' LINE';}
const form=document.querySelector('#contact-form');if(form)form.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#form-result').textContent='資料格式已確認。這是操作預覽，資料沒有送出；正式預約請與'+branches[chosen]+'客服確認。';});
for(const button of document.querySelectorAll('[data-line]')){const key=button.dataset.line,url=config.lineUrls[key];if(validUrl(url))button.querySelector('.line-availability').textContent='加入分店官方 LINE';button.addEventListener('click',()=>{if(validUrl(url)){location.href=url}else{document.querySelector('#line-message').textContent=branches[key]+'的官方 LINE 連結尚未提供，目前無法開啟。';}})}
});
