
import React from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
toast.configure()

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      name: '',
      description: '',
      quantity: '',
      _id: '0',
      products: []
    }
    this.handleChange = this.handleChange.bind(this);
    this.addProduct = this.addProduct.bind(this);
  }

  //Definir los métodos
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  addProduct(e) {
    e.preventDefault();
    if (this.state._id != 0) {
      fetch(`http://localhost:3000/api/products/${this.state._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: this.state.name,
          description: this.state.description,
          quantity: this.state.quantity
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
        .then(res => res.json())

        .then(data => {
          this.setState({ _id: '0', name: '', salary: '' })
          toast.success("Updated", {
            position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000
          });
          this.refreshProduct();
        });
    }
    else {
      fetch(`http://localhost:3000/api/products`, {
        method: 'POST',
        body: JSON.stringify({
          "name": this.state.name,
          "description": this.state.description,
          "quantity": this.state.quantity
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'

        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ name: '', description: '', quantity: 0 })
          toast.success("Added", {
            position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000
          });
          this.refreshProduct();
        })
        .catch(err => console.log(err))
    }
  }
  deleteProduct(id) {
    if (window.confirm(`Are you sure you want to delete?`)) {
      fetch(`http://localhost:3000/api/products/${id}`, {
        
        credentials: 'same-origin',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ name: '', description: '', quantity: 0 })
          toast.success("Deleted", {
            position: toast.POSITION.BOTTOM_RIGHT, autoClose: 1000

          });
          this.refreshProduct();
        })
    }
  }

  editProduct(id) {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({
          name: data.name,
          description: data.description,
          quantity: data.quantity,
          _id: data.id
        });
      });
  }

  refreshProduct() {
    const apiUrl = 'http://localhost:3000/api/products';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        this.setState({ products: data })
      })
  }
  componentDidMount() {
    this.refreshProduct();
  }
  render() {
    return (
      <div className="container">
        {/* Formulario */}
        <form onSubmit={this.addProduct}>
          <div className="mb-3">
            <label for="name" className="form-label">Name</label>
            <input type="text" name="name" className="form-control" onChange={this.handleChange} value={this.state.name} placeholder="Name" autoFocus />
          </div>
          <div className="mb-3">
            <label for="description" className="form-label">Description</label>
            <input type="text" name="description" className="form-control" onChange={this.handleChange} value={this.state.description} placeholder="Description" />
          </div>
          <div className="mb-3">
            <label for="quantity" className="form-label">Quantity</label>
            <input type="number" name="quantity" className="form-control" onChange={this.handleChange} value={this.state.quantity} placeholder="Quantity" />
          </div>
          <button type="submit" className="btn btn-primary">Save</button>
        </form>
        {/* Fin Formulario */}
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Quantity</th>
              <th>Other actions</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.products.map(product => {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <button onClick={() => this.editProduct(product.id)} className="btn btn-primary" style={{ margin: '4px' }}>
                        <i className="far fa-edit"></i></button>
                      <button onClick={() => this.deleteProduct(product.id)} className="btn btn-danger">
                        <i className="far fa-trash-alt"></i>
                      </button>

                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>

    );
  }
}

export default App;
