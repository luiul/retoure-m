# 🚚 Retouren App with Sequelize Migration

Updated [🚚 Retouren App](https://github.com/luiul/retoure) with Sequelize migration and seeding to improve reproducibility. Prerequisites to run the app:

- PostgreSQL: install PostgresSQL and create a database. Migrate with Sequelize
- node.js: install node.js.

## Set up

Run the following commands in the shell to set up the project. We start by setting up node.js and Sequelize to migrate and seed the schema and data:

```zsh
npm init -y;
npm install --save sequelize;
npm install --save pg pg-hstore;
npm install --save-dev sequelize-cli;
npx sequelize-cli init;
```

Set up the `config.json` file in the `config` folder for Sequelize. Make model, migrate to PostgreSQL by running the following commands in the shell (after updating `scripts` in `package.json`!):

```zsh
npm run make-model;
npm run migrage;
```

Make PostgreSQL trigger function to populate `tour` and `tour_zeit` by running the following `create or replace function` statement in the PostgreSQL Query Tool:

```sql
create or replace function add_tour()
returns trigger as
$$
begin
 if new.tour_bez = 'NRW 1' then
  new.tour:='{"00000", "00001", "00002", "00000"}';
  new.tour_zeit:='{"6:00 - 8:00", "9:00 - 11:00", "12:00 - 14:00", "15:00 - 17:00"}';
 end if;
return new;
end
$$
language plpgsql
```

Make PostgreSQL trigger by running the following `create trigger` statement in the Query Tool:

```sql
create trigger add_tour
before insert on "Transports"
for each row
execute procedure add_tour()
```

```sql
create trigger add_tour
before update on "Transports"
for each row
execute procedure add_tour()
```

Run seed and populate the database by running the following command in the shell:

```zsh
npm run seed
```

After populating the database we can add the pickup trigger with the following `create or replace function` and `create trigger` statements in PostgreSQL:

```sql
create or replace function pickup_task()
returns trigger as
$$
begin
 if new.transport_status = 'abgeholt 📭' then
  new.fach_status:='frei 🔓';
 end if;
return new;
end
$$
language plpgsql
```

```sql
create trigger pickup_task
before update on "Transports"
for each row
execute procedure pickup_task()
```

```sql
create or replace function add_task()
returns trigger as
$$
begin
 if new.transport_status = 'abholbereit 📬' then
  new.fach_status:='belegt 🔒';
 end if;
return new;
end
$$
language plpgsql
```

```sql
create trigger add_task
before update on "Transports"
for each row
execute procedure add_task()
```

```sql
create or replace function return_task()
returns trigger as
$$
begin
 if new.transport_status = 'retouniert 📦' then
  new.fach_status:='belegt 🔒';
 end if;
return new;
end
$$
language plpgsql
```

```sql
create trigger return_task
before update on "Transports"
for each row
execute procedure return_task()
```

Install other dependencies for the project:

```zsh
npm install express dotenv;
npm install --D nodemon @handlebars/allow-prototype-access express-handlebars handlebars;
```

Finally, run the following command in the shell:

```zsh
npm run dev
```

## Transport Model

Example of an instance of the `Transport` model returned from the database:

```javascript
[
  Transport {
    dataValues: {
      id: 1,
      transport_status: 'abgeholt 📭',
      paket_id: 1,
      paket_bez: 'Laptop',
      fach_bez: 'Fach 1',
      fach_status: 'frei 🔓',
      zbs_bez: 'ZBS 1',
      tour_bez: 'NRW 1',
      tour: [Array],
      tour_zeit: [Array],
      emp_name: 'Alice',
      emp_plz: '00001',
      abd_name: 'Bob',
      abd_plz: '00001',
      abholversuch: 0,
      alter: 0,
      createdAt: 2021-07-17T21:53:34.805Z,
      updatedAt: 2021-07-17T21:53:34.805Z
    },
    _previousDataValues: {
      id: 1,
      transport_status: 'abgeholt 📭',
      paket_id: 1,
      paket_bez: 'Laptop',
      fach_bez: 'Fach 1',
      fach_status: 'frei 🔓',
      zbs_bez: 'ZBS 1',
      tour_bez: 'NRW 1',
      tour: [Array],
      tour_zeit: [Array],
      emp_name: 'Alice',
      emp_plz: '00001',
      abd_name: 'Bob',
      abd_plz: '00001',
      abholversuch: 0,
      alter: 0,
      createdAt: 2021-07-17T21:53:34.805Z,
      updatedAt: 2021-07-17T21:53:34.805Z
    },
    _changed: Set {},
    _options: {
      isNewRecord: false,
      _schema: null,
      _schemaDelimiter: '',
      raw: true,
      attributes: [Array]
    },
    isNewRecord: false
  }
]
```

By passing the parameter `raw = true` to the query, it will return an array with a JSON object instead of a Model instance:

```javascript
[
  {
    id: 1,
    transport_status: 'abgeholt 📭',
    paket_id: 1,
    paket_bez: 'Laptop',
    fach_bez: 'Fach 1',
    fach_status: 'frei 🔓',
    zbs_bez: 'ZBS 1',
    tour_bez: 'NRW 1',
    tour: [ '00000', '00001', '00002', '00000' ],
    tour_zeit: [ '6:00 - 8:00', '9:00 - 11:00', '12:00 - 14:00', '15:00 - 17:00' ],
    emp_name: 'Alice',
    emp_plz: '00001',
    abd_name: 'Bob',
    abd_plz: '00001',
    abholversuch: 0,
    alter: 0,
    createdAt: 2021-07-17T21:53:34.805Z,
    updatedAt: 2021-07-17T21:53:34.805Z
  }
]
```
