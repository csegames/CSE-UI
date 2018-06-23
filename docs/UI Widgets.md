# TabbedDialog

The `TabbedDialog` UI component provides access to basic dialog and tabbed dialog functionality, without having to write any code.

### Basic `TabbedDialog` Without Tabs

```jsx
<TabbedDialog title='basic' onClose={onClose}>
  {() => <DialogTab>Hello World</DialogTab>}
</TabbedDialog>
```
> `TabbedDialog` is a function as child component. `renderContent` is called to provide the content to render.
`onClose` is called when the X (close) icon is clicked.

`DialogTab` should be wrapped around your dialog content, even if you are not using tabs.

### `TabbedDialog` with Tabs
```jsx
const TAB1: DialogButton = { label: 'Tab 1' };
const TAB2: DialogButton = { label: 'Tab 2' };
<TabbedDialog title='tabs' tabs={[ TAB1, TAB2 ]} onClose={onClose}>
	{tab => {
      switch (tab) {
      case TAB1: return <DialogTab>Tab 1 Content</DialogTab>;
      case TAB2: return <DialogTab>Tab 2 Content</DialogTab>;
      }
    }}
</TabbedDialog>
```
# SideMenu

`SideMenu` UI component provides provides basic side menu option navigation with menu options on the left, and content on the right.

### Basic `SideMenu`

```jsx
const OPT1: DialogButton = { label: 'Opt 1' };
const OPT2: DialogButton = { label: 'Opt 2' };
<SideMenu options={[OPT1, OPT2]}>
  {(opt) => {
  	switch (opt) {
  	case OPT1: return <div>Content for option 1</div>;
  	case OPT2: return <div>Content for option 2</div>;
  	}
  }
</SideMenu>
```

### Combining TabbedDialog and SideMenu

```jsx
const TAB1: DialogButton = { label: 'Tab 1' };
const TAB2: DialogButton = { label: 'Tab 2' };
const OPT1: DialogButton = { label: 'Opt 1' };
const OPT2: DialogButton = { label: 'Opt 2' };
const OPT3: DialogButton = { label: 'Opt 3' };
const OPT4: DialogButton = { label: 'Opt 4' };
<TabbedDialog title='tabs' tabs={[ TAB1, TAB2 ]} onClose={onClose}>
	{tab => {
      switch (tab) {
      case TAB1: return (
	      <DialogTab>
	        <SideMenu options={[OPT1, OPT2]}>
			  {(opt) => {
			  	switch (opt) {
			  	case OPT1: return <div>Content for option 1</div>;
			  	case OPT2: return <div>Content for option 2</div>;
			  	}
			  }
			</SideMenu>
	      </DialogTab>
	    );
      case TAB2: return (
	      <DialogTab>
	        <SideMenu options={[OPT1, OPT2]}>
			  {(opt) => {
			  	switch (opt) {
			  	case OPT3: return <div>Content for option 1</div>;
			  	case OPT4: return <div>Content for option 2</div>;
			  	}
			  }
			</SideMenu>
	      </DialogTab>
	    );
      }
    }}
</TabbedDialog>
```
# `TabbedDialogWithSideMenu`

The previous example can be rewritten more simply as follows using `TabbedDialogWithSideMenu`:

```jsx
const TAB1: DialogButton = { label: 'Tab 1' };
const TAB2: DialogButton = { label: 'Tab 2' };
const OPT1: DialogButton = { label: 'Opt 1' };
const OPT2: DialogButton = { label: 'Opt 2' };
const OPT3: DialogButton = { label: 'Opt 3' };
const OPT4: DialogButton = { label: 'Opt 4' };

const EXAMPLE_DIALOG = {
  name: "example",
  tabs: [
    { id: 1, tab: TAB1, options: [OPT1, OPT2] },
    { id: 2, tab: TAB2, options: [OPT3, OPT4] },
  ]
}

<TabbedDialogWithSideMenu description={EXAMPLE_DIALOG}>
	{(opt) => {
		switch(opt) {
		case OPT1: return <div>Option 1</div>;
		case OPT2: return <div>Option 2</div>;
		case OPT3: return <div>Option 3</div>;
		case OPT4: return <div>Option 4</div>;
      }
	}
</TabbedDialogWithSideMenu>
```
# `Box`
`Box` provides a container that has a styled border.  It can be used to contain other UI widgets, and some UI widgets come in a `Box`
#### Props
**id** *:string*
> a string id that is passed back in event handlers

**align** *:string*
> justify text content (see *text-align* CSS property)

**justify** *:string*
> justify flex items (see *justify-content* CSS property)

**uppercase** *:boolean* (default false)
> true if text content should be transformed uppercase

**padding** *:boolean* (default true)
> false if there should be no padding between the border and content

**style** *:any*
> style object, applied to the `Box`'s outer div.

**onClick** *:(id: string) => void*
> if defined, called when anywhere in the `Box` is clicked.  The  `id` is the `id` property of the `Box`

# `Field`

`Field` is used to define fields (flex items) within a `Box`.  The behaviour of the field is modified through class names.

### Class Names
**right-align**
> text is aligned right

**half-width**
> the width of the field is  50%

**quater-width**
> the width of the field is 25%

**expand**
> expand to fill available space without triggering overflow (flex: 1 0 0%)

**fixed-height**
> The height, min-height, max-height and line-height of the field are all set to 33 pixels

**is-row**
> The field is set as a flex item container with flow in the horizontal direction

**is-column**
> The field is set as a flex item container with flow in the vertical direction

**at-end**
> The field is set as a flex item container with flow in the horizontal direction and content is justified to within 20px of the right end.  This class is used by the `SliderField` UI widget.

### Props
**style** *:any*
> style object, applied to the `Field`'s div.
# `CheckBoxField`
`CheckBoxField` provides a checkbox style element based on a `Box`. It has a label and a cu-styled radio button to indicate it's on/off state.
### Props
**id** *:string*
> a string id that is passed back in event handlers

**label** *:string*
> The text for the checkbox label displayed to the left of the check box button

**on** *:boolean*
> Is the checkbox on or off

**onToggle** *:(id: string) => void*
> if defined, called whenever the state of the checkbox changes

# `SliderField`
`SliderField`provides a slider control based on a `Box`.  It has a label, a slider and a numerical display.
# Props
**id** *:string*
> a string id that is passed back in event handlers

**label** *:string*
> The text for the slider label displayed to the left of the slider control

**min** *:number*
> The minimum range for the slider value

**max** *:number*
> The maximum range for the slider value

**step** *:number* (not yet implemented)
> The step value or minimum increment/decrement for the slider value.

**current** *:number*
> The current value of the slider

**logrithmic** *:boolean* (default false)
> If true, the slider will work on a logrithmic scale such that the first half of the slider provides finer grained control of the value than the second half.  This is useful when the range of values is huge but you want to allow finder control of values closer to minimum than you do maximum.
>
>An example of this is the **Shadow Distance** setting, which has a range 0-10,000 but values above 500 are not visually obvious, therefore finer control of values up to 500 is required over control of the values from 500-10,000.

**updateInterval** *:number* (default 100ms)
> This property controls how often the `SliderField`control will fire the `onChange` event.  The control handles the current value and position using internal state.  That state is initialised when receiving props.  This setting limits the rate at which `onChange` events will be fired.

**onChange** *:(id: string, value: number) => void*
> if defined, called whenever the value of the slider has changed, rate limited by the `updateInterval`

# `SubHeading`
A simple sub-heading element for separating sections of content.  This component has no props and simply renders its children.
