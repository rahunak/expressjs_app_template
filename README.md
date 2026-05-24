Запуск приложения:
1. `cp .env.example .env`
1. `npm install`
1. `docker compose up`
1. Войти в контейнер и выполнить создание таблиц через миграции:
`docker exec -it express_app sh `
`npm migration:run`
Или одной строкой `docker exec -it express_app sh -c "npm migration:run"`