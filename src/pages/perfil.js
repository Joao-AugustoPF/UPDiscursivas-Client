import Profile from "../pages/components/Perfil/index";
import protectedRoutes from "../utils/protectedRoutes";

export default function Perfil({ sessions }) {
	return (
		<>
			<Profile session={sessions} />
		</>
	);
}

//It set the user session "if logged" to the props of the page
export async function getServerSideProps(context) {
	const session = await protectedRoutes(context);
	if (!session) {
		return { props: {} };
	} else {
		return {
			props: { sessions: session }
		};
	}
}
