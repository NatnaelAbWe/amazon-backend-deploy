const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => {
  res.status(200).send("Hello from Amazon Backend");
});

app.post("/payment/create", async (req, res) => {
  const total = Math.round(Number(req.query.total));
  if (!total || total <= 0)
    return res.status(400).json({ message: "Total must be > 0" });

  try {
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    console.log(paymentIntent);
    console.log("PaymentIntent created:", paymentIntent.id);
    res.status(200).send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
