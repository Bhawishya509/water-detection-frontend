import React,{useState} from "react";
import Map from "./components/Map/Map";
import SearchFeatures from "./components/Search/Search";
import { BrowserRouter,Route,Routes } from "react-router";
import Footer from "./components/Footer/Footer";
const app = () => {

  return (
    <>

    <BrowserRouter>

    <Routes>

      <Route path="/" element={<SearchFeatures  />}/>
    </Routes>

    <Footer/>
    </BrowserRouter>
 
   
    </>
  );
};

export default app;
