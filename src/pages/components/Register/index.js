/* eslint-disable no-undef */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { MutationRegister } from "../../../graphql/mutations/register";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { MutationRegisterBilling } from "../../../graphql/mutations/registerBilling";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { signUpValidate } from "../../../utils/validations";

//Register Page

//Loads the stripe outside the component
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export const Register = () => {
  //Sets the form and field error which appears in the frontend
  const [fieldError, setfieldError] = useState({});
  const [formError, setformError] = useState("");
  const [lengthpassword, setLengthpassword] = useState("");

  //Sets the username, email, password and confirm password
  const [values, setValues] = useState({
    username: { target: "" },
    email: { target: "" },
    password: { target: "" },
    confirm_password: { target: "" }
  });

  //Session of user
  const router = useRouter();

  const { data: session } = useSession();

  //Creates the user in the backend
  const [createUser, { error }] = useMutation(MutationRegister, {
    onError: () => setformError("Usuário ou Email em uso."),
    onCompleted: () => {
      //If all succeeds it makes the sign-in
      !error &&
        signIn("credentials", {
          email: values.email.target.value,
          password: values.password.target.value
        });
    }
  });
  const [createUserBilling] = useMutation(MutationRegisterBilling);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setformError("");

    let customerInfo = {};

    //Checks if the length of the password is < 6
    if (values.password.target.value.length < 6) {
      setLengthpassword(true);
      return;
    }
    setLengthpassword(false);

    //Validates if username, email, password and confirm password is written correctly
    const errors = signUpValidate({
      username: values.username.target.value,
      email: values.email.target.value,
      password: values.password.target.value,
      confirm_password: values.confirm_password.target.value
    });

    //Set the error if has length. In other words, if has length has errors.
    if (Object.keys(errors).length) {
      setfieldError(errors);
      return;
    }

    //Gets the user info that was created before
    try {
      customerInfo = await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/customerstripe/?email=${values.email.target.value}&name=${values.username.target.value}`
      );

      //Creates the user in the backend
      const user = await createUser({
        variables: {
          input: {
            username: values.username.target.value,
            email: values.email.target.value,
            password: values.password.target.value
          }
        }
      });

      //Creates the user billingID in the backend. Why not use the same function to creates the user parameters? The function createUser from GraphQL doesn't support new entries than the default ones
      const userBilling = await createUserBilling({
        variables: {
          id: user.data.register.user.id,
          data: {
            billingID: customerInfo.customer.id
          }
        }
      });
      console.log(customerInfo);
      console.log(userBilling);
    } catch (error) {
      return;
    }
  };

  //Handle the input from the frontend in a single function
  const handleInput = (field, value) => {
    setValues((s) => ({ ...s, [field]: value }));
  };

  useEffect(() => {
    if (session) {
      router.push("/perfil");
    }
  }, [session, router]);

  return (
    <>
      <Elements stripe={stripePromise}>
        <div>
          {!!formError && (
            <div className="alert alert-danger" role="alert">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputName">Nome</label>
              <input
                className="form-control"
                name="username"
                type="text"
                placeholder="Digite seu nome"
                onChange={(v) => handleInput("username", v)}
                required
              />
              <label htmlFor="exampleInputEmail1">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Digite seu email"
                onChange={(v) => handleInput("email", v)}
                required
              />
              <p className="text-danger">{fieldError?.email}</p>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Senha</label>
              <input
                type="password"
                name="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Digite sua senha"
                onChange={(v) => handleInput("password", v)}
                required
              />
              <p className="text-danger">{fieldError?.password}</p>
              {!!lengthpassword && (
                <p className="text-danger" role="alert">
                  senha não pode ser menor do que 6 caracteres
                </p>
              )}
            </div>
            <div className="form-group mt-2">
              <input
                type="password"
                name="confirm_password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Confirme sua senha"
                onChange={(v) => handleInput("confirm_password", v)}
                required
              />
              <p className="text-danger">{fieldError?.confirm_password}</p>
            </div>
            <div className="mt-3">
              <Link href="/login">Já possui uma conta?</Link>
            </div>
            <button type="submit" className="btn btn-primary mt-4">
              Registrar
            </button>
          </form>
        </div>
      </Elements>
    </>
  );
};

export default Register;
