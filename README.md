### THIS IS EXPERIMENTAL ATM, WHEN IT IS READY FOR OTHERS TO USE I WILL REMOVE THIS LINE

# SOLID DND DIRECTIVE
This is a **feature-complete** implementation of **drag and drop** for [Solid JS](https://www.solidjs.com/) using a custom directive. <br/> 
It supports almost every imaginable drag and drop use-case, any input device and is fully accessible. <br />
It requires very minimal configuration, while offering a rich set of primitives that allow overriding basically any of its default behaviours (using the handler functions). <br /><br />
The reason it is so **feature rich**, **robust** and **production ready** is that under the hood it utilises the most popular drag and drop library for svelte (which actually has no dependency on svelte whatsoever): [svelte-dnd-action](https://github.com/isaacHagoel/svelte-dnd-action) 

![dnd_demo2](https://user-images.githubusercontent.com/20507787/81682367-267eb780-9498-11ea-8dbc-5c9582033522.gif)

### Current Status

While the core of this library is **used in commercial svelte apps in production** and has a very stable API, the thin adapter that makes it Solid friendly is very new and **still experimental**.</br>
It introduces its own, very minimal, implementation of flip animations, which still needs to be tested under fire. <br/>
I will add examples and improvements to this repo. **The greater the interest from the Solid community - the faster I will do it** :smile

### Features

-   Awesome drag and drop with minimal fuss
-   Supports horizontal, vertical or any other type of container (it doesn't care much about the shape)
-   Supports nested dnd-zones (draggable containers with other draggable elements inside, think Trello)
-   Rich animations (can be opted out of)
-   Touch support
-   Define what can be dropped where (dnd-zones optionally have a "type")
-   Scroll dnd-zones and/or the window horizontally or vertically by placing the dragged element next to the edge
-   Supports advanced use-cases such as various flavours of copy-on-drag and custom drag handles (see examples below)
-   Performant and small footprint 
-   Fully accessible (beta) - keyboard support, aria attributes and assistive instructions for screen readers

### Installation

**Pre-requisites**: solid-js ^1.0.0

```bash
yarn add solid-dnd-directive
```

or

```bash
npm install solid-dnd-directive
```

### Usage
```jsx
import { createSignal } from "solid-js";
import {dndzone} from "solid-dnd-directive";
const containerStyle = {border: "1px solid black", padding: "0.3em", "max-width": "200px"};
const itemStyle = {border: "1px solid blue", padding: "0.3em", margin: "0.2em 0"};

function App() {
  const [items, setItems] = createSignal([
    {id: 1, title: "item 1"},
    {id: 2, title: "item 2"},
    {id: 3, title: "item 3"}
  ]);

  function handleDndEvent(e) {
     const {items: newItems} = e.detail;
     setItems(newItems);
  }
  return (
    <main>
         <section style={containerStyle} use:dndzone={{items}} on:consider={handleDndEvent} on:finalize={handleDndEvent}>
            <For each={items()}>{item => <div style={itemStyle}>{item.title}</div>}</For>
        </section>
    </main>
  );
}

export default App;
```
### Examples
- [Most basic (the code snippet above), single zone](https://codesandbox.io/s/dnd-basic-example-exonk?file=/src/App.jsx)
- [Board (Trello like) draggable columns and auto scroll](https://codesandbox.io/s/dnd-board-gs2nd?file=/src/App.jsx)

### Full documentation of the options, and many examples with links coming soon
