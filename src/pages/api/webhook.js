/* eslint-disable no-undef */
import { print } from "graphql";
import gql from "graphql-tag";
const stripe = require("stripe")(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY);
const axios = require("axios");
const { buffer } = require("micro");
export const config = {
  api: {
    bodyParser: false
  }
};

const QURI = gql`
  mutation MutationRegisterPlan($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        id
        attributes {
          username
          hasTrial
          plan
          endDate
        }
      }
    }
  }
`;

async function Webhook(req, res) {
  const endpointSecret = process.env.NEXT_PUBLIC_ENDPOINT_SECRET;

  const sig = req.headers["stripe-signature"];

  const reqBuffer = await buffer(req);
  let event;

  try {
    event = await stripe.webhooks.constructEvent(
      reqBuffer,
      sig,
      endpointSecret
    );
  } catch (err) {
    res.body = `Webhook Error: ${err.message}`;
    return;
  }
  const data = event.data.object;
  const users = await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users`
  );

  let user = "";
  users.data.map((value) => {
    if (value.billingID === data.customer) {
      user = value;
    }
  });

  console.log(event.type);

  let typeSubscription = "";
  switch (event.type) {
    case "payment_intent.succeeded":
      // console.log(user);
      console.log("Payment Intent Succeeded -> " + JSON.stringify(data));
      break;
    //   // ... handle other event types
    case "customer.created":
      console.log(JSON.stringify(data));
      break;
    case "invoice.paid": {
      if (data.status === "paid") {
        if (
          data.lines.data[0].plan.id === process.env.NEXT_PUBLIC_PLAN_STRIPE
        ) {
          typeSubscription = "mensal";
        }
        if (
          data.lines.data[0].plan.id === process.env.NEXT_PUBLIC_PRICE_STRIPE
        ) {
          typeSubscription = "trimestral";
        }
        const usuario = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
          {
            query: print(QURI),
            variables: {
              id: user.id,
              data: {
                hasTrial: true,
                plan: typeSubscription,
                endDate: new Date(data.period_start * 1000)
              }
            }
          }
        );
        console.log(usuario);
      }
      console.log(usuario);
      break;
    }
    case "customer.subscription.created":
      console.log("Customer subscription created -> " + JSON.stringify(data));
      break;

    case "customer.subscription.updated": {
      // started trial
      let subscrpitionType = "";
      if (data.plan.id === process.env.NEXT_PUBLIC_PLAN_STRIPE) {
        subscrpitionType = "mensal";
        return;
      }

      if (data.plan.id === process.env.NEXT_PUBLIC_PRICE_STRIPE) {
        subscrpitionType = "trimestral";
      }

      const usuario = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        {
          query: print(QURI),
          variables: {
            id: user.id,
            data: {
              hasTrial: true,
              plan: subscrpitionType,
              endDate: new Date(data.current_period_end * 1000)
            }
          }
        }
      );
      console.log(usuario);

      const isOnTrial = data.status === "trialing";

      if (isOnTrial) {
        const usuario = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
          {
            query: print(QURI),
            variables: {
              id: user.id,
              data: {
                hasTrial: true,
                plan: subscrpitionType,
                endDate: new Date(data.current_period_end * 1000)
              }
            }
          }
        );
        console.log(usuario);
      } else if (data.status === "active") {
        const usuario = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
          {
            query: print(QURI),
            variables: {
              id: user.id,
              data: {
                hasTrial: true,
                endDate: new Date(data.current_period_end * 1000)
              }
            }
          }
        );
        console.log(usuario);
      }

      if (data.canceled_at) {
        // cancelled
        console.log(
          "You just canceled the subscription -> " + data.canceled_at
        );
        const usuario = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
          {
            query: print(QURI),
            variables: {
              id: user.id,
              data: {
                hasTrial: false,
                plan: "none",
                endDate: null
              }
            }
          }
        );
        console.log(usuario);
      }
      // console.log("actual", user.hasTrial, data.current_period_end, user.plan);

      console.log("customer changed", JSON.stringify(data));
      break;
    }

    // case "customer.updated": {
    //   console.log("Customer Updated" + JSON.stringify(data));
    //   break;
    // }
    // case "checkout.session.async_payment_succeeded": {
    //   console.log(
    //     "Checkout Session Async Payment Succeeded -> " + JSON.stringify(data)
    //   );
    //   break;
    // }
    // case "invoice.updated": {
    //   console.log("Invoice Updated -> " + JSON.stringify(data));
    //   break;
    // }

    // case "payment_method.detached": {
    //   console.log("PAYMENT METHOD DETACHED -> " + JSON.stringify(data));
    //   break;
    // }

    // case "checkout.session.completed": {
    //   console.log("Checkout Session Completed -> " + JSON.stringify(data));
    //   break;
    // }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  //ctx.send();
  res.send();
}

export default Webhook;
