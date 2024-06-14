import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  let result;
  const connection = pgp()("postgres://api:password@localhost:5432/database");
  try {
    const id = crypto.randomUUID();

    const [acc] = await connection.query(
      "select * from cccat16.account where email = $1",
      [req.body.email]
    );
    if (acc) result = -4;
    if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) result = -3;
    if (!req.body.email.match(/^(.+)@(.+)$/)) result = -2;
    if (!validate(req.body.cpf)) result = -1;
    if (!req.body.isDriver && req.body.carPlate && !req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) result = -5;
    await connection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        req.body.name,
        req.body.email,
        req.body.cpf,
        req.body.carPlate,
        !!req.body.isPassenger,
        !!req.body.isDriver,
      ]
    );
    if (typeof result === "number") {
      res.status(422).send(result + "");
    } else {
      const obj = {
        accountId: id,
      };
      result = obj;
      res.json(result);
    }
  } finally {
    await connection.$pool.end();
  }
});

app.get("/accounts/:id", async function (req, res) {
  console.log(req.params);
  const connection = pgp()("postgres://api:password@localhost:5432/database");
  const { id } = req.params;
  const [acc] = await connection.query(
    "select * from cccat16.account where account_id = $1",
    id
  );
  if (!acc) {
    console.log("conta nao encontrada");
    res.sendStatus(422);
  } else {
    const {
      account_id: accountId,
      is_passenger: isPassenger,
      is_driver: isDriver,
      car_plate: carPlate,
      ...otherProperties
    } = acc;
    res.json({ accountId, isPassenger, isDriver, carPlate, ...otherProperties });
  }
  await connection.$pool.end();
});

app.listen(3000);
