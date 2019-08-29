# GameClientModels
This directory contains definitions for models that are provided by reference from the game client via update events.

## The 'update' event
The coherent engine will update these models via an update event that is named '\<modelname\>.update' where \<modelname\> is replaced with a camelCase name of the model interface. A reference to the model object will be passed in with every call to the update event by the game engine. 

This reference is typically saved to the global `game` object so that it may be globally accessed by reference throughout the UI for singleton type objects.

example: 

```typescript
engine.on('model.update', (model: Model) => {
  // model is a reference to an object defined in c++ on the client.

  // You can call methods on the object that the client added, these call directly
  // into the c++ client synchronously. JS processing will pause until the method 
  // returns from the game client.
  model.clientMethod();

  // You can set values to properties that are provided by the client and the
  // change will be reflected within the game client. *Provided that the property
  // is not readonly*
  model.count = model.count + 1;

  // You can add your own properties to this object reference, these will not be 
  // reflected in the game client.
  model.foo = 'bar';

});
```

## Model Definition file structure

The file structure for defining a Game Client Model in this library is as follows:

1. \<MPL 2.0 license header\>

2. \<imports\>

3. An interface definition which describes the model as received from the game client that is a Pascal case named & appended with 'Model'.

```typescript
export interface <ModelName>Model {
  valueOne: string;
  methodProperty: () => string;
}
```

4. A globally defined type definition / interface to describe the structure of this Model as represented to the UI. This contains the Model from the client plus any additional properties as required by the game client. *Note: All Singleton models will extend the Updatable interface*

```typescript
declare global {
  type <ModelName> = <ModelName>Model & Updatable;
}
```

5. The update event name string;

```typescript
export const <ModelName>_Update = '\<modelName\>.update';
```

6. Default initialization method. This method will be used to initialize a default version of this model when one has not yet been provided by the client.

```typescript
function initDefault(): <ModelName> {
  return {
    valueOne: '',
    methodProperty: (...args: any[]) => '',
  };
}
```

7. Lastly, this definition file exports a default method which is used to initialize the model with the game engine. Use this method to run any code that needs to be run at UI start up.

```typescript
export default function() {
  engineInit(
    <ModelName>_Update,
    () => _devGame.<modelName> = initDefault(),
    () => game.<modelName>,
    (model: <ModelName>Model) => _devGame.<modelName> = model as <ModelName>);
}
```
