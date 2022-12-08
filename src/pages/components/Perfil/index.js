/* eslint-disable no-undef */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@apollo/client";
import { MutationSetPhoto } from "../../../graphql/mutations/user";
import { QueryUser } from "../../../graphql/queries/user";
import { GraphQLClient } from "graphql-request";
import Link from "next/link";

export default function Perfil({ session }) {
  const router = useRouter();

  const [setUserPhoto] = useMutation(MutationSetPhoto);
  const [files, setFiles] = useState();
  const [photo, setPhoto] = useState();
  const [dataUser, setDataUser] = useState();

  const uploadImage = async (e) => {
    e.preventDefault();

    //Creates a form data to set the photo to backend.
    const formData = new FormData();
    formData.append("files", files[0]);

    const idPhoto =
      dataUser?.usersPermissionsUsers.data[0]?.attributes?.photo?.data?.id;

    //Checks if the user already has a photo in the backend and updates it.
    if (idPhoto) {
      axios
        .post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload?id=${idPhoto}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.jwt}`
            }
          }
        )
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
      return;
    }
    //-----------------------------------

    //Creates a photo in the backend if the user hasn't photo yet.
    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload/`, formData, {
        headers: {
          Authorization: `Bearer ${session?.jwt}`
        }
      })
      .then(async (response) => {
        await setUserPhoto({
          variables: {
            id: session.id,
            data: {
              photo: `${response.data[0].id}`
            }
          }
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
    //-----------------------------------
  };

  useEffect(() => {
    if (!session) router.push("/login");

    const handleImg = async () => {
      //Why use GraphQLClient instead of Apollo? As we have the protected routes, the apollo query wasn't returning properly. So we had to use graphql-request with the headers
      const graphcms = new GraphQLClient(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        {
          headers: {
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );
      const billing = session?.billingID;

      //Gets the user information based on your billingID
      const data = await graphcms.request(QueryUser, { billing });

      //Sets the user data which is used to check if the user already has photo
      setDataUser(data);

      //Checks if the user already has photo in the backend
      if (
        data?.usersPermissionsUsers.data[0]?.attributes?.photo?.data?.attributes
          ?.url
      ) {
        //Sets the photo to UseState which is then used in the frontend
        setPhoto(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}${data?.usersPermissionsUsers.data[0]?.attributes?.photo?.data?.attributes?.url}`
        );
        return;
        //-----------------------------------
      }
    };
    handleImg();
  }, [session, router]);

  return (
    <div className="h-100 w-100">
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7">
            <div className="card p-3 py-4">
              {session && (
                <>
                  <div className="text-center">
                    <img
                      src={photo}
                      width="100"
                      height="100"
                      className="rounded-circle"
                    />
                  </div>
                  <div className="w-75 m-auto">
                    <form onSubmit={uploadImage}>
                      <div className="input-group mb-3 mt-3">
                        <div className="custom-file m-auto">
                          <input
                            type="file"
                            className="input-group-text w-50 m-auto"
                            onChange={(e) => setFiles(e.target.files)}
                            id="inputGroupFile01"
                          />
                          <input
                            type="submit"
                            value="Enviar"
                            className="input-group-text m-auto mt-3"
                          />
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="text-center mt-3">
                    <h5 className="mt-2 mb-0">
                      {/* {loading && <p>Loading...</p>} */}
                      {session.username}
                    </h5>
                    <span>
                      {/* {loading && <p>Loading...</p>} */}
                      {session.user.email}
                    </span>

                    <div>
                      <Link href="https://billing.stripe.com/p/login/test_8wM2bF9SCbF93fycMM">
                        <button
                          // disabled={loading ? true : false}
                          type="button"
                          className="w-50 btn btn-lg btn-primary"
                        >
                          Gerenciar Plano
                        </button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
