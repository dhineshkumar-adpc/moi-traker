const {app,BrowserWindow,ipcMain,dialog,shell,Menu}=require('electron');
const path=require('path'),fs=require('fs'),os=require('os');
let win;
try{app.setAppUserModelId('shop.adpc.moitracker')}catch(e){}

// Windows quirk: after a native dialog / hidden window closes, the page can stay "unfocused" and
// text boxes refuse typing. Always hand the keyboard focus back to the page.
const refocus=()=>{[0,60,250].forEach(ms=>setTimeout(()=>{try{if(win&&!win.isDestroyed()){win.focus();win.webContents.focus()}}catch(e){}},ms))};

function create(){
  win=new BrowserWindow({width:1280,height:840,minWidth:420,minHeight:500,show:false,backgroundColor:'#06142e',
    title:'மொய் கணக்கு | Moi Tracker',icon:path.join(__dirname,'icon.png'),autoHideMenuBar:true,
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,spellcheck:false}});
  // hidden menu that only carries the editing shortcuts (Ctrl+C / V / X / A / Z keep working)
  Menu.setApplicationMenu(Menu.buildFromTemplate([{role:'editMenu'}]));
  win.setMenuBarVisibility(false);
  win.once('ready-to-show',()=>{win.show();refocus()});
  win.on('focus',()=>{try{win.webContents.focus()}catch(e){}});
  win.on('closed',()=>{win=null});
  win.loadFile('index.html');
  win.webContents.on('render-process-gone',()=>{try{win.reload()}catch(e){}});
  win.webContents.setWindowOpenHandler(({url})=>{if(/^https?:/.test(url))shell.openExternal(url);return {action:'deny'}});
}

// ---------- automatic backup (latest + one copy per day, last 30 days kept) ----------
const docsDir=()=>{try{return app.getPath('documents')}catch(e){return os.homedir()}};
const backupDir=()=>{const d=path.join(docsDir(),'MoiTracker');fs.mkdirSync(d,{recursive:true});return d};
let bt,lastJson='';
function doBackup(){
  if(!lastJson)return;
  try{
    const d=backupDir(),day=new Date().toISOString().slice(0,10);
    fs.writeFileSync(path.join(d,'moi-data-backup.json'),lastJson);
    fs.writeFileSync(path.join(d,'moi-data-'+day+'.json'),lastJson);
    const olds=fs.readdirSync(d).filter(n=>/^moi-data-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort();
    olds.slice(0,Math.max(0,olds.length-30)).forEach(n=>{try{fs.unlinkSync(path.join(d,n))}catch(e){}});
    lastJson='';
  }catch(x){}
}
ipcMain.handle('backup',(e,json)=>{lastJson=String(json||'');clearTimeout(bt);bt=setTimeout(doBackup,500);return true});
app.on('before-quit',()=>{clearTimeout(bt);doBackup()});

// ---------- file sync (done here in the main process: no browser file-handle permissions to get stuck) ----------
const cfgFile=()=>path.join(app.getPath('userData'),'moi-sync.json');
const readCfg=()=>{try{return JSON.parse(fs.readFileSync(cfgFile(),'utf8'))}catch(e){return {}}};
const writeCfg=c=>{try{fs.mkdirSync(path.dirname(cfgFile()),{recursive:true});fs.writeFileSync(cfgFile(),JSON.stringify(c))}catch(e){}};
let syncPath=null;
const JSONF=[{name:'Moi data (.json)',extensions:['json']}];
function info(){
  if(!syncPath)return {path:''};
  const o={path:syncPath,name:path.basename(syncPath),dir:path.dirname(syncPath),exists:false,dirExists:false};
  try{o.dirExists=fs.statSync(o.dir).isDirectory()}catch(e){}
  try{const st=fs.statSync(syncPath);o.exists=st.isFile();o.mtime=st.mtimeMs}catch(e){o.err=e.code||String(e)}
  return o;
}
const setPath=p=>{syncPath=p;writeCfg({path:p})};
const wrap=fn=>async(e,...a)=>{try{return await fn(...a)}catch(x){return {ok:false,err:(x&&x.code)||String(x)}}};
ipcMain.handle('sync:info',wrap(()=>{if(syncPath===null)syncPath=readCfg().path||'';return info()}));
ipcMain.handle('sync:create',wrap(async()=>{
  let def;try{def=backupDir()}catch(x){def=docsDir()}
  const r=await dialog.showOpenDialog(win,{title:'Choose or create the sync folder',defaultPath:def,buttonLabel:'Use this folder',properties:['openDirectory','createDirectory']});
  refocus();
  if(r.canceled||!r.filePaths||!r.filePaths[0])return {ok:false,canceled:true};
  fs.mkdirSync(r.filePaths[0],{recursive:true});
  setPath(path.join(r.filePaths[0],'moi-data.json'));
  return {ok:true,info:info()};
}));
ipcMain.handle('sync:open',wrap(async()=>{
  let def;try{def=backupDir()}catch(x){def=docsDir()}
  const r=await dialog.showOpenDialog(win,{title:'Open sync file',defaultPath:def,filters:JSONF,properties:['openFile']});
  refocus();
  if(r.canceled||!r.filePaths||!r.filePaths[0])return {ok:false,canceled:true};
  setPath(r.filePaths[0]);
  return {ok:true,info:info()};
}));
ipcMain.handle('sync:read',wrap(()=>{
  if(!syncPath)return {ok:false,err:'NOPATH'};
  let text='',mtime=0;
  try{text=fs.readFileSync(syncPath,'utf8');mtime=fs.statSync(syncPath).mtimeMs}catch(e){if(e.code==='ENOENT')return {ok:true,text:'',mtime:0,missing:true};throw e}
  return {ok:true,text:text.replace(/^\uFEFF/,''),mtime};
}));
ipcMain.handle('sync:write',wrap(text=>{
  if(!syncPath)return {ok:false,err:'NOPATH'};
  fs.mkdirSync(path.dirname(syncPath),{recursive:true});
  const tmp=syncPath+'.tmp';
  try{fs.writeFileSync(tmp,String(text),'utf8');fs.renameSync(tmp,syncPath)}
  catch(e){try{fs.unlinkSync(tmp)}catch(x){}fs.writeFileSync(syncPath,String(text),'utf8')}   // e.g. cloud-sync tools that lock the rename
  return {ok:true,mtime:fs.statSync(syncPath).mtimeMs};
}));
ipcMain.handle('sync:stat',wrap(()=>{
  if(!syncPath)return {ok:false,err:'NOPATH'};
  return {ok:true,mtime:fs.statSync(syncPath).mtimeMs};
}));
ipcMain.handle('sync:folder',wrap(async()=>{
  if(!syncPath)return {ok:false};
  const d=path.dirname(syncPath);
  if(fs.existsSync(syncPath)){shell.showItemInFolder(syncPath);return {ok:true}}
  fs.mkdirSync(d,{recursive:true});
  const r=await shell.openPath(d);return {ok:!r,err:r};
}));
ipcMain.handle('sync:off',wrap(()=>{syncPath='';writeCfg({path:''});return {ok:true}}));

// ---------- PDF ----------
// Render one HTML document to PDF (via a temp file, so big photos never hit URL-length limits)
async function renderPDF(html,extra){
  const tmp=path.join(os.tmpdir(),'moi-'+Date.now()+'-'+Math.random().toString(36).slice(2)+'.html');
  fs.writeFileSync(tmp,html,'utf8');
  const w=new BrowserWindow({show:false,webPreferences:{offscreen:false,spellcheck:false}});
  try{
    await w.loadFile(tmp);
    try{await w.webContents.executeJavaScript("Promise.all([document.fonts?document.fonts.ready:0].concat([].map.call(document.images,function(i){return i.decode?i.decode().catch(function(){}):0})))")}catch(x){}
    await new Promise(r=>setTimeout(r,300));
    return await w.webContents.printToPDF(Object.assign({preferCSSPageSize:true,printBackground:true},extra||{}));
  }finally{try{w.destroy()}catch(x){}try{fs.unlinkSync(tmp)}catch(x){}}
}

ipcMain.handle('savePDF',async(e,data,name)=>{
  try{
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
    const r=await dialog.showSaveDialog(win,{defaultPath:path.join(docsDir(),name+'.pdf'),filters:[{name:'PDF',extensions:['pdf']}]});
    refocus();
    if(r.canceled||!r.filePath)return {ok:false,canceled:true};
    try{fs.writeFileSync(r.filePath,pdf)}catch(x){return {ok:false,err:(x.code==='EBUSY'||x.code==='EPERM')?'The PDF is open in another program. Close it and try again.':String(x)}}
    shell.openPath(r.filePath);
    return {ok:true,path:r.filePath};
  }catch(x){refocus();return {ok:false,err:String(x&&x.message||x)}}
});

const lock=app.requestSingleInstanceLock();
if(!lock)app.quit();else{
  app.on('second-instance',()=>{if(win){if(win.isMinimized())win.restore();win.focus()}});
  app.whenReady().then(create);
  app.on('window-all-closed',()=>app.quit());
}
