/* eslint-disable no-undef */
import Logout from "@mui/icons-material/Logout";
import {
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import { Box } from "@mui/system";
import { GraphQLClient } from "graphql-request";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import * as S from "../../../lib/NavBar/styles";
import { useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Offcanvas from "react-bootstrap/Offcanvas";
import { QueryUser } from "../../../graphql/queries/user";
import { MutationRegisterTrial } from "../../../graphql/mutations/registerBilling";
import Logo from "../../../../public/img/logo.png";
import { useRouter } from "next/router";

export default function ResponsiveExample() {
  const [show, setShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [photo, setPhoto] = useState();

  const open = Boolean(anchorEl);

  const { data: session } = useSession();

  const navigate = useRouter();

  const handleCloseMenu = () => setShow(false);
  const handleClose = () => setAnchorEl(null);
  const handleShow = () => setShow(true);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfile = () => {
    handleClose();
    handleCloseMenu();
    navigate.push("/perfil");
  };

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
          if(!session.endDate){
            return
          }
          //If the trial is expired this function removes the user's permissions

          const graphcms = new GraphQLClient(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
            {
              headers: {
                Authorization: `Bearer ${session?.jwt}`
              }
            }
          );

          
          const userData = await graphcms.request(MutationRegisterTrial, {
            id: session?.id,
            data: {hasTrial: false,
              plan: null,
              endDate: null}
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
      //Why use GraphQLClient instead of Apollo? As we have the protected routes, the apollo query wasn't returning properly. So we had to use graphql-request with the headers
      const graphcms = new GraphQLClient(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
        {
          headers: {
            Authorization: `Bearer ${session?.jwt}`
          }
        }
      );
      //---------------------------------------------
      const billing = session?.billingID;

      //Gets the user information based on your billingID
      const data = await graphcms.request(QueryUser, { billing });
      //---------------------------------------------

      //Checks if the user already has photo in the backend
      if (
        data?.usersPermissionsUsers.data[0]?.attributes?.photo?.data?.attributes
          ?.url
      ) {
        //Sets the photo to UseState which is then used in the frontend
        setPhoto(
          `${data?.usersPermissionsUsers.data[0]?.attributes?.photo?.data?.attributes?.url}`
        );
        //---------------------------------------------
        return;
      }
    };
    if (session) {
      handleImg();
      isActive();
    }
  }, [session]);

  return (
    <>
      <S.ContainerOusite>
        <S.NavMenu>
          <S.MenuImageToggle>
            <a href="/" className="ms-3">
              <Image src={Logo} width="100" height="100" />
            </a>
          </S.MenuImageToggle>
          <S.NavMenuList>
            <ul className="navbar ms-5 list-inline">
              <li className="nav-item mx-1 mt-2">
                <a
                  className="text-decoration-none"
                  style={{
                    fontWeight: "500",
                    color: "#d10d35"
                  }}
                  href="/assinaturas"
                >
                  Assinar
                </a>
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
                <a
                  className="text-decoration-none"
                  style={{
                    fontWeight: "500",
                    color: "#d10d35"
                  }}
                  href="/sobre"
                >
                  Sobre
                </a>
              </li>
            </ul>
          </S.NavMenuList>
        </S.NavMenu>
        <S.LateralMenu>
          <Offcanvas show={show} onHide={handleCloseMenu} responsive="lg">
            <Offcanvas.Header closeButton>
              <a href="/">
                <Image src={Logo} alt="Bootstrap" width="70" height="70" />
              </a>
              <Offcanvas.Title>UP Discursivas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="ms-5">
              <ul className="navbar-nav ms-5">
                <li className="nav-item mx-1 mt-2">
                  <a
                    className="text-decoration-none"
                    style={{
                      fontWeight: "500",
                      color: "#d10d35"
                    }}
                    href="/assinaturas"
                  >
                    Assinar
                  </a>
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
                  <a
                    className="text-decoration-none"
                    style={{
                      fontWeight: "500",
                      color: "#d10d35"
                    }}
                    href="/sobre"
                  >
                    Sobre
                  </a>
                </li>
              </ul>
              {session ? (
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
                            <img
                              src={photo}
                              alt="imagem de um avatar"
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
                          <img
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
                  {session.username}
                </>
              ) : (
                <>
                  <S.ToggleAuthOff>
                    <a href="/login">
                      <button className="btn btn-success me-2">Logar</button>
                    </a>
                    <a href="/registrar">
                      <button className="btn btn-success me-2">
                        Registrar
                      </button>
                    </a>
                  </S.ToggleAuthOff>
                </>
              )}
            </Offcanvas.Body>
          </Offcanvas>
        </S.LateralMenu>

        {session ? (
          <>
            <S.MenuAvatar>
              <Box className="extended-profile mt-1 me-5">
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
                      <>
                        <Avatar sx={{ width: 32, height: 32 }}>
                          <img
                            src={photo}
                            alt="imagem de um avatar"
                            width="100%"
                            height="100%"
                          />
                        </Avatar>
                        <p className="mt-1 ms-3">{session.username}</p>
                      </>
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
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    marginRight: "200px",
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
                      <img
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
            </S.MenuAvatar>
          </>
        ) : (
          <S.AuthToggle>
            <a href="/login">
              <button className="btn btn-success me-2">Logar</button>
            </a>
            <a href="/registrar">
              <button className="btn btn-success me-2">Registrar</button>
            </a>
          </S.AuthToggle>
        )}
        <S.MenuToggle>
          <MenuRoundedIcon
            color="error"
            fontSize="large"
            onClick={handleShow}
          />
        </S.MenuToggle>
      </S.ContainerOusite>
    </>
  );
}
