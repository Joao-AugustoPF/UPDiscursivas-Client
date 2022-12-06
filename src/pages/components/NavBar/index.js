/* eslint-disable no-undef */
import Img from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { QueryUser } from "../../../graphql/queries/user";
import Logout from "@mui/icons-material/Logout";
import { MutationRegisterTrial } from "../../../graphql/mutations/registerBilling";
import Logo from "../../../../public/img/logo.png";
import { useRouter } from "next/router";
import { useMutation } from "@apollo/client";
import { GraphQLClient } from "graphql-request";

export default function Nav() {
  //Get the user logged Session
  const { data: session } = useSession();

  const navigate = useRouter();
  const [photo, setPhoto] = useState();

  //Check if the user has clicked on his profile photo and it's with options "My profile" and "Leave" open
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  //---------------------------------------------

  //Check if the user has clicked on the option "My profile" and send it to the profile page
  const handleProfile = () => {
    handleClose();
    navigate.push("/perfil");
  };
  //---------------------------------------------
  const [createRegisterTrial] = useMutation(MutationRegisterTrial);

  useEffect(() => {
    //Check if has active plan
    const isActive = async () => {
      //Check if the Trial is Expired, getting the time from now and the one in the backend.
      const isTrialExpired = session
        ? session.plan != "none" &&
          new Date(session.endDate).getTime() < new Date().getTime()
        : false;

      if (session) {
        if (isTrialExpired) {
          console.log("trial expired");

          //If the trial is expired this function removes the user's permissions
          await createRegisterTrial({
            variables: {
              id: session.id,
              data: {
                hasTrial: false,
                plan: null,
                endDate: null
              }
            }
          });
          //---------------------------------------------
        } else {
          //Just a console log to know if the user has trial information and if the date is correct
          console.log(
            "no trial information",
            session.hasTrial,
            session.plan != "none",
            new Date(session.endDate).getTime() < new Date().getTime()
          );
          //---------------------------------------------
        }
        return;
      }
    };
    const handleImg = async () => {
      const billing = session?.billingID;

      //Why use GraphQLClient instead of Apollo? As we have the protected routes, the apollo query wasn't returning properly. So we had to use graphql-request with the headers
      const graphcms = new GraphQLClient(
        `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
        {
          headers: {
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );
      //---------------------------------------------

      //Gets the user information based on your billingID
      const data = await graphcms.request(QueryUser, { billing });
      //---------------------------------------------

      //Checks if the user already has photo in the backend
      if (
        data?.usersPermissionsUsers?.data[0]?.attributes?.photo?.data
          ?.attributes?.url
      ) {
        //Sets the photo to UseState which is then used in the frontend
        setPhoto(
          `${process.env.NEXT_PUBLIC_API_URL}${data?.usersPermissionsUsers?.data[0]?.attributes?.photo?.data?.attributes?.url}`
        );
        //---------------------------------------------
        return;
      }
    };
    if (session) {
      handleImg();
      isActive();
    }
  }, [session, createRegisterTrial]);
  return (
    <>
      <nav className="navbar bg-light navbar-expand-lg bg-light py-2">
        <div className="container-fluid">
          <Link className="navbar-brand" href="/" passHref>
            <a>
              <Img src={Logo} alt="Bootstrap" width="70" height="70" />
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end"
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <Link className="navbar-brand" href="/" passHref>
                <a>
                  <Img src={Logo} alt="Bootstrap" width="70" height="70" />
                </a>
              </Link>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-white mx-4">
                <li className="nav-item mx-1 mt-2">
                  <Link href="/assinaturas" passHref>
                    <a
                      className="text-decoration-none"
                      style={{
                        fontWeight: "500",
                        color: "#d10d35"
                      }}
                    >
                      Assinar
                    </a>
                  </Link>
                </li>
                <li className="nav-item mx-1 mt-2">
                  <a
                    href="/provas"
                    className="navlink text-decoration-none"
                    style={{
                      fontWeight: "500",
                      color: "#d10d35"
                    }}
                  >
                    Provas
                  </a>
                </li>
                <li className="nav-item mx-1 mt-2">
                  <a
                    href="/questoes"
                    className="navlink text-decoration-none"
                    style={{
                      fontWeight: "500",
                      color: "#d10d35"
                    }}
                  >
                    Questões
                  </a>
                </li>
                <li className="nav-item mx-1 mt-2">
                  <Link className="navlink mx-1" href="/sobre" passHref>
                    <a
                      className="text-decoration-none"
                      style={{
                        fontWeight: "500",
                        color: "#d10d35"
                      }}
                    >
                      Sobre
                    </a>
                  </Link>
                </li>
              </ul>
              {session && (
                <>
                  <Box className="extended-profile">
                    <Tooltip title="Acessar perfil">
                      <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        {photo ? (
                          <Avatar sx={{ width: 32, height: 32 }}>
                            <Img
                              src={photo}
                              alt="imagem de um avatar"
                              layout="fill"
                              width="100%"
                              height="100%"
                            />
                          </Avatar>
                        ) : (
                          <p>P</p>
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={handleProfile}>
                      {photo ? (
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <Img
                            src={photo}
                            alt="imagem de um avatar"
                            width="100%"
                            height="100%"
                          />
                        </Avatar>
                      ) : (
                        <p>P</p>
                      )}
                      Meu perfil
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={signOut}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Sair
                    </MenuItem>
                  </Menu>
                </>
              )}
              {session ? (
                <p className="mt-2 me-5 ms-3 gradient-custom-2">
                  {session.username}
                </p>
              ) : (
                <div className="mt-2">
                  <Link href="/login" passHref>
                    <button className="btn btn-success">Logar</button>
                  </Link>
                  <Link href="/registrar" passHref>
                    <button
                      className="btn btn-success btn me-5 ms-3 gradient-custom-2"
                      style={{
                        BackgroundColor: "#d10d35"
                      }}
                    >
                      Registrar
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
