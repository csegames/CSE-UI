# css animations ready for ReactCSSTransitionGroup

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-animate.css.ts
    $ npm install --save animate.css

## Notes

You need to install and require animate.css yourself.

This way you may have a small css build, importing just the animations you need.

Or you can create your own animations, use another library... This is a very small package, you should take a look at source.


## Usage

```tsx
import Animate from 'react-animate.css.ts';

import 'animate.css/animate.css';  // you need to require the css somewhere

<Animate
    animationEnter="bounceIn"
    animationLeave="bounceOut"
    durationEnter={1000}
    durationLeave={1000}
    component="ul" >

  {this.state.items.map(item => <li key={item.id}>{item.name}</li>)}

</Animate>

// use a unique ID, not index
```

