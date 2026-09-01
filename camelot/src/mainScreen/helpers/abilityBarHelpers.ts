import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { HUDWidget } from '../redux/hudSlice';
import { ButtonLayout, AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';

export const getAbilityBarsCount = (widgets: Dictionary<HUDWidget>): number =>
  Object.keys(widgets).filter((widgetName) => {
    return widgets[widgetName].registration && widgetName.startsWith('Bar:');
  }).length - 3; // The -3 is to account for Siege, BuildMode, and DynamicAbilities (system bars).

export const isHighestActiveAbilityBar = (
  layoutID: number,
  layouts: Dictionary<ButtonLayout>,
  groups: Dictionary<AbilityGroup>
): boolean => {
  if (!(layouts && groups) || isNaN(layoutID)) {
    return false;
  }

  let highest = 0;
  Object.values(layouts).forEach((layout) => {
    const group = groups[layout.groupID];
    if (group) {
      const isGroupShown = group.abilities.length > 0;
      const isHighest = layout.id > highest;

      if (isGroupShown && isHighest) {
        highest = layout.id;
        if (highest > layoutID) {
          return false;
        }
      }
    }
  });

  return layoutID === highest;
};
