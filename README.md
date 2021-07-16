🚚 Retouren App with Sequelize Migration

Run the following commands to set up the database:

```zsh
npm init -y;
npm install --save sequelize;
npm install --save pg pg-hstore;
npm install --save-dev sequelize-cli;
npx sequelize-cli init;
```

Set up the `config.json` file in the `config` folder.

Make model, migrate to PostgreSQL:

```zsh
npm run make-model;
npm run migrage;
```

Make trigger function to populate `tour` and `tour_zeit`:

```sql
create function add_tour()
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

Make trigger:

```sql
create trigger add_tour
before insert on "Transports"
for each row
execute procedure add_tour()
```

Run seed and populate the database:

```zsh
npm run seed
```