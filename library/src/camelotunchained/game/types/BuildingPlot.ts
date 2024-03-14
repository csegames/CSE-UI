/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export enum BuildingPlotMapUISettings {
  None = 0,
  Plot = 1,
  CapturePlot = 2,
  KeepLordPlot = 3
}

export enum AttackingFactions {
  None = 0,
  TDD = 1,
  Viking = 1 << 1,
  Arthurian = 1 << 2,
  All = TDD | Viking | Arthurian
}
