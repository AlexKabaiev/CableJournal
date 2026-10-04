# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Комплект проектної документації в каталозі `docs/`:
  - [ARCHITECTURE.md](docs/ARCHITECTURE.md) — детальний опис архітектури процесів Electron, моделі безпеки та IPC-каналів.
  - [DATA_MODEL.md](docs/DATA_MODEL.md) — специфікація схеми запису СКС, словників типів пристроїв і статусів та форматів експорту.
  - [USER_GUIDE.md](docs/USER_GUIDE.md) — покрокове керівництво користувача з експлуатації, пошуку, бекапування та друку.
  - [DEVELOPMENT.md](docs/DEVELOPMENT.md) — інструкція для розробників з налаштування середовища, налагодження та збірки portable дистрибутиву.
- Атомарний запис JSON-файлів у [main.js](main.js) за допомогою тимчасових файлів (`.tmp`) для запобігання втрати та пошкодження бази при раптових аварійних зупинках.

### Changed
- Повністю перероблено [README.md](README.md): виправлено відображення на GitHub, додано бейджі статусу, таблиці специфікацій даних, Mermaid-діаграму та оновлені інструкції для portable версії.

## [1.0.0] - 2026-03-01

### Added
- Базова версія десктопного додатку на базі Electron 28.
- Модуль управління записами кабельного журналу (Локація, Фізична лінія, Комутаційна шафа, Активне обладнання, Адміністрування).
- Експорт даних у CSV, Excel XML (.xls) та HTML.
- Функція прямого друку в альбомній орієнтації.
- Створення резервних копій у каталог `backups/`.
- Підтримка збірки Windows Portable exe.
