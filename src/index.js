import React from './zReact';
import ReactDOM from './zReactDOM';
const root = document.getElementById('root');
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    }
  }
  onClick() {
    this.setState({ number: this.state.number + 1 })
  }
  render() {
    return (
      <div>
        <span>{`${this.props.name}:${this.state.number}`}</span>
        <button onClick={this.onClick.bind(this)}>加1</button>
      </div>
    )
  }
}
const jsx = (
  <div id="container" className="ss">
    <h1 id="a">hhh</h1>
    <div id="inner" style={{ border: '1px solid red' }}>
      <p>nihao</p>
      <span>buu</span>
    </div>
    <Counter name="计数器" />
  </div>
)
const jsx2 = (
  <div id="container">
    <h1 id="a">hhh2</h1>
    <div id="inner" style={{ border: '1px solid green' }}>
      <p>nihao2</p>
      <span>buu2</span>
    </div>
    <h3>222</h3>
  </div>
)
const jsx3 = (
  <div id="container" className="ss">
    <h1 id="a">hhh3</h1>
    <div id="inner" style={{ border: '1px solid red' }}>
      <span>buu3</span>
    </div>
    <h2>333</h2>
  </div>
)
ReactDOM.render(jsx, root);
const btn2 = document.getElementById('btn2')
const btn3 = document.getElementById('btn3')
btn2.onclick = () => {
  ReactDOM.render(jsx2, root);
}
btn3.onclick = () => {
  ReactDOM.render(jsx3, root);
}