import 'bulma/css/bulma.css';
import * as React from 'react';
import * as CategoryService from '../service/CategoryService';

class Home extends React.Component {
  public state = {
    categories: []
  }

  public async componentDidMount() {
    const categories = await CategoryService.getAllCategories();

    this.setState({
      categories
    })
  }

  public renderCategory(): JSX.Element[] {
    const toReturn: JSX.Element[] = [];
    let tCategories: JSX.Element[] = [];
    let index: number = 0;

    if(this.state.categories.length === 0) {
      return toReturn;
    }

    for(const cat of this.state.categories) {
      if(index % 2 === 0 && index > 0) {
        toReturn.push(<div className="columns is-mobile">{ tCategories }</div>)
        tCategories = [];
      }

      tCategories.push(cat);
      index++
    }
    return toReturn;
  }

  public render() {
    return (
      <div className='container is-fluid'>
        <p style={{textAlign: 'center'}}>Add Transaction</p>
        <p style={{textAlign: 'center'}}>Category</p>
        <div className='container has-text-centered'>
          { this.renderCategory() }
          <div className='columns'>
            <div className='column'>
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" type="text" placeholder="Amount"/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <input className="input is-rounded" type="date"/>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <textarea className="textarea" placeholder="Note"/>
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    );
  }
}

export default Home;