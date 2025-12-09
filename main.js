const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Шлях до файлу з даними (поруч з exe)
function getDataFilePath() {
    // Для portable версії потрібно використовувати змінну середовища
    // або знайти реальний шлях до exe
    
    // Перевіряємо чи це development режим
    if (process.defaultApp || !app.isPackaged) {
        // Development - зберігаємо в папці проекту
        return path.join(__dirname, 'cable_journal_data.json');
    }
    
    // Production/Portable - шукаємо реальний шлях
    // Для portable версії process.env.PORTABLE_EXECUTABLE_DIR містить шлях
    // Для встановленої версії використовуємо папку з exe
    
    let appDir;
    
    // Спочатку перевіряємо змінну для portable
    if (process.env.PORTABLE_EXECUTABLE_DIR) {
        appDir = process.env.PORTABLE_EXECUTABLE_DIR;
    } else if (process.env.PORTABLE_EXECUTABLE_FILE) {
        appDir = path.dirname(process.env.PORTABLE_EXECUTABLE_FILE);
    } else {
        // Для звичайної встановленої версії
        // process.resourcesPath вказує на resources, піднімаємось на рівень вище
        appDir = path.dirname(app.getPath('exe'));
    }
    
    return path.join(appDir, 'cable_journal_data.json');
}

let mainWindow;
let dataFilePath;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        // Прибираємо стандартне меню
        autoHideMenuBar: true
    });

    mainWindow.loadFile('index.html');
    
    // Відкрити DevTools для налагодження (закоментуйте для production)
    // mainWindow.webContents.openDevTools();
}

// Ініціалізація
app.whenReady().then(() => {
    dataFilePath = getDataFilePath();
    console.log('Файл даних:', dataFilePath);
    console.log('PORTABLE_EXECUTABLE_DIR:', process.env.PORTABLE_EXECUTABLE_DIR);
    console.log('PORTABLE_EXECUTABLE_FILE:', process.env.PORTABLE_EXECUTABLE_FILE);
    console.log('app.isPackaged:', app.isPackaged);
    console.log('process.resourcesPath:', process.resourcesPath);
    
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// ==================== IPC HANDLERS ====================

// Завантажити дані з файлу
ipcMain.handle('load-data', async () => {
    try {
        if (fs.existsSync(dataFilePath)) {
            const data = fs.readFileSync(dataFilePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('Помилка завантаження:', error);
        return [];
    }
});

// Зберегти дані у файл
ipcMain.handle('save-data', async (event, entries) => {
    try {
        const data = JSON.stringify(entries, null, 2);
        fs.writeFileSync(dataFilePath, data, 'utf-8');
        return { success: true };
    } catch (error) {
        console.error('Помилка збереження:', error);
        return { success: false, error: error.message };
    }
});

// Експорт в обраний файл
ipcMain.handle('export-data', async (event, entries) => {
    try {
        const result = await dialog.showSaveDialog(mainWindow, {
            title: 'Експорт даних',
            defaultPath: `cable_journal_${new Date().toISOString().split('T')[0]}.json`,
            filters: [
                { name: 'JSON файли', extensions: ['json'] },
                { name: 'Всі файли', extensions: ['*'] }
            ]
        });

        if (!result.canceled && result.filePath) {
            const data = JSON.stringify(entries, null, 2);
            fs.writeFileSync(result.filePath, data, 'utf-8');
            return { success: true, filePath: result.filePath };
        }
        return { success: false, canceled: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Імпорт з файлу
ipcMain.handle('import-data', async () => {
    try {
        const result = await dialog.showOpenDialog(mainWindow, {
            title: 'Імпорт даних',
            filters: [
                { name: 'JSON файли', extensions: ['json'] },
                { name: 'Всі файли', extensions: ['*'] }
            ],
            properties: ['openFile']
        });

        if (!result.canceled && result.filePaths.length > 0) {
            const data = fs.readFileSync(result.filePaths[0], 'utf-8');
            const entries = JSON.parse(data);
            return { success: true, entries: entries };
        }
        return { success: false, canceled: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// Отримати шлях до файлу даних
ipcMain.handle('get-data-path', async () => {
    return dataFilePath;
});

// Створити резервну копію
ipcMain.handle('backup-data', async (event, entries) => {
    try {
        const backupDir = path.join(path.dirname(dataFilePath), 'backups');
        
        // Створюємо папку backups якщо не існує
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }
        
        const backupPath = path.join(
            backupDir, 
            `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        );
        
        const data = JSON.stringify(entries, null, 2);
        fs.writeFileSync(backupPath, data, 'utf-8');
        
        return { success: true, filePath: backupPath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
