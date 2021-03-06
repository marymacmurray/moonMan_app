import React, { Component } from "react";
import { getItems } from "../services/items";
import { getItemById } from "../services/items";
import { getUserById } from "../services/auth.js"; //getUser
import { updateUsersItems } from "../services/auth.js"; //update user's items
import { removeWishlistItem } from "../services/auth.js";
import Routes from "../routes";
import Header from "../screens/Header";
import { verifyUser } from '../services/auth'
import Footer from "./shared/Footer";

export default class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      items: [],
      wishlist: []
    };
  }

  async componentDidMount() {
    try {
      const items = await getItems();
      this.setState({ items });
      const user = await verifyUser();
      if (user) {
        this.setState({ user })
      }
    }
    catch (err) {
      console.error(err);
    }
  }


  addItem = item =>
    this.setState({
      items: [item, ...this.state.items]
    });


  editItem = (itemId, item) => {
    const updateIndex = this.state.items.findIndex(
      element => element._id === itemId
    ),
      items = [...this.state.items];
    items[updateIndex] = item;
    this.setState({
      items
    });
  };

  addItemToWishlist = async (item) => {
    console.log(item)
    try {
      const usersItems = this.state.user.items
      usersItems.push(item)
      this.setState(prevState => ({
        user: { ...prevState.user, items: usersItems }
      }))
      const response = await updateUsersItems(this.state.user._id, this.state.user)
      //this is where we add wishlist items to state each time.
      const selectedItem = this.state.items.find(el =>
        el._id === item
      )
      this.setState(prevState => ({
        wishlist: [...prevState.wishlist, selectedItem]
      }))
    } catch (err) {
      console.error(err);
    }
  }


  deleteItemFromWishlist = async (itemId) => {
    const response = await removeWishlistItem(this.state.user._id, itemId)
    console.log(response)

    this.setState({
      user: response,
      wishlist: response.items
    })

    // console.log(wishlist)
    // console.log('clicking delete from wishlist button')
    // const removeIndex = this.state.wishlist.findIndex(
    //   element => element.id === itemId
    // ),
    // wishlist = [...this.state.wishlist];
    // if(removeIndex > -1) {
    //   wishlist.splice(removeIndex, 1);
    //   this.setState({
    //     wishlist
    //   })
    // }
    // console.log(wishlist)
  }


  editItem = (itemId, item) => {
    const updateIndex = this.state.items.findIndex(
      element => element._id === itemId
    ),
      items = [...this.state.items];
    items[updateIndex] = item;
    this.setState({
      items
    });
  };

  destroyItem = item => {
    const destroyIndex = this.state.items.findIndex(
      element => element._id === item._id
    ),
      items = [...this.state.items];
    if (destroyIndex > -1) {
      items.splice(destroyIndex, 1);
      this.setState({
        items
      });
    }
  };

  setUser = user => this.setState({ user });

  //verifyUser = user => (localStorage.getItem('token')) ? this.setState({ user, isLoggedIn: true }) : null

  clearUser = () => this.setState({ user: null });

  render() {
    const { user, items } = this.state;
    return (
      <div className="container-landing">
        <Header user={user} />
        <main className="container">
          <Routes
            addItemToWishlist={this.addItemToWishlist}
            items={items}
            user={user}
            setUser={this.setUser}
            addItem={this.addItem}
            editItem={this.editItem}
            destroyItem={this.destroyItem}
            clearUser={this.clearUser}
            wishlist={this.state.wishlist}
            deleteItemFromWishlist={this.deleteItemFromWishlist}
            theme={this.props.theme}
            setTheme={this.props.setTheme}
          />
          <button className="dark-mode"
            onClick={e =>
              this.props.setTheme(
                this.props.theme.mode === 'dark'
                  ? { mode: 'light' }
                  : { mode: 'dark' }
              )
            }
          >Dark Mode</button>
        </main>
      </div>
    );
  }
}
