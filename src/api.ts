import express from "express";
import { getAccount, signup } from "./application";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
try {
  const output = await signup(req.body);
  res.json(output);
} catch (error: any) {
  res.status(422).json({
    message: error.message
  });
}
});

app.get("/accounts/:id", async function (req, res) {
  const account = await getAccount(req.params.id);
  if(!account) {
    res.sendStatus(404)
  } else {
    const { accountId, isPassenger, isDriver, carPlate, ...otherProperties } = account;
    res.json({ accountId, isPassenger, isDriver, carPlate, ...otherProperties });
  }
});

app.listen(3000);
