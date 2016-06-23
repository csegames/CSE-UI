# Animate
Animate any items added or removed from this container using Animate.css animations.

## Props
| name | type | description |
| ---- | ---- | ---- |
| className | string | class name to handle the animations
| animationEnter | string | animate.css animation name to play when an item is added to this container |
| animationLeave | string | animate.css animation name to play when an item is removed from this container |
| durationEnter | number | duration of the animation specified by 'animationEnter' |
| durationLeave | number | duration of the animation specified by 'animationLeave' |

## Usage
```
import Animate from '../Animate';

...

generateViewItem = () => { ... }

render() {
  return (
    <Animate className='animate' animationEnter='fadeIn' animationLeave='fadeOut'
          durationEnter={400} durationLeave={500}>
          {generateViewItem()}
    </Animate>
  );
}

```


## Dependencies
* animate.css
* react 14+
* react-addons-css-transition-group 14+