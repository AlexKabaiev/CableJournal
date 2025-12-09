const { contextBridge, ipcRenderer } = require('electron');

// Експонуємо безпечний API для renderer процесу
contextBridge.exposeInMainWorld('electronAPI', {
    // Завантажити дані з файлу
    loadData: () => ipcRenderer.invoke('load-data'),
    
    // Зберегти дані у файл
    saveData: (entries) => ipcRenderer.invoke('save-data', entries),
    
    // Експорт в обраний користувачем файл
    exportData: (entries) => ipcRenderer.invoke('export-data', entries),
    
    // Імпорт з файлу
    importData: () => ipcRenderer.invoke('import-data'),
    
    // Отримати шлях до файлу даних
    getDataPath: () => ipcRenderer.invoke('get-data-path'),
    
    // Створити резервну копію
    backupData: (entries) => ipcRenderer.invoke('backup-data', entries)
});
