import React from './zReact';
import ReactDOM from './zReactDOM';
const root = document.getElementById('root');

const jsx = (
  <div id="container" className="ss">
    <h1 id="a">hhh</h1>
    <div id="inner" style={{ border: '1px solid red' }}>
      <p>nihao</p>
      <span>buu</span>
    </div>
  </div>
)
ReactDOM.render(jsx, root);
