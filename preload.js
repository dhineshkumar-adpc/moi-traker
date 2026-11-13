const {contextBridge,ipcRenderer}=require('electron');
const call=(c,...a)=>ipcRenderer.invoke(c,...a);
contextBridge.exposeInMainWorld('moiApp',{
  savePDF:(h,n)=>call('savePDF',h,n),
  backup:j=>call('backup',j),
  sync:{info:()=>call('sync:info'),create:()=>call('sync:create'),open:()=>call('sync:open'),read:()=>call('sync:read'),
        write:t=>call('sync:write',t),stat:()=>call('sync:stat'),folder:()=>call('sync:folder'),off:()=>call('sync:off')}
});
