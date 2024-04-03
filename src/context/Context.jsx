import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Favorites from "../pages/favorites/Favorites";

export const GlobalContext = createContext(null);

export default function GlobalContextProvider({ children }) {
  const [searchParam, setSearchParam] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeList, setRecipeList] = useState([]);
  const [recipeDetailsData, setRecipeDetailsData] = useState(null);
  const [favoritesList, setFavoritesList] = useState([]);
  const [toggle, setToggle ] = useState(true);

  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
      );
      const data = await res.json();
      if (data?.data?.recipes) {
        setRecipeList(data?.data?.recipes);
        setLoading(false);
        setSearchParam("");
        navigate('/')
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSearchParam("");
    }
  }

  function toggleState() {
    setToggle((prevToggle) => !prevToggle);
  }
  function handleAddToFavorite(getCurrentItem) {
    toggleState();
    toggle
      ? toast("Recipe Added to Favorites")
      : toast("Recipe Removed From Favorites");

    console.log(getCurrentItem);
    let copyFavoritesList = [...favoritesList]
    const index = copyFavoritesList.findIndex(item => item.id === getCurrentItem.id)
    if(index === -1){
      copyFavoritesList.push(getCurrentItem)
    }else{
      copyFavoritesList.splice(index)
    }
    setFavoritesList(copyFavoritesList)
  }

  console.log(favoritesList, "favoritesList");
  return (
    <GlobalContext.Provider
      value={{
        searchParam,
        loading,
        recipeList,
        setSearchParam,
        handleSubmit,
        recipeDetailsData,
        setRecipeDetailsData,
        handleAddToFavorite,
        favoritesList
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}
