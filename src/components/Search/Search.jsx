import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import SearchCss from "./Search.module.css"  // for custom css styles
import axios from "axios"
import { FcGoogle } from "react-icons/fc";  // google icon for login and sign up
import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';
import Map from "../Map/Map";
import { useDispatch } from 'react-redux'  // redux
import { loction_taking_rudux,city_name_set} from '../../store_redux/Rudux_data'


import Loading from "../Loading/Loading";
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0,2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function SearchFeatures() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
 
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
const [data_from_user,Set_data_from_user]=React.useState("Dehri");

const [loading,setloding]=React.useState(false);

  
  
   const dispatch = useDispatch()  // for calling function from redux and send data to him


  const Data_processing_from_user = (e) => {
    const { value } = e.target;
    let val=value[0].toUpperCase()+value.substring(1,value.length).trim();
    Set_data_from_user(val);
     
   
  };

// this is use to show  data to the user from the goggle login

  const gettingData=(data_get_from_google)=>
  {
    console.log(data_get_from_google)

  }

  // this  will br run whenb ever i will an errror from google login

  const gettingError=(data_get_from_google)=>
    {
      console.log(data_get_from_google)
  
    }
  

// this is use to when ever the user type city name and enter then they search city near water


  const all_water_place_find=async(cityName=data_from_user,maxDistanceKm=20)=>
  {
    async function getCityCoordinates(cityName) {
      const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&format=json&limit=1`;
  
      try {
        const response = await fetch(url);
        const data = await response.json();
  
        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
          };
        }

        alert("City not found......")  // if city not found then
      } catch (error) {
        alert("Something Wrong")  // if api errror
        console.error("Error fetching city coordinates:");
       
      

      }

      
    }
  
    // Haversine formula to calculate distance between two coordinates
    function haversine(lat1, lon1, lat2, lon2) {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371; // Radius of Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    }
  
    // Get city coordinates
    const cityCoordinates = await getCityCoordinates(cityName);
    if (!cityCoordinates) {
      return [];
    }
  //rr
    const query = `
      [out:json];
      area[name="${cityName}"]->.searchArea;
      (
        way["waterway"](area.searchArea);
        way["natural"="water"](area.searchArea);
        node["natural"="water"](area.searchArea);
      );
      out body;
      >;
      out skel qt;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // Create a dictionary of nodes by their ID
      const nodes = {};
      data.elements.forEach((element) => {
        if (element.type === "node") {
          nodes[element.id] = {
            lat: element.lat,
            lon: element.lon,
          };
        }
      });
  
      // Process water bodies
      const waterBodies = data.elements
        .filter((element) => element.type === "way" || element.type === "node")
        .map((element) => {
          if (element.type === "node") {
            // Node: directly use lat/lon
            const distance = haversine(cityCoordinates.lat, cityCoordinates.lon, element.lat, element.lon);
            if (distance <= maxDistanceKm) {
              return {
                id: element.id,
                name: element.tags?.name || "Unnamed",
                type: element.tags?.natural || element.tags?.waterway,
                distance, // Include distance for reference
                coordinates: [{ lat: element.lat, lon: element.lon }],
              };
            }
            return null;
          }
  
          if (element.type === "way") {
            // Way: resolve nodes to lat/lon
            const coordinates = element.nodes
              .map((nodeId) => nodes[nodeId]) // Map node IDs to lat/lon
              .filter(Boolean); // Remove undefined nodes
  
            // Calculate average position of the way's nodes to determine distance
            const avgLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
            const avgLon = coordinates.reduce((sum, coord) => sum + coord.lon, 0) / coordinates.length;
            const distance = haversine(cityCoordinates.lat, cityCoordinates.lon, avgLat, avgLon);
  
            if (distance <= maxDistanceKm) {
              return {
                id: element.id,
                name: element.tags?.name || "Unnamed",
                type: element.tags?.natural || element.tags?.waterway,
                distance, // Include distance for reference
                coordinates,
              };
            }
            return null;
          }
  
          return null;
        })
        .filter(Boolean); // Remove null entries
  
     
      return waterBodies;
    } catch (error) {
      console.error("Error fetching water bodies:", error);
      return [];
    }
  }














// searching city name and i am calling from city functionn to get water function 


  const Data_Searching = async(e) =>
  {
    if (e.key == "Enter") {



      // this is modify the data like remove space and change into upper case
     
     
   


      
      try {
        
    
      setloding(true)
      let resp = await axios.get(`https://nominatim.openstreetmap.org/search?q=${data_from_user}&format=json&limit=1`)
      let city_water_data = await all_water_place_find();  // callng function they  give water near data
      

      console.log(resp)
      let city_loction_lat_And_lon_array = [] // empty array because i will send city loction and near city water loction
     
      let city_name_with_near_water_Data = [];  // city name with near water



      // add city loctions  1 data from search by users

      city_loction_lat_And_lon_array.push({lat:Number(resp.data[0].lat),lon: Number(resp.data[0].lon)})  // this is use for city loction
     
      //  add city name  1 data search by user city  name
      city_name_with_near_water_Data.push(resp.data[0].display_name)



      let show_only_few_data_from_data = [];  // store water data
        
      

      // this use for if the near water data match then it will run
      if(city_water_data.length>0)
      {

      for (let i = 0; i < 20; i++) // this is the limt of dta thats you are going to use
      {
      show_only_few_data_from_data .push(city_water_data[i]) 
      }
     
    
      
      
      // console.log(show_only_few_data_from_data)
      for (let i of show_only_few_data_from_data)
      {
        // ab[10] data show karna ha 
      
        let all_near_city_name = i.name;

      
          
        
        let demo = i.coordinates[0];
    

        
         
        
      
        
          
        city_loction_lat_And_lon_array.push(demo);  // push city loction lat and lon
        city_name_with_near_water_Data.push(all_near_city_name);



      // ab[0].name 
      // let c=ab[0].coordinates
      // c[0].lat
      // c[1].lon

      setloding(false)
      }
      }
  
      

      console.log(city_loction_lat_And_lon_array)
      console.log(city_name_with_near_water_Data)




      // loction data send to set for sendig to  rudux

    
      dispatch(loction_taking_rudux(city_loction_lat_And_lon_array))  // sending loction



      // all near place name set to send to redux

      let city_data = {
     loc_name:city_name_with_near_water_Data
      }


      dispatch(city_name_set(city_data)) // seinding name
      console.log(resp)
      
    }
    catch(err)
    {
      
    
      Set_data_from_user("Dehri")
      setloding(false)
    }

  }



    

  }



  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      >
          
          <MenuItem>
              
          <IconButton size="large"   >
          <GoogleOAuthProvider clientId="AIzaSyCY8VHdihLjE1oyxtOsz03nt2zfY-H9erI" >

          <GoogleLogin
  onSuccess={gettingData}
  onError={gettingError}
  
/>;
hii
       </GoogleOAuthProvider>
              </IconButton>
              <p>Login</p>
          </MenuItem>


          <MenuItem>
             
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div>
    <Box sx={{ flexGrow: 1 }} >
      <AppBar position="static" className={SearchCss.search_main_box}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
         <img height={"30px"} style={{borderRadius:"50%",marginTop:"8px"}} width={"32px"} src="https://imgs.search.brave.com/AvFV-u-a2nry4_Uj-7hWT3bAfqK1VBv_fH2aUXYgw20/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bmFzYS5nb3Yvd3At/Y29udGVudC91cGxv/YWRzLzIwMjQvMTEv/MS1waWEyNjQxNy1l/bWl0LWFjcXVhdGlj/LnBuZz93PTEwMjQ"/>
          </Typography>
          <Search className={SearchCss.input_main_box}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
                      <StyledInputBase
                        className={SearchCss.search_input_box}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={data_from_user}
              onChange={Data_processing_from_user}
              onKeyDown={Data_Searching}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ display: { xs: "none", md: "flex" } }}>
                      
                      <IconButton>
                      <FcGoogle />
                      </IconButton>
            <IconButton
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
                      >
                          
                          
                          <Badge badgeContent={4} color="error">
                              
                <MailIcon />
                          </Badge>
                          
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>

    {loading?<Loading/>: <Map/>}
    </div>
  );
}

export default SearchFeatures;