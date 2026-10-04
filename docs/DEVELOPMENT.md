# 🛠️ Інструкція розробника CableJournal

## 1. Налаштування середовища розробки

### Попередні вимоги
- **Node.js**: версія 18.x або новіша (LTS рекомендовано)
- **npm**: версія 9.x або новіша
- **ОС**: Windows 10/11 x64 (для перевірки portable-збірок)

### Кроки налаштування
```bash
# Перейдіть у директорію проекту
cd d:/my_projects/CableJournal-main

# Встановіть залежності
npm install
```

---

## 2. Запуск у режимі налагодження (Debug / Development)

```bash
npm start
```

У режимі розробки:
- Дані зберігаються безпосередньо у файлі [cable_journal_data.json](file:///d:/my_projects/CableJournal-main/cable_journal_data.json) у кореневій папці проекту.
- Для відкриття консолі налагодження Chromium DevTools розкоментуйте рядок 58 у файлі [main.js](file:///d:/my_projects/CableJournal-main/main.js):
  ```javascript
  mainWindow.webContents.openDevTools();
  ```

---

## 3. Складання дистрибутиву (Build)

Збірка здійснюється за допомогою інструменту `electron-builder`:

```bash
# Генерація Portable EXE для Windows x64
npm run build:portable
```

Параметри збірки в [package.json](file:///d:/my_projects/CableJournal-main/package.json):
```json
"build": {
  "appId": "com.yourcompany.cablejournal",
  "productName": "CableJournal",
  "directories": {
    "output": "dist"
  },
  "files": [
    "main.js",
    "preload.js",
    "index.html",
    "icon.ico"
  ],
  "win": {
    "target": [
      {
        "target": "portable",
        "arch": ["x64"]
      }
    ],
    "icon": "icon.ico"
  },
  "portable": {
    "artifactName": "CableJournal-Portable.exe",
    "requestExecutionLevel": "user"
  }
}
```

Вихідний файл створюється у `dist/CableJournal-Portable.exe`.

---

## 4. Регламент тестування перед релізом

1. **Перевірка очищення директорії dist:** перед новою збіркою очистити каталог `dist/`.
2. **Перевірка збереження даних у Portable режимі:**
   - Скопіювати `CableJournal-Portable.exe` в окрему порожню теку (наприклад, на USB-накопичувач).
   - Запустити, створити 2 тестові записи, натиснути **Backup**, закрити додаток.
   - Перевірити наявність файлу `cable_journal_data.json` та вкладеної папки `backups/`.
3. **Перевірка експорту:** перевірити відкриття сформованого CSV-файлу у Microsoft Excel — кириличні символи повинні відображатися без спотворень.
