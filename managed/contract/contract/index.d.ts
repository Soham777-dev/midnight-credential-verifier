import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  verifyEligibility(context: __compactRuntime.CircuitContext<PS>,
                    secretBirthYear_0: bigint,
                    currentYear_0: bigint,
                    userSecretHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setMinimumAge(context: __compactRuntime.CircuitContext<PS>,
                newMinAge_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  verifyEligibility(context: __compactRuntime.CircuitContext<PS>,
                    secretBirthYear_0: bigint,
                    currentYear_0: bigint,
                    userSecretHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setMinimumAge(context: __compactRuntime.CircuitContext<PS>,
                newMinAge_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  verifyEligibility(context: __compactRuntime.CircuitContext<PS>,
                    secretBirthYear_0: bigint,
                    currentYear_0: bigint,
                    userSecretHash_0: Uint8Array): __compactRuntime.CircuitResults<PS, boolean>;
  setMinimumAge(context: __compactRuntime.CircuitContext<PS>,
                newMinAge_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly minRequiredAge: bigint;
  readonly totalVerifiedUsers: bigint;
  readonly contractOwner: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               ownerKey_0: Uint8Array,
               initialMinAge_0: bigint): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
