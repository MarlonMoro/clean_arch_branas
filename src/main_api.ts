// framework and driver, interface adapter
import express from "express";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { GetAccount } from "./application/usecase/GetAccount";
import { Signup } from "./application/usecase/Signup";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { GetRide } from "./application/usecase/GetRide";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
try {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const output = await signup.execute(req.body);
  res.json(output);
} catch (error: any) {
  res.status(422).json({
    message: error.message
  });
}
});

app.get("/accounts/:id", async function (req, res) {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const getAccount = new GetAccount(accountRepository);
  const account = await getAccount.execute(req.params.id);
  if(!account) {
    res.sendStatus(404)
  } else {
    const { id, isPassenger, isDriver, carPlate, ...otherProperties } = account;
    res.json({ accountId: id, isPassenger, isDriver, carPlate, ...otherProperties });
  }
});

app.get("/rides/:id", async (req, res) => {
  const connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideDAO = new RideRepositoryDatabase();
  const getRide = new GetRide(accountRepository, rideDAO);
  try {
    const ride = await getRide.execute({ rideId: req.params.id });
    res.json(ride);
  } catch (error: any) {
    if(error.message == 'Ride not found') {
      return res.sendStatus(404);
    } 
    res.status(500).json({
      message: error.message
    });
  }
});

app.listen(3000);
