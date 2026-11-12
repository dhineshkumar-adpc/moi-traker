const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('moiApp',{savePDF:(h,n)=>ipcRenderer.invoke('savePDF',h,n),backup:j=>ipcRenderer.invoke('backup',j)});
