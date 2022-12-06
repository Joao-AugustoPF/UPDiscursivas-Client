import { getSession } from "next-auth/react";

export const takeuser = async (req, res) => {
  //const session = await unstable_getServerSession(req, res, authOptions);
  const token = await getSession({ req: req });
  if (token) {
    // Signed in
    console.log(req);
    res.send({ token: token });
  } else {
    // Not Signed in
    console.log(token);
    res.json({ message: "not logged" });
  }
  //res.json({ session: session });
};

export default takeuser;
