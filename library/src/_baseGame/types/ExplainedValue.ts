/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * An ExplainedValue is intended to represent a crystallized logic instance.  It should immutably declare what
 * the output (value) of the logic was, as well as what inputs (explanation) resulted in that output.
 */

// Immutable for external consumption.
export interface ExplainedValue<T> {
  readonly name: string;
  readonly value: T;
  readonly explanation: ReadonlyArray<string | ExplainedValue<T>>;
}

// Mutable for internal construction.
interface _ExplainedValue<T> {
  name: string;
  value: T;
  explanation: (string | ExplainedValue<T>)[];
}

export class ExplanationBuilder<T> {
  private ev: _ExplainedValue<T>;
  private readonly retainExplanation: boolean;

  /** retainExplanation should usually be set to "!game.isPublicBuild" */
  constructor(name: string, defaultValue: T, retainExplanation: boolean) {
    this.retainExplanation = retainExplanation;
    this.ev = {
      name,
      value: defaultValue,
      explanation: []
    };
  }

  public getExplainedValue(): ExplainedValue<T> {
    return this.cloneAndFreeze(this.ev);
  }

  public addRow(row: string | ExplainedValue<T>): void {
    if (this.retainExplanation) {
      this.ev.explanation.push(row);
    }
  }

  public setValue(v: T): void {
    this.ev.value = v;
  }

  private cloneAndFreeze(ev: ExplainedValue<T>): ExplainedValue<T> {
    const newEV: ExplainedValue<T> = {
      name: ev.name,
      value: ev.value,
      explanation: ev.explanation.map((ep) => {
        if (typeof ep === 'string') {
          return `${ep}`;
        } else {
          // Infinitely recursive to deep copy all sub-explanations.
          return this.cloneAndFreeze(ep);
        }
      })
    };

    return newEV;
  }
}
