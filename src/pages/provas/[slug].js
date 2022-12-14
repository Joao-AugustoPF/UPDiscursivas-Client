/* eslint-disable no-undef */
/* eslint-disable no-irregular-whitespace */
import { useEffect, useState } from "react";
import { QueryProvas } from "../../graphql/queries/provaSlug";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import useDownloader from "react-use-downloader";
import protectedRoutes from "../../utils/protectedRoutes";
import { initializeApollo } from "../../utils/apollo";

export default function Prova(props) {
	const [final, setFinalScore] = useState();
	const [isActive, setIsActive] = useState(false);

	const provas = props;

	//The downloader of the PDF
	const { download, isInProgress } = useDownloader();

	//Gets the length of the "questions" inside the "Tests"
	const contador = provas?.perguntas?.attributes?.Pergunta?.length;

	//Creates a list with null values ​​with the amount of questions that have in the tests
	const [lista2] = useState(new Array(contador).fill(null));

	//Put in the Array if the value is yes or no in its respective id
	const handleN = (valor, ide) => {
		if (valor.target.value === "sim") {
			lista2[ide] = "sim";
		}

		if (valor.target.value === "nao") {
			lista2[ide] = "nao";
		}
	};

	//The count starts with zero.
	let count = 0;

	const finalScore = () => {
		//Why set this to zero? If the user wants to correct it again, it will have to reset the calculation and redo it
		setFinalScore(0);

		//Set the active to show the comments of the question.
		setIsActive(true);
		try {
			//Check the size of the list and loop with the size of the list and check if the value in the list is equal to "yes" and add it to the count variable
			for (let i = 0; i < lista2.length; i++) {
				if (lista2[i] === "sim") {
					count += 1;
				}
			}

			//To get the value in percentage
			count = (count * 100) / contador;

			//Checks if the count result is not a number
			if (isNaN(count)) {
				return;
			}

			//Sets the final score with the %
			setFinalScore(count.toFixed(2) + "%");

			//Set the count to zero again
			count = 0;
		} catch (error) {
			console.log(error);
		}
	};

	//Just to have more control of the handle answer
	const putAnswer = () => {
		finalScore();
	};

	useEffect(() => {
		// if (!session) router.push("/login");
		// if (session?.hasTrial === false) router.push("/assinaturas");
	}, []);

	return (
		<>
			<div>
				{provas ? (
					<>
						<div className="d-flex justify-content-center p-3">
							<h2 className="">{provas?.perguntas?.attributes?.title}</h2>
						</div>

						{provas?.perguntas?.attributes?.Pergunta ? (
							provas?.perguntas?.attributes?.Pergunta.map((name, index) => {
								return (
									<div className="card w-50 m-auto mb-5" key={index}>
										<div className="card-body">
											<h5 className="card-title">{name.title}</h5>
											<p className="card-text">{name.description}</p>
										</div>
										<div className="p-3">
											<RadioGroup
												row
												aria-labelledby="demo-radio-buttons-group-label"
												name="radio-buttons-group"
												onChange={(value) => handleN(value, index)}
											>
												<FormControlLabel
													value="sim"
													//checked={!!CheckedFalse && null}
													control={
														<Radio
															sx={{
																color: "black",
																"&.Mui-checked": {
																	color: "green"
																}
															}}
														/>
													}
													label="Sim"
												/>

												<FormControlLabel
													value="nao"
													//checked={!!CheckedFalse && null}
													control={
														<Radio
															sx={{
																color: "black",
																"&.Mui-checked": {
																	color: "red"
																}
															}}
														/>
													}
													label="Não"
												/>
											</RadioGroup>
										</div>
										<div
											style={{
												display: `${isActive ? "block" : "none"}`,
												padding: "20px"
											}}
										>
											<h5>Comentário: </h5>
											<p>{name.comentario}</p>
										</div>
									</div>
								);
							})
						) : (
							<div className="mb-4">
								<div
									className="card-body d-flex justify-content-center align-items-center"
									style={{ marginBottom: "650px" }}
								>
									<h5 className="card-title">Não há provas com essa URL</h5>
								</div>
							</div>
						)}

						<div className="d-flex justify-content-center p-2 mb-5">
							<div className="mx-5">
								<button
									onClick={putAnswer}
									type="button"
									className="btn btn-success"
								>
                  Corrigir
								</button>
							</div>
							<div className="mx-5">
								<button
									className="btn btn-info text-white"
									onClick={() =>
										download(
											`${process.env.NEXT_PUBLIC_BACKEND_URL}${provas?.perguntas?.attributes.pdf?.data?.attributes?.url}`,
											`${provas?.perguntas?.attributes?.title}.pdf`
										)
									}
								>
                  Download PDF
								</button>
								<p className="text-danger">
									{isInProgress ? "Download está em progresso" : ""}
								</p>
							</div>

							{final}
						</div>
					</>
				) : (
					<></>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await protectedRoutes(context);
	const apolloClient = initializeApollo(null, session);
	if (!session) {
		return { props: {} };
	} else {
		const slug = context?.params?.slug;
		const { data } = await apolloClient.query({
			query: QueryProvas,
			variables: { slug }
		});
		//console.log(slug);
		const posts = data?.provas?.data;
		const perguntas = posts[0];
		return {
			props: { perguntas: perguntas ? perguntas : null }
		};
	}
}
