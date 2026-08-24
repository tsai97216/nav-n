const state={data:[],query:""};

async function loadData(){
  const response=await fetch("data/data.json",{cache:"no-store"});
  if(!response.ok) throw new Error(`data.json: HTTP ${response.status}`);
  const data=await response.json();
  if(!Array.isArray(data)) throw new Error("data.json 必須是陣列");
  return data;
}

function getLinks(section){
  if(Array.isArray(section.links)) return section.links;
  if(Array.isArray(section.list)) return section.list.flatMap(item=>Array.isArray(item.links)?item.links:[]);
  return [];
}

function render(){
  const menu=document.querySelector("#nav-menu");
  const content=document.querySelector("#content");
  menu.innerHTML="";
  content.innerHTML="";
  const query=state.query.trim().toLowerCase();

  state.data.forEach((section,index)=>{
    const links=getLinks(section).filter(link=>{
      if(!query) return true;
      return [link.title,link.url,link.description,section.taxonomy].join(" ").toLowerCase().includes(query);
    });
    if(!links.length) return;

    const button=document.createElement("button");
    button.textContent=section.taxonomy;
    button.addEventListener("click",()=>document.querySelector(`#section-${index}`)?.scrollIntoView({behavior:"smooth"}));
    menu.appendChild(button);

    const sectionEl=document.createElement("section");
    sectionEl.className="section";
    sectionEl.id=`section-${index}`;
    sectionEl.innerHTML=`<h3>${escapeHtml(section.taxonomy)}</h3><div class="content-grid"></div>`;
    const grid=sectionEl.querySelector(".content-grid");
    links.forEach(link=>{
      const card=document.createElement("a");
      card.className="card";
      card.href=link.url;
      card.target="_blank";
      card.rel="noopener noreferrer";
      card.innerHTML=`<div class="card-title">${escapeHtml(link.title||"未命名")}</div><div class="card-desc">${escapeHtml(link.description||"")}</div>`;
      grid.appendChild(card);
    });
    content.appendChild(sectionEl);
  });
}

function escapeHtml(value){return String(value).replace(/[&<>\"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\":"&quot;"}[char]||char));}

(async()=>{
  try{
    state.data=await loadData();
    render();
    document.querySelector("#search").addEventListener("input",event=>{state.query=event.target.value;render()});
  }catch(error){
    console.error("NAV 載入失敗:",error);
    document.querySelector("#content").innerHTML=`<p>網站資料暫時無法載入。<br><small>${escapeHtml(error.message)}</small></p>`;
  }
})();
