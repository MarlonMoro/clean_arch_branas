import express from "express";
import { AccountDAODatabase } from "../resource/AccountDAO";
import { GetAccount } from "../application/GetAccount";
import { Signup } from "../application/Signup";
import { MailerGatewayMemory } from "../resource/MailerGateway";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
try {
  const accountDAO = new AccountDAODatabase();
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountDAO, mailerGateway);
  const output = await signup.execute(req.body);
  res.json(output);
} catch (error: any) {
  res.status(422).json({
    message: error.message
  });
}
});

app.get("/accounts/:id", async function (req, res) {
  const accountDAO = new AccountDAODatabase();
  const getAccount = new GetAccount(accountDAO);
  const account = await getAccount.execute(req.params.id);
  if(!account) {
    res.sendStatus(404)
  } else {
    const { accountId, isPassenger, isDriver, carPlate, ...otherProperties } = account;
    res.json({ accountId, isPassenger, isDriver, carPlate, ...otherProperties });
  }
});

app.listen(3000);
