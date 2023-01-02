/* eslint-disable no-undef */
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getStripe } from "../utils/connect/getStripe";
import Link from "next/link";

const Assinaturas = () => {
	const [loading, setLoading] = useState(false);

	const { data: session } = useSession();

	//This handle when a user makes a payment
	const handleCheckout = async (param) => {
		setLoading(true);
		const stripe = await getStripe();
		//this sends a 'link' to the backend and it returns the id that can be used in Stripe Payment to get a payment
		const checkoutSession = await axios.post(
			`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/create-stripe-session/?keyword=${param}&customerid=${session.billingID}`
		);

		const result = await stripe.redirectToCheckout({
			sessionId: checkoutSession.data.id
		});

		if (result.error) {
			alert(result.error.message);
			return;
		}
		setLoading(false);
	};

	return (
		<>
			<div className="p-5 w-75 m-auto">
				<div style={{ height: "900px" }}>
					<div className="row text-center">
						<div className="col-xs-6 col-md-6 h-100">
							<div className="card mb-4 rounded-3 shadow-sm">
								<div className="card-header py-3">
									<h4 className="my-0 fw-normal">Mensal</h4>
								</div>
								<div className="card-body">
									<h1 className="card-title pricing-card-title">
                    R$24<small className="text-muted fw-light">/mês</small>
									</h1>
									<ul className="list-unstyled mt-3 mb-4">
										<li>Correções Ilimitadas</li>
										<li>Suporte mais rápido</li>
										<li>...</li>
										<li>...</li>
									</ul>
									{session ? (
										<>
											{session.hasTrial ? (
												<>
													<Link href="/perfil">
														<button
															disabled={loading ? true : false}
															type="button"
															className="w-100 btn btn-lg btn-primary"
														>
                              Gerenciar Plano ativo
														</button>
													</Link>
												</>
											) : (
												<>
													{" "}
													<button
														disabled={loading ? true : false}
														type="button"
														onClick={() => handleCheckout("mensal")}
														className="w-100 btn btn-lg btn-primary"
													>
                            Mensal
													</button>
												</>
											)}
										</>
									) : (
										<>
											<Link href="/login">
												<button
													disabled={loading ? true : false}
													type="button"
													className="w-100 btn btn-lg btn-primary"
												>
                          Login para comprar
												</button>
											</Link>
										</>
									)}
								</div>
							</div>
						</div>
						<div className="col-xs-6 col-md-6">
							<div className="card mb-4 rounded-3 shadow-sm border-primary">
								<div className="card-header py-3 text-bg-primary border-primary">
									<h4 className="my-0 fw-normal">Trimestral</h4>
								</div>
								<div className="card-body">
									<h1 className="card-title pricing-card-title">
                    R$50<small className="text-muted fw-light">/mês</small>
									</h1>
									<ul className="list-unstyled mt-3 mb-4">
										<li>Correções Ilimitadas</li>
										<li>Suporte mais rápido</li>
										<li>...</li>
										<li>...</li>
									</ul>
									{session ? (
										<>
											{session.hasTrial ? (
												<>
													<Link href="/perfil">
														<button
															disabled={loading ? true : false}
															type="button"
															className="w-100 btn btn-lg btn-primary"
														>
                              Gerenciar Plano ativo
														</button>
													</Link>
												</>
											) : (
												<>
													{" "}
													<button
														disabled={loading ? true : false}
														type="button"
														onClick={() => handleCheckout("trimestral")}
														className="w-100 btn btn-lg btn-primary"
													>
                            Trimestral
													</button>
												</>
											)}
										</>
									) : (
										<>
											<Link href="/login">
												<button
													disabled={loading ? true : false}
													type="button"
													className="w-100 btn btn-lg btn-primary"
												>
                          Login para comprar
												</button>
											</Link>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Assinaturas;
