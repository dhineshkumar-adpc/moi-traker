const {app,BrowserWindow,ipcMain,dialog,shell,Menu}=require('electron');
const path=require('path'),fs=require('fs'),os=require('os');
let win;
function create(){
  win=new BrowserWindow({width:1200,height:850,minWidth:420,minHeight:500,title:'மொய் கணக்கு | Moi Tracker',icon:path.join(__dirname,'icon.png'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false}});
  Menu.setApplicationMenu(null);
  win.loadFile('index.html');
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/.test(url))shell.openExternal(url);return {action:'deny'}});
}
const backupDir=()=>{const d=path.join(app.getPath('documents'),'MoiTracker');fs.mkdirSync(d,{recursive:true});return d};
let bt;
ipcMain.handle('backup',(e,json)=>{clearTimeout(bt);bt=setTimeout(()=>{try{fs.writeFileSync(path.join(backupDir(),'moi-data-backup.json'),json)}catch(x){}},500);return true});

// Render one HTML document to PDF (via a temp file, so big photos never hit URL-length limits)
async function renderPDF(html,extra){
  const tmp=path.join(os.tmpdir(),'moi-'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.html');
  fs.writeFileSync(tmp,html,'utf8');
  const w=new BrowserWindow({show:false,webPreferences:{offscreen:false}});
  try{
    await w.loadFile(tmp);
    try{await w.webContents.executeJavaScript("Promise.all([document.fonts?document.fonts.ready:0].concat([].map.call(document.images,function(i){return i.decode?i.decode().catch(function(){}):0})))")}catch(x){}
    await new Promise(r=>setTimeout(r,300));
    return await w.webContents.printToPDF(Object.assign({preferCSSPageSize:true,printBackground:true},extra||{}));
  }finally{w.destroy();try{fs.unlinkSync(tmp)}catch(x){}}
}

ipcMain.handle('savePDF',async(e,data,name)=>{
  // data = {cover, body, wish, header, footer}  (older callers may send a plain HTML string)
  const parts=typeof data==='string'?{body:data}:data;
  const bufs=[];
  if(parts.cover)bufs.push(await renderPDF(parts.cover));
  bufs.push(await renderPDF(parts.body,parts.header?{displayHeaderFooter:true,headerTemplate:parts.header,footerTemplate:parts.footer||'<span></span>'}:null));
  if(parts.wish)bufs.push(await renderPDF(parts.wish));
  let pdf;
  if(bufs.length===1)pdf=bufs[0];
  else{
    const {PDFDocument}=require('pdf-lib');
    const out=await PDFDocument.create();
    for(const b of bufs){const d=await PDFDocument.load(b);const pg=await out.copyPages(d,d.getPageIndices());pg.forEach(p=>out.addPage(p))}
    out.setTitle(name);out.setCreator('Moi Tracker');out.setProducer('Moi Tracker');
    pdf=Buffer.from(await out.save());
  }
  const r=await dialog.showSaveDialog(win,{defaultPath:path.join(app.getPath('documents'),name+'.pdf'),filters:[{name:'PDF',extensions:['pdf']}]});
  if(r.canceled||!r.filePath)return {ok:false};
  fs.writeFileSync(r.filePath,pdf);shell.openPath(r.filePath);
  return {ok:true,path:r.filePath};
});
const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();else{app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});app.whenReady().then(create);app.on('window-all-closed',()=>app.quit())}
