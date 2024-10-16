// framework and driver, interface adapter
import express from "express";
import { AccountDAODatabase } from "../resource/AccountDAO";
import { GetAccount } from "../application/GetAccount";
import { Signup } from "../application/Signup";
import { MailerGatewayMemory } from "../resource/MailerGateway";
import { GetRide } from "../application/GetRide";
import { RideDAODatabase } from "../resource/RideDAO";
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

app.get("/rides/:id", async (req, res) => {
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
  const getRide = new GetRide(accountDAO, rideDAO);
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
