import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import PostStatusFilter from '../post-status-filter';
import PostList from '../post-list';
import PostAddForm from '../post-add-form';

import './app.css';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          label: 'Hello! You can write posts here~',
          important: true,
          liked: false,
          id: 1
        }, 
        {
          label: 'You also can delete, like and add them to favorites!',
          important: false,
          liked: false,
          id: 2
        }, 
        {
          label: '(to like a post tap its text)',
          important: false,
          liked: false,
          id: 3
        }
      ],
      term: '',
      filter: 'all'
    };

    this.deleteItem = this.deleteItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.onToggleImportant = this.onToggleImportant.bind(this);
    this.onToggleLiked = this.onToggleLiked.bind(this);
    this.onUpdateSearch = this.onUpdateSearch.bind(this);
    this.onFilterSelect = this.onFilterSelect.bind(this);
    
    this.maxId = 4;
  }

  deleteItem(id) {
    this.setState(({ data }) => {
      const index = data.findIndex(elem => elem.id === id);

      const before = data.slice(0, index);
      const after = data.slice(index + 1);

      const newArr = [ ...before, ...after ];
      return { data: newArr };
    });
  }

  addItem(body) {
    const newItem = {
      label: body,
      important: false,
      id: this.maxId++
    };

    this.setState(({ data }) => {
      const newArr = [ ...data, newItem ];
      return {
        data: newArr
      };
    });
  }

  toggleBooleanPropInDataItem(id, propName) {
    this.setState(({ data }) => {
      const index = data.findIndex(elem => elem.id === id);

      const old = data[index];
      const newItem = { ...old };
      newItem[propName] = !newItem[propName];

      const newArr = [ 
        ...data.slice(0, index), 
        newItem, 
        ...data.slice(index + 1)
      ];

      return {
        data: newArr
      };
    });
  }

  onToggleImportant(id) {
    this.toggleBooleanPropInDataItem(id, 'important');
  }

  onToggleLiked(id) {
    this.toggleBooleanPropInDataItem(id, 'liked');
  }

  searchPost(items, term) {
    if (term.length === 0) {
      return items;
    }

    return items.filter(item => item.label.indexOf(term) > -1);
  }

  filterPost(items, filter) {
    if (filter === 'like') {
      return items.filter(item => item.liked);
    } else {
      return items;
    }
  }

  onUpdateSearch(term) {
    this.setState({ term });
  }

  onFilterSelect(filter) {
    this.setState({ filter });
  }

  render() {
    const { data, term, filter } = this.state;

    const liked = data.filter(item => item.liked).length;
    const allPosts = data.length;

    const visiblePosts = this.filterPost(this.searchPost(data, term), filter);

    return (
      <div className="app">
        <AppHeader
          liked={ liked }
          allPosts={ allPosts } />
        <div className="search-panel d-flex">
          <SearchPanel
            onUpdateSearch={ this.onUpdateSearch } />
          <PostStatusFilter
            filter={ filter }
            onFilterSelect={ this.onFilterSelect } />
        </div>
        <PostList 
          posts={ visiblePosts }
          onDelete={ this.deleteItem }
          onToggleImportant={ this.onToggleImportant }
          onToggleLiked={ this.onToggleLiked } />
        <PostAddForm
          onAdd={ this.addItem } />
      </div>
    );
  }
}
