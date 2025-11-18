import React, { useEffect, useState, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";

import { Contacto } from "./pages/contacto";
import { Single } from "./pages/single";

import { RegistroUsuarioView } from "./pages/registroUsuarioView";
import { RegistroParaLocales } from "./pages/registroLocalesView";
import { LoginView } from "./pages/loginView";
import { EditInfo } from "./pages/editinfo";
import { SelSignup } from "./pages/selRegistro";

import { Usuario } from "./pages/usuario";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Chatbot } from "./component/chatbot";
import { Restaurante } from "./pages/restaurante";
import { Restaurantes } from "./pages/restaurantes";
import { Nosotros } from "./pages/sobreNosotros";
import { Context } from "./store/appContext";
import { RutaComida } from "./pages/rutaComida";
import { ExperienciaGastronomica } from "./pages/experienciaGastronomica";
import { MapaOfertas } from "./pages/mapaOfertas";

//create your first component
const Layout = () => {
  //the basename is used when your project is published in a subdirectory and not in the root of the domain
  // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
  const basename = process.env.BASENAME || "";
  const { store, actions } = useContext(Context);

  return (
    <div>
      <BrowserRouter basename={basename}>
        <ScrollToTop>
          <Navbar />
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<LoginView />} path="/login" />

            <Route element={<Usuario />} path="/usuario" />

            <Route element={<Restaurante />} path="/restaurante" />
            <Route element={<EditInfo />} path="/editInfo" />

            <Route element={<Contacto />} path="/contacto" />

            <Route element={<Restaurantes />} path="/restaurantes" />
            <Route element={<ExperienciaGastronomica />} path="/experiencia-gastronomica" />
            <Route element={<MapaOfertas />} path="/mapa-ofertas" />
            <Route element={<Nosotros />} path="/sobre-nosotros" />

            <Route element={<RegistroUsuarioView />} path="/registro-usuario" />
            <Route element={<RegistroParaLocales />} path="/registro-Locales" />
            <Route element={<SelSignup />} path="/seleccion-registro" />

            {/* <Route element={<Restaurantes />} path="/restaurante/:theid" /> */}
            <Route element={<RutaComida />} path="/ruta-comida/:theid" />

            <Route element={<h1>Not found!</h1>} />
          </Routes>
          <Chatbot />
          <Footer />
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default injectContext(Layout);
