# TypeScript

We mostly follow the [AirBnb](https://github.com/airbnb/javascript) JavaScript style guide.  I'll be fully writing up everything eventually for our own.  For now, I'll write down some deviations for our source from AirBnb.

## Types
  
- [1.a](types-implicit-any) **Implicit Any**: Do not use an implicit any.  If you are going to use the any type, explicitly declare it as such.
  ```ts
  // bad
  var items: any[] = items();
  items.map(i => console.log(i));

  // good
  var items: any[] = items();
  items.map((i: any) => console.log(i));
  ```

## WhiteSpace
- [2.a](whitespace-braces) **Braces**: Do not put a space between curly braces when using object destructuring, or inline declarations of objects.

    ```ts
    // bad
    import { client } from 'camelot-unchained';

    // good
    import {client} from 'camelot-unchained';
    ```

## Functions
- [3.a](functions-expressions) **Function Expressions** Use an expression for member functions. Use a named function declaration outside of class scope.

    ```ts
    // bad
    class foo {
      public sayHello() { console.log('Hello'); }
    }

    // good
    class foo {
      public sayHello = () => { console.log('Hello'); }
    }

    // bad
    const sayHello = () => console.log('Hello');

    // good
    function sayHello() { console.log('Hello'); }
    ```
