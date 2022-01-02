import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Button
} from '@mui/material';
import ListTable from './ListTable';
import {
  ITEMS_SUCCESS,
  ITEMS_FAIL
} from '../../reducers/constants';
import { ItemContext } from '../../contexts/ItemContext';

const AdminMenuList = () => {
  const { allItems, dispatch } = useContext(ItemContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/items");
        dispatch({ type: ITEMS_SUCCESS, payload: data });
      } catch (err) {
        dispatch({ type: ITEMS_FAIL, payload: err.message });
      }
    })();
    
    if (allItems.length > 0) {
      let cats = [];
      allItems.map(item => !cats.includes(item.category) && cats.push(item.category));
      
      setCategories(cats);
    }
  }, [allItems, dispatch]);

  // Get items within the category
  const itemsCategory = (cat) => {
    return allItems.filter(item => item.category === cat);
  };

  return (
    <div id="DashboardView">
      <Container>
        <Typography variant="h1" sx={{ fontSize: "3em", margin: "1em auto" }}>
          Menu Item List
        </Typography>
      <div style={{textAlign: 'center'}}>
        <Button
          color="primary"
          variant="contained"
        >
          Add New Item
        </Button>
      </div>
      <div>
        {categories.map((category, i) => (
          <div key={i}>
            <Typography
              variant="h2"
              sx={{ fontSize: "3em", margin: "1em auto" }}
            >
              {category}
            </Typography>
            <ListTable items={itemsCategory(category)} />
          </div>
        ))}
      </div>
      </Container>
    </div>
  )
}

export default AdminMenuList;