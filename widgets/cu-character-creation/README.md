# Character Creation
Camelot Unchained character creation widget.

## Props
| name | type | description |
| ---- | ---- |
| apiKey | string | api key for the logged in user, currently their loginToken provided by the patcher |
| apiHost | string | address of the api host to use, default 'https://api.camelotunchained.com' |
| apiVersion | number | version of the api to use |
| shard | number | shard on which this character should be created |
| created | (created: CharacterCreationModel) => void | callback that accepts the created character's information upon successful creation |

## Usage
```
import CharacterCreation, {CharacterCreationModel} from '../CharacterCreation';

...

characterCreated = (created: CharacterCreationModel) => {
  ...
}

render() {
  return (
    <CharacterCreation apiKey={'ABCDEFG123456789'}
                       apiHost={'https://api.camelotunchained.com'}
                       apiVersion={1}
                       shard={1}
                       created={this.characterCreated} />
  );
}

```


## Dependencies
* animate.css
* react ^0.14.7
* react-addons-css-transition-group ^0.14.7
* isomorphic-fetch ^2.2.1
* normalizr ^2.2.0
* redux ^3.0.5
* redux-thunk ^1.0.3
* es6-promise ^3.1.2
* camelot-unchained ^0.2.19