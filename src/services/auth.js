/* eslint-disable no-undef */
const strapiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

import axios from "axios";

//Makes the sign-in
export async function signIn({ email, password }) {
	const res = await axios.post(`${strapiUrl}/api/auth/local`, {
		identifier: email,
		password
	});
	return res.data;
}
