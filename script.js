const KEY="soulScrapbookCafe_v1";
const defaultState={
  coins:0, memories:[], gallery:[], menu:[],
  theme:"classic", mood:"calm", companion:"🐈",
  unlocked:["classic"], milestones:[],
  firstVisit:false, truthLevel:0, endingSeen:false,
  atmosphere:"none", decorations:[]
};
let state=JSON.parse(localStorage.getItem(KEY)||"null")||structuredClone(defaultState);
function save(){localStorage.setItem(KEY,JSON.stringify(state)); refreshUI();}
function money(n){state.coins+=n; save(); toast(`+${n} coins ✨`)}
function toast(t){let x=document.getElementById("toast");if(!x)return;x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),1800)}
function refreshUI(){
 document.querySelectorAll("[data-coins]").forEach(x=>x.textContent=state.coins.toLocaleString());
 document.querySelectorAll("[data-theme]").forEach(x=>x.textContent=state.theme);
 document.querySelectorAll("[data-memories]").forEach(x=>x.textContent=state.memories.length);
}
function setTheme(t){
 if(!state.unlocked.includes(t)){toast("You haven't unlocked this theme yet.");return}
 state.theme=t; save(); location.reload();
}
function addMemory(e){
 e.preventDefault();
 const f=e.target, title=f.title.value.trim(), story=f.story.value.trim(), mood=f.mood.value;
 if(!story && !title){toast("Write a little something first ☕");return}
 const m={id:Date.now(),title:title||"Untitled Memory",story,mood,date:new Date().toLocaleDateString(),quote:f.quote.value.trim()};
 state.memories.unshift(m);
 state.truthLevel=Math.min(5,state.truthLevel+1);
 money(100 + Math.min(400,state.truthLevel*50));
 f.reset(); toast("Memory saved to the scrapbook ✨");
 renderMemories();
 checkMilestones();
}
function renderMemories(){
 const box=document.getElementById("memoryList");if(!box)return;
 box.innerHTML=state.memories.length?state.memories.map(m=>`
 <article class="memory">
   <span class="badge">${m.mood}</span><small>${m.date}</small>
   <h3>${esc(m.title)}</h3><p>${esc(m.story).replace(/\n/g,"<br>")}</p>
   ${m.quote?`<blockquote>“${esc(m.quote)}”</blockquote>`:""}
   <button class="pink" onclick="removeMemory(${m.id})">Archive page</button>
 </article>`).join(""):"<p>Your scrapbook is empty. Your first page is waiting...</p>";
}
function removeMemory(id){
 state.memories=state.memories.filter(x=>x.id!==id); save(); renderMemories();
}
function checkMilestones(){
 const milestones=[
  [1,"First Page","The café remembers your handwriting.","100 coins"],
  [3,"Familiar Feeling","A tiny bell rings whenever you enter.","300 coins"],
  [5,"The Missing Day","You find a strange photograph in a drawer.","500 coins"],
  [10,"Between Worlds","The café windows show a sky you don't recognize.","1,000 coins"],
  [25,"The Truth Beckons","Someone leaves a note: “You have been here before.”","2,500 coins"],
  [50,"Almost Home","The companion remembers what happened.","5,000 coins"],
  [100,"The Last Page","A locked door appears behind the café counter.","10,000 coins"],
  [200,"The Final Secret","The door opens. The truth is waiting.","20,000 coins"]
 ];
 milestones.forEach(([n,name,desc,reward])=>{
   if(state.memories.length>=n && !state.milestones.includes(n)){
     state.milestones.push(n); state.coins += n*10; toast(`Milestone: ${name}! +${n*10} coins`);
   }
 });
 save();
}
function buy(item,cost){
 if(state.coins<cost){toast("Not enough coins yet 💰");return}
 if(item==="afterlife"){
   if(state.coins<100000){toast("Something beyond the locked door requires 100,000 coins.");return}
   state.unlocked.push("afterlife");state.theme="afterlife";state.endingSeen=true;
   save(); location.href="afterlife.html";return;
 }
 state.coins-=cost;
 if(!state.decorations.includes(item))state.decorations.push(item);
 save();toast(`${item} added to your café!`);
}
function chooseCompanion(c){state.companion=c;save();location.reload()}
function setMood(m){state.mood=m;save();toast(`Mood set to ${m}`)}
function playAtmosphere(type){
 state.atmosphere=type;save();
 const audio=document.getElementById("ambience");
 if(!audio){toast(`${type} atmosphere selected`);return}
 audio.src= type==="rain" ? "https://cdn.pixabay.com/audio/2022/05/13/audio_257f0d4b0d.mp3" : "";
 audio.play().catch(()=>toast("Tap the page again to allow audio."));
}
function createMenu(){
 const name=prompt("Name your café menu item:");
 if(!name)return;
 const price=Math.max(1,Number(prompt("Price in coins?","25"))||25);
 state.menu.push({name,price});save();renderMenu();
}
function renderMenu(){
 const b=document.getElementById("menuList");if(!b)return;
 b.innerHTML=state.menu.map((x,i)=>`<div class="card"><h3>☕ ${esc(x.name)}</h3><p>${x.price} coins</p><button onclick="sellMenu(${i})">Serve customer</button></div>`).join("")||"<p>No menu items yet. Create one from your memories.</p>";
}
function sellMenu(i){
 const x=state.menu[i]; money(x.price+10); toast(`A customer loved ${x.name}!`);
}
function recipe(){
 const recipes=[
 "2 cups of happiness + one rainy afternoon + your favorite song.",
 "1 spoonful of courage + 3 silly jokes + a warm cup of tea.",
 "A handful of nostalgia + sunset light + someone you miss."
 ];
 alert("✨ Memory Recipe ✨\n\n"+recipes[Math.floor(Math.random()*recipes.length)]);
}
function timeMachine(){
 const years=Math.floor(Math.random()*6)+1;
 alert(`⏳ Café Time Machine\n\nThe room flickers and shows a version of your café from ${years} year(s) ago.\n\nSome memories don't belong to dates. They belong to feelings.`);
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function resetGame(){if(confirm("Reset your café and scrapbook?")){localStorage.removeItem(KEY);location.reload()}}
document.addEventListener("DOMContentLoaded",()=>{
 refreshUI();renderMemories();renderMenu();checkMilestones();
 const form=document.getElementById("memoryForm");if(form)form.addEventListener("submit",addMemory);
});