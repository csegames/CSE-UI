import * as React from 'react';
import { TabbedDialog, DialogButton, DialogTab } from './TabbedDialog';
import { SideMenu, MenuOption, DialogContent } from './SideMenu';

// Re-export these for convenience
export { DialogButton, DialogTab, MenuOption, DialogContent };

interface TabDefinition {
  id: number | string;
  tab: DialogButton;
  options?: MenuOption[];
  buttons?: DialogButton[];
}

export interface DialogDefinition {
  name?: string;
  title: string;
  heading?: boolean;
  tabs?: TabDefinition[];
  buttons?: DialogButton[];
}

interface TabbedDialogWithSideMenuProps {
  definition: DialogDefinition;
  onClose: () => void;
  onAction?: (tab?: DialogButton, action?: DialogButton) => void;
  children?: (option?: MenuOption, tab?: DialogButton) => any;
}

/* tslint:disable:function-name */
export function TabbedDialogWithSideMenu(props: TabbedDialogWithSideMenuProps) {
  const { definition, children } = props;
  const { tabs, title, name, heading, buttons } = definition;
  return (
    <TabbedDialog
      title={title}
	    tabs={tabs && tabs.map(tab => tab.tab)}
      name={name}
      heading={heading}
      onClose={props.onClose}>{
        (tab: DialogButton) => (
          tabs
            ? tabs.filter(tabDef => tabDef.tab === tab).map(tabDef => (
                <DialogTab buttons={tabDef.buttons} onAction={button => props.onAction(tab, button)}>
                  { tabDef.options
                    ? <SideMenu name={name} id={`${tabDef.id}`} options={tabDef.options}>
                        {option => children && children(option, tab)}
                      </SideMenu>
                    : (children && children(undefined, tab))
                  }
                </DialogTab>
              ))[0]
            : (
              <DialogTab buttons={buttons} onAction={button => props.onAction(undefined, button)}>
                { children && children() }
              </DialogTab>
            )
        )
    }</TabbedDialog>
  );
}
