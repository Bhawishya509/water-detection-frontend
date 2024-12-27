import React,{useState} from "react";
import Map from "./components/Map/Map";
import SearchFeatures from "./components/Search/Search";
import { BrowserRouter,Route,Routes } from "react-router";
import LandingPage from "./components/landingpage/LandingPage"
import Footer from "./components/Footer/Footer";
const app = () => {

  return (
    <>

    <BrowserRouter>

    <Routes>
    <Route path="/" element={<LandingPage/>}/>
      <Route path="/search" element={<SearchFeatures  />}/>
      <Route path="*" element={<h1> 404 Error......</h1>}/>
    </Routes>

    
    </BrowserRouter>
 
   
    </>
  );
};

export default app;
