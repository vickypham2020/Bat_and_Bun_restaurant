import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  TextField,
  Button
} from "@mui/material";
import { createItem, updateItem } from '../../utils/itemUtils';

const ItemForm = ({ setError, token, item }) => {
  const [fileData, setFileData] = useState();
  const [category, setCategory] = useState(item.category);
  const [title, setTitle] = useState(item.name);
  const [description, setDescription] = useState(item.notes);
  const [price, setPrice] = useState(item.price);
  const [image, setImage] = useState(item.image);
  const [loading, setLoading] = useState(false);
  const [addItemForm, setAddItemForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (item.name === '') {
      setAddItemForm(true);
    } else {
      setAddItemForm(false);
    }
  }, [item]);

  const fileChangeHandler = (e) => {
    setFileData(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);

      // TEST UPLOAD ===============================
      console.log("file data ====>", fileData);
      e.preventDefault();

      const data = new FormData();
      data.append("image", fileData); // image key to use in Postman

      const server = "/upload/setItemImage";

      console.log(`data: ${data}`);

      axios.post(`${server}`, data)
        .then((result) => {
          console.log("File sent successfully", result);
          console.log(`Image URL: ${result.data}`);
          setImage(result.data);

          if(addItemForm) {
            const newItem = {
              name: title,
              notes: description,
              image: result.data,
              category: category,
              price: price,
              deleted: false
            };
    
            createItem(newItem, token);
          } else {
            const updatedItem = {
              ...item,
              name: title,
              notes: description,
              image: image || "/img/items/image-placeholder.jpg",
              category: category,
              price: price
            }
            
            updateItem(updatedItem, token);
          }
    
          setLoading(false);
    
          // navigate("/dashboard/menu");

        })
        .catch((err) => {
          console.log("Something Went Wrong", err);
        });
      
      // ============================================

      // if(addItemForm) {
      //   const newItem = {
      //     name: title,
      //     notes: description,
      //     image: image || "/img/items/image-placeholder.jpg",
      //     category: category,
      //     price: price,
      //     deleted: false
      //   };

      //   createItem(newItem, token);
      // } else {
      //   const updatedItem = {
      //     ...item,
      //     name: title,
      //     notes: description,
      //     image: image || "/img/items/image-placeholder.jpg",
      //     category: category,
      //     price: price
      //   }
        
      //   updateItem(updatedItem, token);
      // }

      // setLoading(false);

      // // navigate("/dashboard/menu");
    } catch (err) {
      setError("Error creating new menu item.");
      console.log(err);
    }
  };
  
  return (
    <div className="item-form">
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <TextField
          variant="standard"
          label="Category"
          name="category"
          fullWidth
          margin="normal"
          value={category}
          required
          onChange={e => setCategory(e.target.value)}
        />
        <TextField
          variant="standard"
          label="Title"
          name="title"
          fullWidth
          margin="normal"
          value={title}
          required
          onChange={e => setTitle(e.target.value)}
        />
        <TextField
          variant="standard"
          label="Description"
          name="description"
          fullWidth
          margin="normal"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <TextField
          variant="standard"
          label="Price"
          name="price"
          fullWidth
          margin="normal"
          value={price}
          required
          onChange={e => setPrice(e.target.value)}
        />
        {/* <TextField
          variant="standard"
          label="Image"
          name="image"
          fullWidth
          margin="normal"
          value={image}
          onChange={e => setImage(e.target.value)}
        /> */}


        
        <input type="file" onChange={fileChangeHandler} />


        <div style={{textAlign: 'center', margin: '2em auto'}}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {addItemForm ? "Add New Item" : "Save Changes"}
          </Button>
        </div>
      </form>

      {image &&
        <img src={image} alt="testing display upload" />
      }
    </div>
  )
}

ItemForm.defaultProps = {
  setError: '',
  token: '',
  item: {
    name: '',
    notes: '',
    image: '',
    category: '',
    price: '',
    deleted: false
  }
};

export default ItemForm;
