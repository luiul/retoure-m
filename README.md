# 🚚 Retouren App with Sequelize Migration

Upgraded [🚚 Retouren App](https://github.com/luiul/retoure) with Sequelize migration and seeding to improve reproducibility. Prerequisites to run the app:

- **PostgreSQL**: install PostgresSQL and create a database.
- **Node.js**: install node.js.

Unlisted Youtube video: [🚚 Retoure App Demo](https://youtu.be/yIhD226f2Mk).

## App Architecture

<img src="figures/restful-api.png" width="800" alt="Restful API App Architecture" class="center">

## Set up

Run the following commands in the shell to set up the project. Start by setting up node.js and Sequelize to migrate and seed the schema and data:

```zsh
npm init -y;
npm install --save sequelize;
npm install --save pg pg-hstore;
npm install --save-dev sequelize-cli;
npx sequelize-cli init
```

Set up the `config.json` file in the `config` folder with credentials for Sequelize. Add file to `.gitignore`. Make model and migrate to PostgreSQL by running the following commands in the shell (after updating `scripts` in `package.json`):

```zsh
npm run make-model;
npm run migrate
```

Make PostgreSQL trigger function to populate `tour` and `tour_zeit` by running the following `create or replace function` statement in the pgAdmin Query Tool or psql:

```sql
create or replace function add_tour()
returns trigger as
$$
begin
 if new.tour_bez = 'NRW 1' then
  new.tour:='{"00000", "00001", "00002", "00003"}';
  new.tour_zeit:='{"6:00 - 8:00", "9:00 - 11:00", "12:00 - 14:00", "15:00 - 17:00"}';
  elsif new.tour_bez = 'NRW 2' then
  new.tour:='{"00003", "00002", "00001", "00000"}';
  new.tour_zeit:='{"6:00 - 8:00", "9:00 - 11:00", "12:00 - 14:00", "15:00 - 17:00"}';
 end if;
return new;
end
$$
language plpgsql
```

Make PostgreSQL trigger by running the following `create trigger` statement in the Query Tool or psql:

```sql
create trigger add_tour_i
before insert on "Transports"
for each row
execute procedure add_tour()
```

```sql
create trigger add_tour_u
before update on "Transports"
for each row
execute procedure add_tour()
```

Run seed and populate the database by running the following command in the shell:

```zsh
npm run seed
```

After populating the database add the pickup, add, and return triggers with the following `create or replace function` and `create trigger` statements in pgAdmin or psql:

```sql
create or replace function pickup_task()
returns trigger as
$$
begin
 if new.transport_status = 'abgeholt 📭' then
  new.fach_status:='frei 📥';
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

```sql
create or replace function reserve_task()
returns trigger as
$$
begin
 if new.transport_status = 'Retoure begonnen 🚚' then
  new.fach_status:='reserviert 🔐';
 end if;
return new;
end
$$
language plpgsql
```

```sql
create trigger reserve_task
before update on "Transports"
for each row
execute procedure reserve_task()
```

The model table for the project would be equivalent to the following PostgreSQL view:

```sql
create or replace view "Transports" as
select id, tranport_status, paket_id, paket_bez, fach_bez, fach_status, zbs_bez, tour_bez, tour, tour_zeit, emp_name, abd_name, abd_plz, versuch, "alter", "createdAt", "updatedAt"
from tour, zbs, fach, paket, paket_transport, emp, abd, ort
where tour.tour_id = zbs.tour_id, zbs.fach_id = fach.fach_id, zbs.paket_id = paket.paket_id, paket.paket_id = paket_transport.paket_id, fach.fach_id = paket_transport.fach_id, paket_transport.emp_id = emp.emp_id, paket_transport.abd_id = abd.abd_id, emp.plz = ort.plz, abd.plz = ort.plz
```

The most important tables for the project as views are:

```sql
create or replace view auftrag as
select id, transport_status, paket_id, paket_bez, emp_name, emp_plz, abd_name ,abd_plz, versuch , "alter"
from "Transports"
```

```sql
create or replace view fach as
select id, fach_bez, fach_status, zbs_bez, tour_bez, tour, tour_zeit
from "Transports"
```

```sql
create view auftrag_fach as
select *
from "Transports"
```

Note that to simplify the data model and model objects of our project we opted out of using multiple tables in the database, creating this view and working with it.

Install other dependencies for the project:

```zsh
npm install express dotenv;
npm install --D nodemon @handlebars/allow-prototype-access express-handlebars handlebars
```

Finally, run the following command in the shell to start the server and open localhost:5000 in the browser:

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
      fach_status: 'frei 📥',
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
      fach_status: 'frei 📥',
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

Passing the `raw = true` parameter to the query will return an array containing a JSON instead of a model instance and its metadata:

```javascript
[
  {
    id: 1,
    transport_status: 'abgeholt 📭',
    paket_id: 1,
    paket_bez: 'Laptop',
    fach_bez: 'Fach 1',
    fach_status: 'frei 📥',
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
