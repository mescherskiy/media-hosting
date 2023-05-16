import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from "./components/main";
import Layout from "./components/root";
import Login from "./components/login";
import Registration from "./components/registration";
import Contacts from "./pages/contacts";
import About from "./pages/about";
import Vault from "./pages/vault/Vault";

const App = () => {

  

  return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="about" element={<About />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Registration />} />
            <Route path="api" element={<Vault />} />
          </Route>
        </Routes>
  );
}

export default App;
